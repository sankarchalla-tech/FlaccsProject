import * as syncService from "../services/syncService.js";

export async function syncSqlToSheets(req, res) {
  try {
    const result = await syncService.syncSqlToSheets();

    res.json({
      success: true,
      message: result.message,
      rows: result.rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

export async function syncSheetsToSql(req, res) {
  try {
    const result = await syncService.syncSheetsToSql();

    res.json({
      success: true,
      message: result.message,
      rows: result.rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

export async function clearSheet(req, res) {
  try {
    const result = await syncService.clearGoogleSheet();

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}