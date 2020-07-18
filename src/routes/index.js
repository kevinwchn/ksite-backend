const express = require('express')
const router = express.Router()
const monk = require("monk");
const geoip = require('geoip-lite');

const db = monk(process.env.MONGODB_URI);
const visitors = db.get("visitors");
visitors.createIndex({ ip: 1 }, { unique: true });

router.get("/", async (req, res, next) => {
  res.json({
    res: "hi",
    ip: req.clientIp,
  });
});

router.post("/visitors", async (req, res, next) => {
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

  try {
    const geo = geoip.lookup(req.clientIp);
    if (geo != null) {
      visitor['geo'] = geo;
    }
  } catch (err) {
    console.log(err);
  }
  

  res.json({
    visitor: visitor,
  });
});

module.exports = router
