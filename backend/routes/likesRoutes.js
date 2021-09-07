const express = require("express");

const router = express.Router();
const auth = require("../middleware/authen");

const multer = require("../middleware/multer-config");

const likesCtrl = require("../controllers/Likes");
const authen = require("../middleware/authen");

// localhost:3000/api/messages/Like
router.get("/IdMessages/:messageId/like", likesCtrl.countLike);
router.get('/IdMessages/:messageId/dislike', likesCtrl.countDislike);
router.get('/IdUser/:id/IdMessages/:messageId/viewLikeDislike', likesCtrl.viewLikeDislike);
router.post("/IdMessages/:messageId/IdUser/:id/like", authen, likesCtrl.likeMessage);
router.post("/IdMessages/:messageId/IdUser/:id/dislike", authen, likesCtrl.dislikeMessage);



module.exports = router;