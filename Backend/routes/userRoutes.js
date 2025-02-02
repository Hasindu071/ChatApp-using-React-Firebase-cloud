const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const cacheMiddleware = require("../middleware/cache");

router.get("/", cacheMiddleware(300), userController.getUsers);

module.exports = router;
