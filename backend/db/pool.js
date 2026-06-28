import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL Connected");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL Error:", err);
});

export default pool;