export const findOne = async ({
  model, //=>userModel
  filter = {}, //=>{email,password}
  select = "", //=>"-password"
  options = {},
}) => {
  // return await model.findOne(filter,select,options);

  let doc = model.findOne(filter);
  if (select.length) {
    doc.select(select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }
  return await doc;
};

export const findAll = async ({
  model,
  filter = {},
  select = "",
  options = {},
}) => {
  let doc = model.find(filter);
  if (select.length) {
    doc.select(select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }
  return await doc;
};

export const insertOne = async ({ model, data }) => {
  return await model.create(data);
};
export const findById = async ({ model, id, select = "", options = {} }) => {
  let doc = model.findById(id);
  if (select.length) {
    doc.select(select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }
  return await doc;
};

export const findOneAndDelete = async ({
  model,
  filter = {},
  options = {},
}) => {
  let doc = model.findOneAndDelete(filter, options);
  return await doc;
};