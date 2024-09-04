const jwt = require("jsonwebtoken")
const argon2 = require("argon2")
const pool = require("../db")
const dotenv = require("dotenv")

dotenv.config()

// Generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
}

// Register a new user
const register = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" })
    }

    const hashedPassword = await argon2.hash(password)

    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    )

    const token = generateToken({ id: result.rows[0].id })
    res.json({ token })
  } catch (error) {
    console.error("Error registering user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Login a user
const login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" })
    }

    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ])
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" })
    }

    const user = result.rows[0]
    const isValid = await argon2.verify(user.password, password)

    if (!isValid) {
      return res.status(400).json({ error: "Invalid password" })
    }

    const token = generateToken({ id: user.id })
    res.json({ token })
  } catch (error) {
    console.error("Error logging in user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = { register, login }
