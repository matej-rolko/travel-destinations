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
            const result = await login(Models.User, body);
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
            const result = await verifyToken(Models.User, token);
            if (!result.success) {
                return {
                    status: 403, // TODO: better code
                    body: result,
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
            const user = await signup(Models.User, body);
            if (!user.success) {
                return {
                    status: 400,
                    body: err(user.error),
                };
            }
            return {
                status: 200,
                body: ok(user.data),
            };
        }),
    )
    .post(
        "/verify",
        makeEndpoint(tokenRequestSchema, async (body) => {
            const token = body.token as TokenUnverified;
            const user = await verifyToken(Models.User, token);
            return {
                status: user.success ? 200 : 400,
                body: user.success ? ok(user.data) : err(user.error),
            };
        }),
    );
