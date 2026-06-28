import pool from "../db/pool.js";

export async function query(sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return result;
  } catch (err) {
    console.error("Database Error:", err.message);
    throw err;
  }
}

export default {
  query
};