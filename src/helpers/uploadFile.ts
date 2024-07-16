const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req:Request, file:any, cb:any) {
    return cb(null, path.join(__dirname, '../../public/uploads/products/'));
  },
  filename: function (req:Request, file:any, cb:any) {
    return cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage }).array("images", 5);