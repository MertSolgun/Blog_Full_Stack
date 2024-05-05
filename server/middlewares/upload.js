const multer = require("multer");

//UPLOAD
//npm i multer
//multer module ile form-data verileri kabul edebiliriz.dosya yukleme yapilabilir

module.exports = multer({
  storage: multer.diskStorage({
    destination: "./uploads",
    filename: function (req, file, returnCallback) {
      returnCallback(null, file.originalname);
    },
  }),
});
