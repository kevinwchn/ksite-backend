const express = require("express");
const router = express.Router();
const conan = require("../episode/conan");

router.get("/conan", (req, res, next) => {
  res.json({
    episodes: conan,
  });
});

router.get("/conan/:episodeId", (req, res, next) => {
  const episodeId = req.params.episodeId;
  const referenceId = conan[req.params.episodeId - 1];
  res.json({
    episode: episodeId,
    referenceId: referenceId,
    classicUrl: `https://classic.ifvod.tv/play?id=${referenceId}`,
    newUrl: `https://www.ifvod.tv/play?id=${referenceId}`,
  });
});

module.exports = router;
