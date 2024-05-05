const express = require("express");

const router = express.Router();
const { BlogCategory, BlogPost } = require("../../controllers/views/blog");
const upload = require("../../middlewares/upload");

const permission = require("../../middlewares/permission");
///Blog-Category

router.all("/category", BlogCategory.list);
router.all("/category/create", BlogCategory.create);
router.all("/category/:categoryId", BlogCategory.read);
router.all("/category/:categoryId/update", BlogCategory.update);
router.all("/category/:categoryId/delete", BlogCategory.delete);

///Blog-Post

router.all("/", BlogPost.list);
router.all("/admin", permission.isLogin, BlogPost.adminList);

router.all(
  "/create",
  permission.isLogin,
  upload.array("images"),
  BlogPost.create
);
router.all("/:postId", BlogPost.read);
router.all("/:postId/update", upload.array("images"), BlogPost.update);
router.all("/:postId/delete", BlogPost.delete);

module.exports = router;
