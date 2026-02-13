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

export const findById = async ({ model, id }) => {
  return await model.findById(id)
};
