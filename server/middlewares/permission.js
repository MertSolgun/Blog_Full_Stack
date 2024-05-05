"use strict";

module.exports = {
  isLogin: async (req, res, next) => {
    if (req.session?.user) {
      next();
    } else {
      res.errorStatusCode = 401;
      res.render("error", { errorMessage: "You must login for create" });
    }
  },
  isAdmin: async (req, res, next) => {
    if (req.session?.user && req.session?.user?.isAdmin) {
      next();
    } else {
      res.errorStatusCode = 401;
      res.render("error", { errorMessage: "You do not have admin rights!" });
    }
  },
};
