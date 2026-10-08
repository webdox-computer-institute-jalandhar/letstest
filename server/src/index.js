import express from "express";
import cors from "cors";
import "dotenv/config";
import { initializeDatabase, pool } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3030;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Todo API is running" });
});

app.get("/todos", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, completed FROM todos ORDER BY id ASC"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.post("/todos", async (req, res, next) => {
  try {
    const { title, completed = false } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const { rows } = await pool.query(
      `INSERT INTO todos (title, completed)
       VALUES ($1, $2)
       RETURNING id, title, completed`,
      [title.trim(), Boolean(completed)]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put("/todos/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const current = await pool.query(
      "SELECT id, title, completed FROM todos WHERE id = $1",
      [id]
    );

    if (current.rowCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const existing = current.rows[0];
    const title = req.body.title !== undefined ? String(req.body.title).trim() : existing.title;
    const completed = req.body.completed !== undefined ? Boolean(req.body.completed) : existing.completed;

    if (!title) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    const { rows } = await pool.query(
      `UPDATE todos
       SET title = $1, completed = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, title, completed`,
      [title, completed, id]
    );

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete("/todos/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }

    const result = await pool.query("DELETE FROM todos WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to PostgreSQL:", error.message);
    process.exit(1);
  });
