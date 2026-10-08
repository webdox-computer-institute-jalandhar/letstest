# Todo App — Express + PostgreSQL + React + Vite

Converted from the original MERN Todo frontend into a full-stack app using:

- React 18
- Vite
- Express.js
- PostgreSQL (`pg`)
- Axios

## Project structure

```text
client/   React + Vite frontend
server/   Express + PostgreSQL API
```

## 1. Create the PostgreSQL database

Using PostgreSQL locally:

```sql
CREATE DATABASE todo_app;
```

The server creates the `todos` table automatically on startup. The SQL is also available in `server/schema.sql`.

## 2. Configure backend environment variables

Copy:

```bash
cd server
cp .env.example .env
```

Then set your connection string in `server/.env`:

```env
PORT=3030
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_app
CLIENT_ORIGIN=http://localhost:5173
DATABASE_SSL=false
```

For a hosted database such as Neon, use its PostgreSQL connection string and set:

```env
DATABASE_SSL=true
```

## 3. Configure frontend

Copy:

```bash
cd client
cp .env.example .env
```

For local development:

```env
VITE_API_URL=http://localhost:3030
```

## 4. Install dependencies

From the project root:

```bash
npm install
npm run install:all
```

## 5. Run frontend + backend

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3030`

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/todos` | Get all todos |
| POST | `/todos` | Create a todo |
| PUT | `/todos/:id` | Update title/completed state |
| DELETE | `/todos/:id` | Delete a todo |

### Example POST body

```json
{
  "title": "Learn PostgreSQL",
  "completed": false
}
```

## Important conversion changes

The MongoDB/Mongoose version used `_id`. PostgreSQL uses an integer `id`, so the React list, update and delete logic now use `item.id`.

Create React App was replaced by Vite, so:

- `src/index.js` became `src/main.jsx`
- the HTML entry point moved to `client/index.html`
- environment variables use the `VITE_` prefix
- `react-scripts` was removed

The Express API now uses parameterized PostgreSQL queries such as `$1`, `$2`, etc. instead of Mongoose models.
