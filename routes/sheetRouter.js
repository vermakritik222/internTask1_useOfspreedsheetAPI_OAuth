const express = require("express");
const sheetController = require("../controllers/sheetControler");

const router = express.Router();

router.get("/update", sheetController.updateSheet);
router.post("/:spreadsheet_ID", sheetController.redSheet);

module.exports = router;
