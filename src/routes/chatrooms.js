const express = require("express");
const router = express.Router();
const monk = require("monk");
const db = monk(process.env.MONGODB_URI);

module.exports = router;
