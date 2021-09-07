// Import
const multer = require("multer");
const fs = require("fs-extra");
// Dictionnair de correspondances des extentions
const MIME_TYPES = {
    "image/jpg": ".jpg",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
};

const storage = multer.diskStorage({

    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        console.log(file);
        const name = file.originalname.split(" ").join("_").split(".")[0];
        console.log(name);
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + extension);
    },
});
module.exports = multer({ storage: storage }).single("image");