import { z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "$env";
import { err, ok, type Result } from "$shared/result";
import { create, type ExtractModel, Models } from "~/db";
import type mongoose from "mongoose";
import type { IncomingHttpHeaders } from "http";
import type { Branded } from "$shared/branded";

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

const findUser = async (user: AuthTokenData): Promise<User | null> =>
    await Models.User.findOne(authTokenDataSchema.strip().parse(user));

const createUser = async (
    user: User,
): Promise<
    Result<
        User,
        mongoose.Error.ValidationError | (typeof AuthErrors)["emailTaken"]
    >
> => {
    const foundUser = await findUser(user);
    if (foundUser != null) return err(AuthErrors.emailTaken);
    return await create(Models.User, user);
};

/* Token API */

export type Token = Branded<string, "Token">;
export type UnverifiedToken = Branded<string, "UnverifiedToken">;

export const extractToken = (
    headers: IncomingHttpHeaders,
): UnverifiedToken | null => {
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

export type UserWithToken = {
    user: User;
    token: Token;
};

const jwtSafeVerify = (token: UnverifiedToken | Token) => {
    try {
        return jwt.verify(token, env.AUTH_SECRET, {
            // maxAge: TOKEN_AGE,
        }) as Record<string, unknown> & { iat?: number; exp?: number };
    } catch (e) {
        console.warn(e);
        return null;
    }
};

export const verifyToken = async (
    token: UnverifiedToken | Token,
): Promise<
    Result<UserWithToken, (typeof AuthErrors)["wrongToken" | "sessionExpired"]>
> => {
    const maybe_payload = jwtSafeVerify(token);
    if (maybe_payload == null) return err(AuthErrors.sessionExpired);
    const result = authTokenDataSchema.safeParse(maybe_payload);
    if (!result.success) return err(AuthErrors.wrongToken);
    const user = await findUser(result.data);
    if (user == null) return err(AuthErrors.wrongToken);
    return ok({ user, token: token as Token });
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
    // WARN: we shouldn't move user around with his password dangling but it's fine for this demo app
    return ok({ user, token });
};
