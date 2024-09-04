const redisClient = require("../redisClient")
const pool = require("../db")
const io = require("../index")

// Submit a score to the leaderboard
const submitScore = async (req, res) => {
  try {
    const { score, game, userId } = req.body

    if (!score || !game || !userId) {
      return res.status(400).send("Missing required fields")
    }

    await redisClient.zAdd(`leaderboard:${game}`, score, userId)
    await pool.query(
      "INSERT INTO scores (user_id, game, score) VALUES ($1, $2, $3)",
      [userId, game, score]
    )

    const updatedLeaderboard = await redisClient.zrevrange(
      `leaderboard:${game}`,
      0,
      -1,
      "WITHSCORES"
    )

    io.to(game).emit("leaderboardUpdate", updatedLeaderboard)
    res.status(200).send("Score submitted")
  } catch (error) {
    console.error("Error submitting score:", error)
    res.status(500).send("Internal server error")
  }
}

// Get the leaderboard for a specific game
const getLeaderboard = async (req, res) => {
  try {
    const { game } = req.params

    if (!game) {
      return res.status(400).send("Missing required fields")
    }

    const leaderboard = await redisClient.zrevrange(
      `leaderboard:${game}`,
      0,
      -1,
      "WITHSCORES"
    )
    res.json(leaderboard)
  } catch (error) {
    console.error("Error getting leaderboard:", error)
    res.status(500).send("Internal server error")
  }
}

module.exports = { submitScore, getLeaderboard }
