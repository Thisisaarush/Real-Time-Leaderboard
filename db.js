const { Pool } = require("pg")
const dotenv = require("dotenv")

dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// Initialize the database with the necessary tables if they don't exist
;(async () => {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS scores (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          game VARCHAR(255),
          score INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          `)
    console.log("Database initialized successfully.")
  } catch (err) {
    console.error("Error initializing database:", err)
  } finally {
    client.release()
  }
})()

module.exports = pool
