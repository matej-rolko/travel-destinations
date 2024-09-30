import { Destination } from "./schemas/destinationSchema";

export const Models = {
    Destination,
};

export async function getAll(model, params) {
    const query = createSearchQuery(params);
    return await model.find(query);
}

export async function getById(model, id) {
    return await model.findById(id);
}

export async function create(model, data) {
    const newEntry = new model(data);
    return await newEntry.save();
}

export async function update(model, id, data) {
    return await model.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    );
}

// Named it del because delete is a reserved word
export async function del(model, id) {
    return await model.findByIdAndDelete(id);
}

export function createSearchQuery(params) {
    // Loop over the queryParams to construct the query object
    let query = {};
    for (const [key, value] of Object.entries(params))
        query[key] = { $regex: value, $options: "i" }; // i = case insensitive
    return query;
}
