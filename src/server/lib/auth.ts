import type { IncomingHttpHeaders } from "http";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "$env";
import type { Branded } from "$shared/branded";
import { err, ok } from "$shared/result";
import { create, type ExtractModel, Models } from "~/db";

const TOKEN_AGE = 60 * 30; // 30min

export const AuthErrors = {
    emailTaken: "Email already taken!",
    emailNotExist: "Email doesn't exist!",
    wrongPassword: "Wrong password!",
    wrongToken: "Token is incorrect!",
    sessionExpired: "Session expired! Log again!",
} as const satisfies Record<string, string>;

/* Schemas */

const emailSchema = z.string().email().min(1);

const authTokenDataSchema = z.object({
    email: emailSchema,
});

type AuthTokenData = z.infer<typeof authTokenDataSchema>;

const userCredentialsSchema = z.object({
    email: emailSchema,
    password: z.string(),
});

type UserCredentials = z.infer<typeof userCredentialsSchema>;

/* DB helpers */

export type User = ExtractModel<(typeof Models)["User"]>;

const findUser = async (user: AuthTokenData) =>
    await Models.User.findOne(authTokenDataSchema.strip().parse(user));

const createUser = async (user: User) => {
    const foundUser = await findUser(user);
    if (foundUser != null) return err(AuthErrors.emailTaken);
    const x = await create(Models.User, user);
    return x;
};

/* Token API */

export type Token = Branded<string, "Token">;
export type UnverifiedToken = Branded<string, "UnverifiedToken">;

export const extractToken = async (
    headers: IncomingHttpHeaders,
): Promise<UnverifiedToken | null> => {
    const authHeader = headers.authorization;
    if (authHeader) return authHeader.split(" ")[1] as UnverifiedToken;
    return null;
};

export const createToken = (usr: AuthTokenData): Token => {
    // just for safety strip usr of any garbage
    return jwt.sign(authTokenDataSchema.strip().parse(usr), env.AUTH_SECRET, {
        expiresIn: TOKEN_AGE,
    }) as Token;
};

export const verifyToken = async (token: UnverifiedToken | Token) => {
    try {
        const payload = jwt.verify(token, env.AUTH_SECRET, {
            // maxAge: TOKEN_AGE,
        }) as Record<string, unknown> & { iat?: number; exp?: number };
        const result = authTokenDataSchema.safeParse(payload);
        if (!result.success) return err(AuthErrors.wrongToken);
        const user = await findUser(result.data);
        if (user == null) return err(AuthErrors.wrongToken);
        return ok(user);
    } catch (e) {
        console.warn(e);
        return err(AuthErrors.sessionExpired);
    }
};

/* User API */

export const login = async (cred: UserCredentials) => {
    const user = await findUser(cred);
    if (user == undefined) {
        return err(AuthErrors.emailNotExist);
    }
    if (cred.password != user.password) {
        return err(AuthErrors.wrongPassword);
    }
    const token = createToken(cred);
    // WARN: we shouldn't move user around with his password dangling but it's fine for this demo app
    return ok({ user, token });
};

export const signup = async (user: User) => {
    const result = await createUser(user);
    if (!result.success) return result;
    const token = createToken(result.data);
    return ok({ user, token });
};
