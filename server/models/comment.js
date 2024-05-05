const { mongoose } = require("../config/dbConnection");

const commentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
    },
  },
  {
    collection: "comment",
    timestamps: true,
  }
);
module.exports = mongoose.model("Comment", commentSchema);
