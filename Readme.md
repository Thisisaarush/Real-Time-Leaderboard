# REAL TIME LEADERBOARD

## Tech Stack

- Node.js
- Express.js
- Socket.io
- Postgres
- Redis
- Docker & Docker Compose

## How to run the project with Docker

1. Clone the repository
2. Create a `.env` file with the correct values as mentioned in `.env.example` file.
3. Run `docker compose up --build` for dev environment with hot reloading.
4. Run `docker-compose -f docker-compose.prod.yml up --build` for production environment
