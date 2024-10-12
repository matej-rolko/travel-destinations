import { err, type Result } from "$shared/result";
import { type Handler } from "express-serve-static-core";
import mongoose from "mongoose";
import z from "zod";
import { Context, extractAuthCtx } from "~/middlewares/auth";

type EndpointResponse<T> = {
    status: number;
    body: T;
};

type HandlerCallback<Body, RespOk, RespErr, Ctx> = (
    body: Body,
    params: Record<string, unknown>,
    query: Record<string, unknown>,
    context: Ctx,
) => Promise<
    EndpointResponse<
        Result<RespOk, RespErr> | Result<RespOk> | Result<void, RespErr>
    >
>;

type ParseResult<Body> =
    | {
          success: true;
          data: Body;
      }
    | {
          success: false;
      };

const parseMongoose = <Body>(
    schema: mongoose.Model<Body>,
    data: unknown,
): ParseResult<Body> => {
    const parsed = new (schema as mongoose.Model<Body>)(data);
    const maybe_err = parsed.validateSync();
    if (maybe_err != null) return err(maybe_err);
    return { success: true, data: parsed };
};

const parseZod = <Body>(
    schema: z.Schema<Body>,
    data: unknown,
): ParseResult<Body> => {
    const maybe = schema.safeParse(data);
    if (!maybe.success) {
        return err(maybe.error);
    }
    return { success: true, data: maybe.data };
};

const isModel = <Body>(
    schema: z.Schema<Body> | mongoose.Model<Body>,
): schema is mongoose.Model<Body> =>
    (schema as { prototype?: unknown })?.prototype instanceof mongoose.Model;

export const parse = <Body>(
    schema: z.Schema<Body> | mongoose.Model<Body>,
    data: unknown,
) => (isModel(schema) ? parseMongoose(schema, data) : parseZod(schema, data));

export const makeEndpoint = <Body, RespOk, RespErr>(
    schema: z.Schema<Body> | mongoose.Model<Body>,
    f: HandlerCallback<Body, RespOk, RespErr, Context | undefined>,
): Handler => {
    return async (req, res) => {
        const _req = req as unknown as Request & { context?: Context };
        const maybe = parse(schema, req.body);
        if (!maybe.success) {
            res.status(403).json(maybe);
            return;
        }
        const { status, body } = await f(
            maybe.data as Body,
            req.params,
            req.query,
            _req?.context,
        );
        res.status(status).json(body);
        return;
    };
};

export const makeAuthedEndpoint = <Body, RespOk, RespErr>(
    schema: z.Schema<Body> | mongoose.Model<Body>,
    f: HandlerCallback<Body, RespOk, RespErr, Context>,
): Handler => {
    const inner = makeEndpoint(
        schema,
        f as HandlerCallback<Body, RespOk, RespErr, Context | undefined>,
    );
    return async (req, res, next) => {
        const _req = req as unknown as Request & { context?: Context };
        extractAuthCtx(_req);
        inner(req, res, next);
    };
};
