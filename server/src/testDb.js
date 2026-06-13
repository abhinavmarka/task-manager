import pool from "./config/db.js";

async function testConnection() {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks"
    );

    console.log(result.rows);
  } catch (error) {
    console.error(error);
  }
}

testConnection();