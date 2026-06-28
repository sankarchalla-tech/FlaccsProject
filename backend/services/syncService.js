import {
  getAllSongs,
  upsertSong,
} from "./songService.js";

import {
  getSheetRows,
  replaceSheetData,
  clearSheet,
} from "./googleSheetsService.js";

/**
 * SQL -> Google Sheets
 */
export async function syncSqlToSheets() {
  const songs = await getAllSongs();

  const rows = songs.map((song) => [
    song.SongID,
    song.Title,
    song.Artist,
    song.Album,
    song.PlaylistName,
    song.IsDownloaded,
    song.DateAdded
      ? new Date(song.DateAdded).toISOString()
      : "",
  ]);

  await replaceSheetData(rows);

  return {
    success: true,
    rows: rows.length,
    message: `${rows.length} songs synced to Google Sheets.`,
  };
}

/**
 * Google Sheets -> SQL
 */
export async function syncSheetsToSql() {
  const rows = await getSheetRows();

  if (rows.length <= 1) {
    return {
      success: true,
      rows: 0,
      message: "Google Sheet is empty.",
    };
  }

  let processed = 0;

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    if (!row[0]) continue;

    const song = {
      SongID: Number(row[0]),
      Title: row[1] || "",
      Artist: row[2] || "",
      Album: row[3] || "",
      PlaylistName: row[4] || "",
      IsDownloaded: row[5] || "NO",
      DateAdded: row[6]
        ? new Date(row[6])
        : new Date(),
    };

    await upsertSong(song);

    processed++;
  }

  return {
    success: true,
    rows: processed,
    message: `${processed} songs synced into PostgreSQL.`,
  };
}

/**
 * Clear Google Sheet (keep header)
 */
export async function clearGoogleSheet() {
  await clearSheet();

  return {
    success: true,
    message: "Google Sheet cleared successfully.",
  };
}