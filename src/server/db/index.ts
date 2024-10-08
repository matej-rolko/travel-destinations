import { err, ok, type Result } from "$shared/result";
import mongoose from "mongoose";
import { Destination } from "./schemas/destinationSchema";
import type { Model as Schema, UpdateQuery } from "mongoose";
import { User } from "./schemas/userSchema";

// TS helper to extract Model type from Schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractModel<T extends Schema<any>> =
    T extends Schema<infer U> ? U : never;

export const Models = {
    Destination,
    User,
};

export type Model = (typeof Models)[keyof typeof Models];

type Params = Record<string, unknown>;

/**
 * Runs validated DB operations with try/catch and returns it as Result
 * @param f function to run
 * @returns Result with return value of the function or mongoose ValidationError
 */
const runSafe = async <Ok>(
    f: () => Promise<Ok>,
): Promise<Result<Ok, mongoose.Error.ValidationError>> => {
    try {
        return ok(await f());
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) return err(e);
        throw e;
    }
};

export async function getAll<T>(model: Schema<T>, params: Params) {
    const query = createSearchQuery(params);
    return await model.find(query);
}

export async function getById<T>(model: Schema<T>, id: unknown) {
    return await model.findById(id);
}

export async function create<T>(
    model: Schema<T>,
    data: ExtractModel<Schema<T>>,
) {
    return await runSafe(async () => {
        const newEntry = new model(data);
        return await newEntry.save();
    });
}

export async function update<T>(
    model: Schema<T>,
    id: unknown,
    data: UpdateQuery<T>,
) {
    return await runSafe(async () => {
        return await model.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    });
}

// Named it del because delete is a reserved word

export async function del<T>(model: Schema<T>, id: unknown) {
    return await model.findByIdAndDelete(id);
}

export function createSearchQuery(params: object): Params {
    // Loop over the queryParams to construct the query object
    const query: Params = {};
    for (const [key, value] of Object.entries(params))
        query[key] = { $regex: value, $options: "i" }; // i = case insensitive
    return query;
}
