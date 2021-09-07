//Import
const limiter = require("../middleware/express-rate-limit");
const express = require("express");
const router = express.Router();
const authen = require("../middleware/authen");
const usersCtrl = require("../controllers/users");
const multer = require("../middleware/multer-config");

// localhost:3000/api/users
router.post("/register", multer, usersCtrl.register);
//router.post("/login", limiter, usersCtrl.login);
router.post("/login", usersCtrl.login);

router.get("/all-profiles/:id", authen, usersCtrl.allProfiles);
router.get("/user-profile/:id", usersCtrl.userProfile);
router.put("/modify-profile/:id", authen, multer, usersCtrl.modifyProfile);
router.put("/modify-email/:id", authen, multer, usersCtrl.modifyEmail);
router.put("/modify-password/:id", authen, multer, usersCtrl.modifyPassword);
router.delete("/delete-profiles/:id", authen, usersCtrl.deleteProfile);
module.exports = router;