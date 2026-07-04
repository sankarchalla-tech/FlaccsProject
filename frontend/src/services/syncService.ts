import axios from "axios";

export const syncToSql = () =>
  axios.post("/api/sync/sheets-to-sql");

export const syncToGoogle = () =>
  axios.post("/api/sync/sql-to-sheets");

export const clearGoogleSheet = () =>
  axios.post("/api/sync/clear");