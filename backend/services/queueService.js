import postgres from "./postgresService.js";

export async function queueSong(songId) {

    // Verify the song exists
    const song = await postgres.query(
        `
        SELECT song_id
        FROM songs
        WHERE song_id = $1
        `,
        [songId]
    );

    if (song.rows.length === 0) {
        throw new Error("Song not found.");
    }

    // Existing duplicate check...
    const existing = await postgres.query(
        `
        SELECT id
        FROM download_queue
        WHERE song_id = $1
        AND status IN ('PENDING','DOWNLOADING')
        `,
        [songId]
    );

    if (existing.rows.length > 0) {
        throw new Error("Song already queued.");
    }

    const result = await postgres.query(
        `
        INSERT INTO download_queue
        (
            song_id,
            status,
            created_at
        )
        VALUES
        (
            $1,
            'PENDING',
            NOW()
        )
        RETURNING *
        `,
        [songId]
    );

    return result.rows[0];
}

export async function getQueue() {

    const result = await postgres.query(
        `
        SELECT

            q.id,
            q.song_id,

            s.title,
            s.artist,

            q.status,

            q.downloaded_file,

            q.error_message,

            q.created_at,

            q.processed_at

        FROM download_queue q

        JOIN songs s

        ON s.song_id=q.song_id

        ORDER BY q.created_at DESC
        `
    );

    return result.rows;
}

export async function getQueueStats() {

    const result = await postgres.query(
        `
        SELECT

            COUNT(*)::int AS total,

            COUNT(*) FILTER
            (
                WHERE status='PENDING'
            )::int AS pending,

            COUNT(*) FILTER
            (
                WHERE status='DOWNLOADING'
            )::int AS downloading,

            COUNT(*) FILTER
            (
                WHERE status='COMPLETED'
            )::int AS completed,

            COUNT(*) FILTER
            (
                WHERE status='FAILED'
            )::int AS failed

        FROM download_queue
        `
    );

    return result.rows[0];
}

export async function getNextPendingJob() {
  const result = await postgres.query(`
    SELECT
      q.id,
      q.song_id,
      s.title,
      s.artist,
      s.album
    FROM download_queue q
    JOIN songs s
      ON s.song_id = q.song_id
    WHERE q.status = 'PENDING'
    ORDER BY q.created_at
    LIMIT 1
  `);

  return result.rows[0] || null;
}

export async function markDownloading(id) {
  await postgres.query(
    `
    UPDATE download_queue
    SET status='DOWNLOADING'
    WHERE id=$1
    `,
    [id]
  );
}

export async function markCompleted(
  id,
  downloadedFile
) {
  await postgres.query(
    `
    UPDATE download_queue
    SET
      status='COMPLETED',
      downloaded_file=$1,
      processed_at=NOW()
    WHERE id=$2
    `,
    [downloadedFile, id]
  );
}

export async function markFailed(
  id,
  error
) {
  await postgres.query(
    `
    UPDATE download_queue
    SET
      status='FAILED',
      error_message=$1,
      processed_at=NOW()
    WHERE id=$2
    `,
    [error, id]
  );
}

export async function queueMissingSongs() {
  const result = await postgres.query(`
    INSERT INTO download_queue (song_id, status, created_at)
    SELECT
      s.song_id,
      'PENDING',
      NOW()
    FROM songs s
    WHERE UPPER(COALESCE(s.is_downloaded,'NO')) <> 'YES'
      AND NOT EXISTS (
        SELECT 1
        FROM download_queue q
        WHERE q.song_id = s.song_id
          AND q.status IN ('PENDING','DOWNLOADING')
      )
    RETURNING song_id
  `);

  return {
    queued: result.rowCount
  };
}


export async function markDownloaded(songId, filePath) {
  const result = await postgres.query(
    `
    UPDATE songs
    SET
      is_downloaded = 'YES',
      local_file_path = $1,
      download_verified = TRUE,
      last_verified = NOW()
    WHERE song_id = $2

    RETURNING
      song_id AS "SongID",
      title AS "Title",
      artist AS "Artist",
      album AS "Album",
      playlist_name AS "PlaylistName",
      is_downloaded AS "IsDownloaded",
      local_file_path AS "LocalFilePath",
      download_verified AS "DownloadVerified",
      last_verified AS "LastVerified"
    `,
    [filePath, songId]
  );

  return result.rows[0];
}