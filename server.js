require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "careertrack",
  password: "varadmin123",
  port: 5432,
});
pool.connect()
  .then(() => console.log("Database connected successfully ✅"))
  .catch(err => console.error("DB Connection Error:", err.message));

// Test Route
app.get("/", async (req, res) => {
  res.send("CareerTrack Backend Running 🚀");
});
app.post("/addApplication", async (req, res) => {
  try {
    const { company_name, role, status, applied_date } = req.body;

    await pool.query(
      `INSERT INTO applications (user_id, company_name, role, status, applied_date)
       VALUES ($1, $2, $3, $4, $5)`,
      [1, company_name, role, status, applied_date]
    );

    res.send("Application added successfully ✅");
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).send("Error inserting data");
  }
});
app.get("/applications", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM applications ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).send("Error fetching data");
  }
});
app.get("/stats/total", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM applications"
    );

    res.json({ total: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).send("Error fetching total count");
  }
});
app.get("/stats/today", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM applications
       WHERE applied_date = CURRENT_DATE`
    );

    res.json({ today: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).send("Error fetching today's count");
  }
});
app.delete("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM applications WHERE id = $1",
      [id]
    );

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).send("Error deleting");
  }
});
app.get("/stats/status", async (req, res) => {

  const result = await pool.query(
    "SELECT status, COUNT(*) FROM applications GROUP BY status"
  );

  res.json(result.rows);

});

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});