const express = require("express");
const multer = require("multer");
const router = express.Router();
const { processImages } = require("../Controller/ImageController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/process", upload.array("images"), processImages);

module.exports = router;