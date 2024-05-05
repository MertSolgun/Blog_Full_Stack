"use strict";

module.exports = (req, res, next) => {
  let search = req.query?.search;

  let sort = req.query?.sort || { createdAt: "desc" };

  let limit = Number(req.query?.limit);
  limit = limit > 0 ? limit : Number(process.env?.PAGE_SIZE || 20);

  const filter = req.query?.filter || {};

  res.getModelList = async (Model, customFilter = {}, populate = null) => {
    return await Model.find({ ...filter, ...search, ...customFilter })
      .sort(sort)
      .limit(limit)
      .populate(populate);
  };
  next();
};
