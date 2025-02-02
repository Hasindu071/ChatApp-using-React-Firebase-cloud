const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const cacheMiddleware = require("../middleware/cache");

router.get("/:chatId", cacheMiddleware(60), messageController.getMessages);
router.post("/", messageController.sendMessage);

module.exports = router;
