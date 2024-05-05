const comment = require("../../controllers/views/comment");
const express = require("express");
const router = express.Router();

const permission = require("../../middlewares/permission");

router.all("/comment/create", permission.isLogin, comment.create);

module.exports = router;
