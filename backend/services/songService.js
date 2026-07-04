import postgres from "./postgresService.js";

/* ---------- GET ALL SONGS ---------- */

export async function getAllSongs() {
  const result = await postgres.query(`
    SELECT
      song_id AS "SongID",
      title AS "Title",
      artist AS "Artist",
      album AS "Album",
      playlist_name AS "PlaylistName",
      is_downloaded AS "IsDownloaded",
      date_added AS "DateAdded",
      local_file_path AS "LocalFilePath",
      download_verified AS "DownloadVerified",
      last_verified AS "LastVerified"
    FROM songs
    ORDER BY song_id
  `);

  return result.rows;
}

/* ---------- GET SONG BY ID ---------- */

export async function getSongById(songId) {
  const result = await postgres.query(
    `
    SELECT
      song_id AS "SongID",
      title AS "Title",
      artist AS "Artist",
      album AS "Album",
      playlist_name AS "PlaylistName",
      is_downloaded AS "IsDownloaded",
      date_added AS "DateAdded",
      local_file_path AS "LocalFilePath",
      download_verified AS "DownloadVerified",
      last_verified AS "LastVerified"
    FROM songs
    WHERE song_id = $1
    `,
    [songId],
  );

  return result.rows[0];
}

export async function updateSong(songId, song) {
  const result = await postgres.query(
    `
    UPDATE songs
    SET
      title = $1,
      artist = $2,
      album = $3,
      playlist_name = $4,
      is_downloaded = $5
    WHERE song_id = $6
    RETURNING
      song_id AS "SongID",
      title AS "Title",
      artist AS "Artist",
      album AS "Album",
      playlist_name AS "PlaylistName",
      is_downloaded AS "IsDownloaded",
      date_added AS "DateAdded",
      local_file_path AS "LocalFilePath",
      download_verified AS "DownloadVerified",
      last_verified AS "LastVerified"
    `,
    [
      song.Title,
      song.Artist,
      song.Album,
      song.PlaylistName,
      song.IsDownloaded,
      songId,
    ],
  );

  return result.rows[0];
}

export async function withTransaction(callback) {
  const client = await postgres.connect();

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

export async function deleteSong(songId) {
  return postgres.transaction(async (client) => {
    await client.query(
      "DELETE FROM download_queue WHERE song_id = $1",
      [songId]
    );

    await client.query(
      "DELETE FROM songs WHERE song_id = $1",
      [songId]
    );
  });
}

export async function searchSongs(query) {
  const result = await postgres.query(
    `
    SELECT
      song_id AS "SongID",
      title AS "Title",
      artist AS "Artist",
      album AS "Album",
      playlist_name AS "PlaylistName",
      is_downloaded AS "IsDownloaded",
      date_added AS "DateAdded",
      local_file_path AS "LocalFilePath",
      download_verified AS "DownloadVerified",
      last_verified AS "LastVerified"
    FROM songs
    WHERE
      title ILIKE $1
      OR artist ILIKE $1
      OR album ILIKE $1
    ORDER BY song_id
    `,
    [`%${query}%`]
  );

  return result.rows;
}

export async function getNotDownloadedSongs() {
  const result = await postgres.query(`
    SELECT
      song_id AS "SongID",
      title AS "Title",
      artist AS "Artist",
      album AS "Album",
      playlist_name AS "PlaylistName",
      is_downloaded AS "IsDownloaded",
      date_added AS "DateAdded",
      local_file_path AS "LocalFilePath",
      download_verified AS "DownloadVerified",
      last_verified AS "LastVerified"
    FROM songs
    WHERE
        UPPER(COALESCE(is_downloaded,'NO')) <> 'YES'
    ORDER BY song_id;
  `);

  return result.rows;
}

export async function getMissingFiles() {
  const result = await postgres.query(`
    SELECT
      song_id AS "SongID",
      title AS "Title",
      artist AS "Artist",
      album AS "Album",
      playlist_name AS "PlaylistName",
      is_downloaded AS "IsDownloaded",
      date_added AS "DateAdded",
      local_file_path AS "LocalFilePath",
      download_verified AS "DownloadVerified",
      last_verified AS "LastVerified"
    FROM songs
    WHERE
      UPPER(COALESCE(is_downloaded,'NO'))='YES'
      AND download_verified=false
    ORDER BY song_id
  `);

  return result.rows;
}

export async function getStats() {
  const result = await postgres.query(`
    SELECT
      COUNT(*)::text AS total_songs,

      COUNT(*) FILTER (
        WHERE UPPER(COALESCE(is_downloaded,'NO'))='YES'
      )::text AS downloaded,

      COUNT(*) FILTER (
        WHERE UPPER(COALESCE(is_downloaded,'NO'))<>'YES'
      )::text AS missing

    FROM songs
  `);

  return result.rows[0];
}

export async function markDownloaded(
  songId,
  filePath
) {
  await postgres.query(
    `
    UPDATE songs
    SET
      is_downloaded='YES',
      local_file_path=$1,
      download_verified=TRUE,
      last_verified=NOW()
    WHERE song_id=$2
    `,
    [filePath, songId]
  );
}

export async function upsertSong(song) {
  const result = await postgres.query(
    `
    INSERT INTO songs (
      song_id,
      title,
      artist,
      album,
      playlist_name,
      is_downloaded,
      date_added
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)

    ON CONFLICT (song_id)
    DO UPDATE SET
      title = EXCLUDED.title,
      artist = EXCLUDED.artist,
      album = EXCLUDED.album,
      playlist_name = EXCLUDED.playlist_name,
      is_downloaded = EXCLUDED.is_downloaded,
      date_added = EXCLUDED.date_added

    RETURNING
      song_id AS "SongID",
      title AS "Title",
      artist AS "Artist",
      album AS "Album",
      playlist_name AS "PlaylistName",
      is_downloaded AS "IsDownloaded",
      date_added AS "DateAdded",
      local_file_path AS "LocalFilePath",
      download_verified AS "DownloadVerified",
      last_verified AS "LastVerified"
    `,
    [
      Number(song.SongID),
      song.Title,
      song.Artist,
      song.Album,
      song.PlaylistName,
      song.IsDownloaded,
      song.DateAdded,
    ]
  );

  return result.rows[0];
}

