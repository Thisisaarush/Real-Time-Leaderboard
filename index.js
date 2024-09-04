const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const dotenv = require("dotenv")
const authRoutes = require("./routes/authRoutes")
const leaderboardRoutes = require("./routes/leaderboardRoutes")

dotenv.config()
const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(express.json())

app.use("/auth", authRoutes)
app.use("/leaderboard", leaderboardRoutes)

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user is connected")

  // Join a room to listen for leaderboard updates
  socket.on("subscribeToLeaderboard", (game) => {
    socket.join(game)
  })

  // Leave a room to stop listening for leaderboard updates
  socket.on("disconnect", () => {
    console.log("A user is disconnected")
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = io
