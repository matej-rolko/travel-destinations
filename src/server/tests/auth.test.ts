import { test, type TestContext } from "node:test";
import {
    login,
    signup,
    verifyToken,
    createToken,
    extractToken,
    AuthErrors,
    User,
    authTokenDataSchema,
    Token,
    UserWithToken,
    TokenUnverified,
} from "$lib/auth";
import { err, type Result } from "$shared/result";
import jwt from "jsonwebtoken";
import { Models } from "~/db";
import { faker } from "@faker-js/faker";
import { env } from "~/env";
import { Model } from "mongoose";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fakeUser = () => {
    const { person, internet, date } = faker;
    return new Models.User({
        first_name: person.firstName(),
        last_name: person.lastName(),
        username: internet.userName(),
        email: internet.email(),
        password: internet.password(),
        created: date.recent(),
        isAdmin: false,
        travels: [],
    });
};

let store: User[] = [];

(Models.User.findOne as unknown) = (e: { email: string }) => {
    return store.find((x) => x.email == e.email) || null;
};

Models.User.prototype.save = function () {
    store.push(this);
};

const mockDB = (_t: TestContext, emptyDb: boolean) => {
    const user = fakeUser();
    store = emptyDb ? [] : [user];
    return { user, db: Models.User };
};

function assert(t: TestContext, val: unknown, msg?: string): asserts val {
    t.assert.ok(val, msg);
}

async function assertUserWithToken(
    t: TestContext,
    db: Model<User>,
    result: Result<UserWithToken, unknown>,
    user: User,
) {
    assert(
        t,
        result.success,
        `result is not ok: ${JSON.stringify((result as { error?: unknown })?.error)}`,
    );
    const { token, user: resUser } = result.data;
    t.assert.deepEqual(resUser, user, "Users mismatch");
    assert(
        t,
        (await verifyToken(db, token)).success,
        "token verification result is not ok",
    );
}

test("signup - successful user creation", async (t) => {
    const { user, db } = mockDB(t, true);

    const result = await signup(db, user);
    await assertUserWithToken(t, db, result, user);
});

test("signup - email already taken", async (t) => {
    const { user, db } = mockDB(t, false);

    const result = await signup(db, user);
    t.assert.deepEqual(result, err(AuthErrors.emailTaken));
});

test("login - successful login", async (t) => {
    const { user, db } = mockDB(t, false);

    const result = await login(db, user);
    await assertUserWithToken(t, db, result, user);
});

test("login - email does not exist", async (t) => {
    const { db, user } = mockDB(t, true);

    const result = await login(db, user);
    t.assert.deepEqual(result, err(AuthErrors.emailNotExist));
});

test("login - wrong password", async (t) => {
    const { user, db } = mockDB(t, false);
    const { email } = user;
    const { password } = fakeUser();

    const result = await login(db, { email, password });
    t.assert.deepEqual(result, err(AuthErrors.wrongPassword));
});

test("verifyToken - valid token", async (t) => {
    const { db, user } = mockDB(t, false);
    const token = createToken(user);
    const result = await verifyToken(db, token);
    await assertUserWithToken(t, db, result, user);
});

test("verifyToken - expired token", async (t) => {
    const { db, user } = mockDB(t, false);

    const token = jwt.sign(
        authTokenDataSchema.strip().parse(user),
        env.AUTH_SECRET,
        {
            expiresIn: "1ms",
        },
    ) as Token;
    await sleep(20);

    const result = await verifyToken(db, token);
    t.assert.deepEqual(result, err(AuthErrors.sessionExpired));
});

test("verifyToken - invalid token", async (t) => {
    const { db } = mockDB(t, false);
    const invalidToken = "invalid-token" as TokenUnverified;

    const result = await verifyToken(db, invalidToken);
    t.assert.deepEqual(result, err(AuthErrors.wrongToken));
});

test("extractToken - token present in headers", (t) => {
    const val = "someval";
    const headers = {
        authorization: `Bearer ${val}`,
    };

    const token = extractToken(headers);
    t.assert.equal(token, val);
});

test("extractToken - no token present", (t) => {
    const headers = {};

    const token = extractToken(headers);
    t.assert.equal(token, null);
});

test("extractToken - malformed authorization header", (t) => {
    const headers = {
        authorization: "InvalidBearer token",
    };

    const token = extractToken(headers);
    t.assert.equal(token, null);
});

test("createToken - token payload structure", async (t) => {
    const { user } = mockDB(t, false);
    const token = createToken(user);
    const decoded = authTokenDataSchema.safeParse(jwt.decode(token));

    assert(t, decoded.success);
    const { email } = decoded.data;
    t.assert.equal(email, user.email, "Email mismatch");
});
