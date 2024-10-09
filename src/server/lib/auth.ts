import { z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "$env";
import { err, ok, type Result } from "$shared/result";
import { create, type ExtractModel, Models } from "~/db";
import type mongoose from "mongoose";
import type { IncomingHttpHeaders } from "http";

const TOKEN_AGE = 60 * 30; // 30min

/**
 * Possible errors from auth logic.
 */
export const AuthErrors = {
    emailTaken: "Email already taken!",
    emailNotExist: "Email doesn't exist!",
    wrongPassword: "Wrong password!",
    wrongToken: "Token is incorrect!",
    sessionExpired: "Session expired! Log again!",
} as const satisfies Record<string, string>;

/* Schemas */

export const emailSchema = z.string().email().min(1);

export const authTokenDataSchema = z.object({
    email: emailSchema,
});

export type AuthTokenData = z.infer<typeof authTokenDataSchema>;

export const userCredentialsSchema = z.object({
    email: emailSchema,
    password: z.string(),
});

export type UserCredentials = z.infer<typeof userCredentialsSchema>;

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

const _tokenSchema = z.string().min(64).max(64);

export const tokenSchema = _tokenSchema.brand("Token");
/**
 * Verified JWT Token
 */
export type Token = z.infer<typeof tokenSchema>;

export const tokenUnverifiedSchema = _tokenSchema.brand("TokenUnverified");
/**
 * Unverified JWT Token
 */
export type TokenUnverified = z.infer<typeof tokenUnverifiedSchema>;

/**
 * Extract Token from http headers
 * @param headers http headers
 * @returns Unverified token or `null`
 */
export const extractToken = (
    headers: IncomingHttpHeaders,
): TokenUnverified | null => {
    const authHeader = headers.authorization;
    if (authHeader) return authHeader.split(" ")[1] as TokenUnverified;
    return null;
};

/**
 * Creates a new verified token for the given user data
 * @param user user data needed for token
 * @returns Verified token
 */
export const createToken = (user: AuthTokenData): Token => {
    // just for safety strip usr of any garbage
    return jwt.sign(authTokenDataSchema.strip().parse(user), env.AUTH_SECRET, {
        expiresIn: TOKEN_AGE,
    }) as Token;
};

export type UserWithToken = {
    user: User;
    token: Token;
};

/**
 * Type-safe and exception-safe wrapper around jwt.verify
 * @param token JWT token
 * @returns payload or `null`
 */
const jwtSafeVerify = (token: TokenUnverified | Token) => {
    try {
        return jwt.verify(token, env.AUTH_SECRET, {
            // maxAge: TOKEN_AGE,
        }) as Record<string, unknown> & { iat?: number; exp?: number };
    } catch (e) {
        console.warn(e);
        return null;
    }
};

/**
 * Verify that token is correct and not expired
 * @param token JWT Token
 * @returns `Result` with `UserWithToken` on success or reason on error
 */
export const verifyToken = async (
    token: TokenUnverified | Token,
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

/**
 * API to log in an existing user
 * @param cred user credentials
 * @returns `Result` with `User` and `Token` on success or reason on error
 */
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

/**
 * API to sign up a new user
 * @param user `User` object
 * @returns `Result` with `User` and `Token` on success or reason on error
 */
export const signup = async (user: User) => {
    const result = await createUser(user);
    if (!result.success) return result;
    const token = createToken(result.data);
    // WARN: we shouldn't move user around with his password dangling but it's fine for this demo app
    return ok({ user, token });
};
