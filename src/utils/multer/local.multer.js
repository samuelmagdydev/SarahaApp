import fs from "node:fs";
import path from "path";
import multer from "multer";

export const localFileUpload = ({ customPath = "general" } = {}) => {
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
  return multer({
    dest: "./temp",
    storage,
  });
};
