const express = require("express");
const router = express.Router();
const conan = require("../episode/conan");
const monk = require("monk");
const db = monk(process.env.MONGODB_URI);
const watchHistory = db.get("watch-history");

router.get("/conan", async (req, res, next) => {
  const result = await watchHistory.find(
    { episode: "conan" },
    { sort: { _id: -1 }, limit: 100 }
  );
  res.json({
    history: result.map((x) => {
      const referenceId = conan[x.episodeId - 1];
      return {
        episode: x.episodeId,
        referenceId: referenceId,
        classicUrl: `https://classic.ifvod.tv/play?id=${referenceId}`,
        newUrl: `https://www.ifvod.tv/play?id=${referenceId}`,
      };
    }),
  });
});

router.get("/conan/:episodeId", (req, res, next) => {
  const episodeId = req.params.episodeId;
  const referenceId = conan[req.params.episodeId - 1];
  try {
    watchHistory.insert({
      episode: "conan",
      episodeId: req.params.episodeId,
    });
  } catch (err) {
    console.log(err);
  }

  res.json({
    episode: episodeId,
    referenceId: referenceId,
    classicUrl: `https://classic.ifvod.tv/play?id=${referenceId}`,
    newUrl: `https://www.ifvod.tv/play?id=${referenceId}`,
  });
});

module.exports = router;
