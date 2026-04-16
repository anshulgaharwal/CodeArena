const express = require("express");
const cors = require("cors");
const { pool } = require("./config/db");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Code-Arena API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    res.status(200).json({
      status: "ok",
      database: "connected",
      currentTime: result.rows[0].current_time,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error.message,
    });
  }
});

module.exports = app;
