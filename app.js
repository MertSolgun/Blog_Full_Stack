const express = require("express");
const app = express();
require("dotenv").config();

//Db connection

require("./server/config/dbConnection");

// session

const session = require("cookie-session");
app.use(
  session({ secret: process.env.SECRET_KEY || "secret_keys_for_cookies" })
);

/* -------------------Middleware-------------------------------- */

//To accept to json
app.use(express.json());

//To accept to form data
app.use(express.urlencoded({ extended: true }));

//Filtering
app.use(require("./server/middlewares/queryHandler"));

app.use("/tinymce", express.static("./node_modules/tinymce"));

/* ------------------Views------------------------------------- */
app.set("view engine", "ejs");
app.set("views", "./public/views");
app.use("/assets", express.static("./public/assets"));
app.use(express.static("public"));
/* ------------------Views------------------------------------- */

//Local
app.use((req, res, next) => {
  res.locals = {
    user: req.session?.user,
  };
  next();
});

app.all("/", (req, res) => {
  res.redirect("/blog");
});

app.use("/uploads", express.static("uploads"));

/* ------------------Router------------------------------------- */

//Views-router
app.use("/blog", require("./server/routes/views/blog"));
app.use("/user", require("./server/routes/views/user"));
app.use("/", require("./server/routes/views/comment"));

//Api-router
app.use("/api/blog", require("./server/routes/api/blog"));
/* ------------------Router------------------------------------- */

//error-handler
app.use(require("./server/middlewares/errorHandler"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server runned");
});
