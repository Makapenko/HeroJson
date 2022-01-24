const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'img')
  },
  filename(req, file, cb) {
    cb(null, 'hero')
  }
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg") {
    cb(null, true)
  } else {
    return cb(new Error("Invalid mime type"))
  }
}

const limits = {
  fileSize: 1024 * 1024
}

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
})
