const redis = require("redis")
const redisClient = redis.createClient({
  host: "redis",
  port: 6379,
})

redisClient.on("connect", () => {
  console.log("Redis client connected")
})

module.exports = redisClient
