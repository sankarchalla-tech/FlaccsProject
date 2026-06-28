import fs from "fs/promises";
import path from "path";

import postgres from "./postgresService.js";

const MUSIC_DIR =
  process.env.MUSIC_LIBRARY_PATH ||
  "/home/sankar/Music/OPUS";

export async function verifyLibrary() {
  const result = await postgres.query(`
    SELECT
      song_id,
      title,
      artist
    FROM songs
    WHERE is_downloaded='YES'
  `);

  let verified = 0;
  let missing = 0;

  for (const song of result.rows) {
    const filename =
      `${song.title} - ${song.artist}.opus`;

    const filePath =
      path.join(MUSIC_DIR, filename);

    let exists = true;

    try {
      await fs.access(filePath);
    } catch {
      exists = false;
    }

    await postgres.query(
      `
      UPDATE songs
      SET

        local_file_path=$1,

        download_verified=$2,

        last_verified=NOW()

      WHERE song_id=$3
      `,
      [
        exists ? filePath : null,
        exists,
        song.song_id,
      ]
    );

    if (exists)
      verified++;
    else
      missing++;
  }

  return {
    verified,
    missing,
  };
}