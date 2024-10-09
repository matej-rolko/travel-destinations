import { err, ok } from "$shared/result";
import { Router } from "express";
import z from "zod";
import { Models } from "~/db";
import {
    AuthErrors,
    login,
    signup,
    TokenUnverified,
    tokenUnverifiedSchema,
    userCredentialsSchema,
    verifyToken,
} from "~/lib/auth";
import { makeEndpoint } from "~/lib/utils/handler";

const tokenRequestSchema = z.object({
    token: tokenUnverifiedSchema,
});

export const authRouter = Router()
    .post(
        "/login",
        makeEndpoint(userCredentialsSchema, async (body) => {
            const result = await login(body);
            if (!result.success) {
                console.info(
                    `login attempt failed: ${body.email} - ${result.error}`,
                );
                return {
                    status: 403,
                    body: err(result.error),
                };
            }
            const user = result.data;
            console.info(`login attempt successful: ${user}`);
            return {
                status: 200,
                body: ok(user),
            };
        }),
    )
    .post(
        "/logout",
        makeEndpoint(tokenRequestSchema, async (body) => {
            const token = body.token as TokenUnverified;
            // TODO in future save sessions to DB
            // for now we just return ok or err
            if ((await verifyToken(token)) == null) {
                return {
                    status: 403, // TODO: better code
                    body: err(AuthErrors.wrongToken),
                };
            }
            return {
                status: 200,
                body: ok(),
            };
        }),
    )
    .post(
        "/signup",
        makeEndpoint(Models.User, async (body) => {
            const user = await signup(body);
            if (user == null) {
                return {
                    status: 400,
                    body: err(AuthErrors.emailTaken),
                };
            }
            return {
                status: 200,
                body: ok(user),
            };
        }),
    )
    .post(
        "/verify",
        makeEndpoint(tokenRequestSchema, async (body) => {
            const token = body.token as TokenUnverified;
            const user = await verifyToken(token);
            return {
                status: user.success ? 200 : 400,
                body: user.success ? ok(user.data) : err(user.error),
            };
        }),
    );
