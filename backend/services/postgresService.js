import pool from "../db/pool.js";

export async function query(sql, params = []) {
  return pool.query(sql, params);
}

export async function transaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");

    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export default {
  query,
  transaction,
};