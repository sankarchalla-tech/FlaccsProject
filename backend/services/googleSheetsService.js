import { getGoogleSheetsClient } from "../config/googleAuth.js";

const SHEET = process.env.GOOGLE_SHEET_NAME;

export async function getSheetRows() {
  const sheets = await getGoogleSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET}!A:G`,
  });

  return response.data.values || [];
}

export async function clearSheet() {
  const sheets = await getGoogleSheetsClient();

  const rows = await getSheetRows();

  // Keep only header
  if (rows.length <= 1) {
    return;
  }

  await sheets.spreadsheets.values.clear({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET}!A2:G`,
  });
}

export async function replaceSheetData(rows) {
  const sheets = await getGoogleSheetsClient();

  // Remove existing rows (keep header)
  await clearSheet();

  if (!rows.length) {
    return;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET}!A2`,
    valueInputOption: "RAW",
    requestBody: {
      values: rows,
    },
  });
}

export async function findSongRow(songId) {
  const rows = await getSheetRows();

  for (let i = 1; i < rows.length; i++) {
    if (Number(rows[i][0]) === Number(songId)) {
      return i + 1; // Google Sheets row number
    }
  }

  return null;
}

export async function updateDownloadedSong(songId) {
  const row = await findSongRow(songId);

  if (!row) {
    throw new Error(`SongID ${songId} not found`);
  }

  const sheets = await getGoogleSheetsClient();

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET}!F${row}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [["YES"]],
    },
  });
}