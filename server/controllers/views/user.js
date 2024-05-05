"use strict";

const passEncrypt = require("../../helpers/passEncrypt");
const userSchema = require("../../models/user");

module.exports = {
  list: async (req, res) => {
    const userData = await userSchema.find();
  },
  delete: async (req, res) => {
    const data = await userSchema.deleteOne();
    res.status(200).send({
      error: false,
      data,
    });
  },

  register: async (req, res) => {
    if (req.method == "POST") {
      const data = await userSchema.create(req.body);
      res.redirect("/user/login");
    } else {
      res.render("register");
    }
  },

  login: async (req, res) => {
    if (req.method == "POST") {
      const { username, password } = req.body;

      if (username && password) {
        //req.bodyden gelen username,password registerDatasinda varmi?
        const user = await userSchema.findOne({ username, password });

        if (user && user.password == passEncrypt(password)) {
          req.session = {
            user: {
              id: user.id,
              username: user.username,
              password: user.password,
              isAdmin: user.isAdmin,
            },
          };

          if (!req.session.user.isAdmin) {
            res.redirect("/blog");
          } else {
            res.redirect("/blog/admin");
          }
        } else {
          res.errorStatusCode = 401;
          throw new Error("Login parameters are not true.");
        }
      } else {
        res.errorStatusCode = 401;
        throw new Error("Username and password are required");
      }
    } else {
      res.render("login");
    }
  },
  logout: async (req, res) => {
    req.session = null;
    res.redirect("/user/login");
  },
};
