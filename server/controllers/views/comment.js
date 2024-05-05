const comment = require("../../models/comment");

module.exports = {
  create: async (req, res) => {
    if (req.method == "POST") {
      const data = await comment.create({
        blogId: req.body.blogId,
        comment: req.body.comment,
        author: req.session.user.username, //login olmus kullanicin adi
      });
      res.redirect(`/blog/${req.body.blogId}`);
    } else {
      res.render("single");
    }
  },
  delete: async (req, res) => {
    const data = await comment.deleteMany();
    res.send({ data });
  },
};
