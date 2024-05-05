const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("Db Connected"))
  .catch(() => console.log("Db not connected"));

module.exports = { mongoose };
