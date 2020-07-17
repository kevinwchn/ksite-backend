const express = require('express')
const router = express.Router()
const monk = require("monk");

const db = monk(process.env.MONGODB_URI);
const visitors = db.get("visitors");
visitors.createIndex({ ip: 1 }, { unique: true });

router.get("/", async (req, res, next) => {
  res.json({
    res: "hi",
    ip: req.clientIp,
  });
});


router.get("/test", async (req, res, next) => {
  res.json({
    res: "testPath",
    ip: req.clientIp,
  });
});

router.get("/visitors", async (req, res, next) => {
  let visitor;
  try {
    visitor = await visitors.findOneAndUpdate(
      { ip: req.clientIp },
      { $inc: { visit: 1 } },
      { returnNewDocument: true }
    );
    if (visitor === null) {
      visitor = await visitors.insert({
        ip: req.clientIp,
        visit: 1,
      });
    }
  } catch (err) {
    next(err);
    return;
  }

  res.json({
    visitor: visitor,
  });
});

module.exports = router
