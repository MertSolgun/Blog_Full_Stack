const { mongoose } = require("../config/dbConnection");
const passEncrypt = require("../helpers/passEncrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      set: (password) => passEncrypt(password),
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "user",
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);
