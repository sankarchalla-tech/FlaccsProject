import postgres from "./postgresService.js";

export async function getLibraryHealth() {
  const totalSongs = await postgres.query(
    "SELECT COUNT(*) FROM songs"
  );

  const downloaded = await postgres.query(
    "SELECT COUNT(*) FROM songs WHERE is_downloaded='YES'"
  );

  const verified = await postgres.query(
    "SELECT COUNT(*) FROM songs WHERE download_verified=true"
  );

  const missingFiles = await postgres.query(`
    SELECT
      song_id,
      title,
      artist
    FROM songs
    WHERE is_downloaded='YES'
      AND download_verified=false
    ORDER BY title
  `);

  const pendingQueue = await postgres.query(
    "SELECT COUNT(*) FROM download_queue WHERE status='PENDING'"
  );

  const failedQueue = await postgres.query(
    "SELECT COUNT(*) FROM download_queue WHERE status='FAILED'"
  );

  const lastVerification = await postgres.query(
    "SELECT MAX(last_verified) AS last_verified FROM songs"
  );

  return {
    summary: {
      totalSongs: Number(totalSongs.rows[0].count),
      downloaded: Number(downloaded.rows[0].count),
      verified: Number(verified.rows[0].count),
      missingFiles: missingFiles.rows.length,
      notDownloaded:
        Number(totalSongs.rows[0].count) -
        Number(downloaded.rows[0].count),
      pendingQueue: Number(pendingQueue.rows[0].count),
      failedQueue: Number(failedQueue.rows[0].count),
      lastVerification:
        lastVerification.rows[0].last_verified,
    },
    missingSongs: missingFiles.rows,
  };
}