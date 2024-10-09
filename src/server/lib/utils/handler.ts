import { err, type Result } from "$shared/result";
import { type Handler } from "express-serve-static-core";
import mongoose from "mongoose";
import z from "zod";

type EndpointResponse<T> = {
    status: number;
    body: T;
};

export const makeEndpoint = <Body, RespOk, RespErr>(
    schema: z.Schema<Body> | mongoose.Model<Body>,
    f: (
        body: Body,
    ) => Promise<
        EndpointResponse<
            Result<RespOk, RespErr> | Result<RespOk> | Result<void, RespErr>
        >
    >,
): Handler => {
    return async (req, res) => {
        if (schema instanceof mongoose.Model) {
            const parsed = new (schema as mongoose.Model<Body>)(req.body);
            const maybe_err = parsed.validateSync();
            if (maybe_err != null) {
                res.status(403).json(err("Wrong body!"));
                return;
            }
            const { status, body } = await f(parsed);
            res.status(status).json(body);
            return;
        }
        const maybe = (schema as z.Schema<Body>).safeParse(req.body);
        if (!maybe.success) {
            res.status(403).json(err("Wrong body!"));
            return;
        }
        const { status, body } = await f(maybe.data);
        res.status(status).json(body);
    };
};
