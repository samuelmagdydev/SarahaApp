import multer from "multer";

export const fileValidation = {
  image: ["image/jpeg", "image/jpg", "image/png"],
  pdf: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};
export const cloudFileUpload = ({ validation = [] } = {}) => {
  
  const storage = multer.diskStorage({});

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
