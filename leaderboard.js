const express = require('express');
const router = express.Router();

const getleaderboardRoute = require('../controller/leaderboard');

router.get('/premium/leaderboard', getleaderboardRoute);

module.exports = router;