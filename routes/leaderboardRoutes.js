const express = require("express")
const {
  submitScore,
  getLeaderboard,
} = require("../controllers/leaderboardController")
const authenticateToken = require("../middleware/authenticateToken")
const router = express.Router()

router.post("/submit-score", authenticateToken, submitScore)
router.get("/:game", getLeaderboard)

module.exports = router
