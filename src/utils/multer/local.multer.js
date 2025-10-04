import fs from "node:fs";
import path from "path";
import multer from "multer";

export const fileValidation = {
    image : ["image/jpeg", "image/jpg", "image/png"],
    pdf : ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
}
export const localFileUpload = ({ customPath = "general" , validation=[] } = {}) => {
  let basePath = `uploads/${customPath}`;

  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      if (req.user?._id) {
        basePath += `/${req.user._id}`;
      }
      const fullPath = path.resolve(`./src/${basePath}`);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      callback(null, path.resolve(fullPath));
    },
    filename: function (req, file, callback) {
      const uniqueFileName =
        Date.now() + "__" + Math.random() + "__" + file.originalname;
      file.finalPath = basePath + "/" + uniqueFileName;
      callback(null, uniqueFileName);
    },
  });

  const fileFilter = function (req, file, callback) {
    if (validation.includes(file.mimetype)) {
      return callback(null, true);
    }
    return callback(new Error("In-valid file format"), false);
  };

  return multer({
    fileFilter,
    storage,
  });
};
