"use strict";
const User = require("../../models/user");
const { BlogCategory, BlogPost } = require("../../models/blog");
const comment = require("../../models/comment");

///Blog-category
module.exports.BlogCategory = {
  list: async (req, res) => {
    const data = await res.getModelList(BlogCategory);
    res.status(200).send({
      error: false,
      data,
    });
  },
  create: async (req, res) => {
    const data = await BlogCategory.create(req.body);
    res.status(200).send({
      error: false,
      data,
    });
  },
  read: async (req, res) => {
    const data = await BlogCategory.findOne({ _id: req.params.categoryId });
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    const data = await BlogCategory.updateOne(
      { _id: req.params.categoryId },
      req.body
    );
    res.status(200).send({
      error: false,
      data,
      newData: await BlogCategory.findOne({ _id: req.params.categoryId }),
    });
  },
  delete: async (req, res) => {
    const data = await BlogCategory.deleteOne({ _id: req.params.categoryId });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};

//Blog---Post

module.exports.BlogPost = {
  list: async (req, res) => {
    const categories = await BlogCategory.find();

    //blogcategoryId'si categoryid ile eşleşenlerin countu
    for (let category of categories) {
      const blogCount = await BlogPost.countDocuments({
        blogCategoryId: category._id,
      });
      category.blogCount = blogCount;
    }

    const data = await res.getModelList(BlogPost, {}, [
      { path: "blogCategoryId", select: "name" },
      { path: "userId", select: "username" },
    ]);

    //last blog

    const lastBlogs = await BlogPost.find().sort({ createdAt: "desc" });

    res.render("index", {
      data,
      categories,
      lastBlogs,
    });
  },
  adminList: async (req, res) => {
    const categories = await BlogCategory.find();

    // herkes kendi yazdigi bloglari gorsun
    // Login olmus kullanici sadece olusturdugu blog yazilarini düzenleyebilsin.
    const data = await BlogPost.find({ userId: req.session.user.id })
      .populate({
        path: "userId",
        select: "username",
      })
      .populate("blogCategoryId");
    const userData = await User.find();

    res.render("admin", {
      data,
      categories,
      userData,
    });
  },

  create: async (req, res) => {
    const findData = await BlogCategory.find();

    if (req.method == "POST") {
      req.body.userId = req.session?.user.id; //blogu yazan kullanici login olmus kullanıcı
      req.body.images = [];
      for (let file of req.files) {
        req.body.images.push(file.filename);
      }
      const data = await BlogPost.create(req.body);
      res.redirect("/blog/admin");
    } else {
      res.render("create", { findData });
    }
  },
  read: async (req, res) => {
    //ilgili blogun commentleri
    const commentData = await comment.find({ blogId: req.params.postId });
    const blogId = req.params.postId;
    const data = await BlogPost.findOne({ _id: req.params.postId })
      .populate({
        path: "userId",
        select: "username",
      })
      .populate("blogCategoryId");

    res.render("single", { data, commentData, blogId });
  },
  update: async (req, res) => {
    if (req.method == "POST") {
      //update
      const blogimage = await BlogPost.findOne(
        { _id: req.params.postId },
        { images: 1 }
      );

      for (let file of req.files) {
        blogimage.images = []; //eskisi
        blogimage.images.push(file.filename); //yenisi guncellendi
      }
      req.body.images = blogimage.images;

      const data = await BlogPost.updateOne(
        { _id: req.params.postId },
        req.body,
        { runValidators: true }
      );
      res.redirect("/blog/admin");
    } else {
      //view
      const data = await BlogPost.findOne({ _id: req.params.postId });
      res.render("edit", { data });
    }
  },

  delete: async (req, res) => {
    const data = await BlogPost.deleteOne({ _id: req.params.postId });
    if (data.deletedCount > 0) {
      res.redirect("/blog/admin");
    } else {
      res.errorStatusCode = 404;
    }
  },
};
