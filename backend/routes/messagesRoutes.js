const express = require("express");
const router = express.Router();
const authen = require("../middleware/authen");
const multer = require("../middleware/multer-config");

const messageCtrl = require("../controllers/messages");

// localhost:3000/api/messages
router.post("/:id/", authen, multer, messageCtrl.createMessage);
router.get("/all/:id", authen, messageCtrl.getAllMessages);
router.get("/IdMessage/:messageId/user/:id", authen, messageCtrl.getAllMessageUserId);
router.put("/user/:id/message/:idMessage", authen, multer, messageCtrl.modifyMessage);
router.delete("/user/:id/message/:idMessage", authen, messageCtrl.deleteMessage);



module.exports = router;