import { Destination } from "./schemas/destinationSchema";
import type { Model as Schema } from "mongoose";

// TS helper to extract Model type from Schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractModel<T extends Schema<any>> =
    T extends Schema<infer U> ? U : never;

export const Models = {
    Destination,
};

export type Model = (typeof Models)[keyof typeof Models];

type Params = Record<string, unknown>;

export async function getAll<M extends Model>(model: M, params: Params) {
    const query = createSearchQuery(params);
    return await model.find(query);
}

export async function getById<M extends Model>(model: M, id: unknown) {
    return await model.findById(id);
}

export async function create<M extends Model>(model: M, data: ExtractModel<M>) {
    const newEntry = new model(data);
    return await newEntry.save();
}

export async function update<M extends Model>(
    model: M,
    id: unknown,
    data: ExtractModel<M>,
) {
    return await model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
}

// Named it del because delete is a reserved word
export async function del<M extends Model>(model: M, id: unknown) {
    return await model.findByIdAndDelete(id);
}

export function createSearchQuery(params: object): Params {
    // Loop over the queryParams to construct the query object
    const query: Params = {};
    for (const [key, value] of Object.entries(params))
        query[key] = { $regex: value, $options: "i" }; // i = case insensitive
    return query;
}
