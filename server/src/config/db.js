const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5433),
  database: process.env.DB_NAME,
});

async function connectToDatabase() {
  const client = await pool.connect();

  try {
    await client.query("SELECT NOW()");
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  connectToDatabase,
};
