const user = require("../../controllers/views/user");
const express = require("express");
const router = express.Router();

const permission = require("../../middlewares/permission");

router.all("/login", user.login);
router.all("/logout", user.logout);
router.all("/register", user.register);
router.all("/:id/delete", user.delete);

module.exports = router;
