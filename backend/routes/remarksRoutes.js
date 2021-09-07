const express = require("express");
const router = express.Router();
const authen = require("../middleware/authen");
const multer = require("../middleware/multer-config");

const remarkCtrl = require("../controllers/remarks");

// localhost:3000/api/remarks
router.post("/IdMessage/:messageId", remarkCtrl.createRemark);
router.get("/IdMessage/:messageId", remarkCtrl.getAllRemarkes);
router.get("/IdMessage/:messageId/IdUser/:userId", remarkCtrl.getRemarkesUserId);
router.put("/userId/:id/IdRemark/:remarkId", authen, remarkCtrl.modifyRemarkId);
router.delete("/userId/:id/IdRemark/:remarkId", authen, remarkCtrl.deleteRemarkId);
module.exports = router;