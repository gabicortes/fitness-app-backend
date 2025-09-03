# Fitness Backend

This is the backend for a fitness app using Node.js, Express, and MySQL.

## Features

- Fetch users and user data
- Fetch last workout for a user
- Fetch templates and single template
- Create templates
- Fetch workout history

## Tech Stack

- Node.js + Express
- TypeScript
- MySQL
- dotenv for environment variables

## Project Structure

```
src/
├── server.ts              # Express app entry point
├── routes/
│   ├── userRoutes.ts      # /users endpoints
│   ├── templateRoutes.ts  # /templates endpoints (planned)
│   └── workoutRoutes.ts   # /workouts endpoints (planned)
db/
└── pool.ts                # MySQL connection pool
```

## Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/fitness-backend.git
cd fitness-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fitnessApp
```

4. Run the server:

```bash
npm run dev
```

Server will run at http://localhost:5000

## API Endpoints

### Users

- `GET /users` → List all users
- `GET /users/:id` → Get single user by ID
- `GET /users/:id/last-workout` → Get last workout of a user

### Templates

- `GET /users/:id/templates` → Fetch user templates
- `GET /templates/:id` → Fetch template by ID
- `POST /users/:id/templates` → Create new template

### History

- `GET /users/:id/history` → Fetch user workout history
