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

export function createSearchQuery(params) {

  // Loop over the queryParams to construct the query object
  let query = {};
  for (const [key, value] of Object.entries(params))
    query[key] = { $regex: value, $options: 'i' }; // i = case insensitive
  return query;
}
