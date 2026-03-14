import multer from "multer";
import fs from "fs";

export let extentions = {
  image: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  video: ["video/mp4", ",video/webm", "video/ogg"],
  pdf: ["application/pdf"],
};

export let multer_local = (
  { custompath, allowedExtentions ,maxSize} = { custompath: "general",maxSize:5 },
) => {
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let filepath = `upload/${custompath}`;
      if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, { recursive: true });
      }
      cb(null, filepath);
    },
    filename: function (req, file, cb) {
      let prefix = Date.now();
      let filename = `${prefix}-${file.originalname}`;
      cb(null, filename);
    },
  });
  let fileFilter = (req, file, cb) => {
    if (!allowedExtentions.includes(file.mimetype)) {
      cb("file type not allowed", false);
    }

    cb(null, true);
  };

  return multer({ storage, fileFilter,limits:{fileSize:1024*1024*maxSize} });
};
