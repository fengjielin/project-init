const express = require("express");
const router = express.Router();

let Doc = require("../../controllers/project/docController");

router.post("/doc/upload", Doc.uploadAttach);
router.get("/doc/download", Doc.downloadAttachById);
router.get("/doc/getDoc", Doc.getDoc);
router.post("/doc/getDocInfoByPage", Doc.getDocInfoByPage);
router.post("/doc/addOrUpdateDocInfo", Doc.addOrUpdateDocInfo);
router.post("/doc/deleteDocInfoById", Doc.deleteDocInfoById);

module.exports = router;
