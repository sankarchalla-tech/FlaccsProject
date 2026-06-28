import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import sanitize from "sanitize-filename";

const execAsync = promisify(exec);

const MUSIC_LIBRARY = process.env.MUSIC_LIBRARY;
const YTDLP = process.env.YTDLP_PATH || "yt-dlp";

export async function downloadSong(job) {
  const title = sanitize(job.title || "Unknown");
  const artist = sanitize(job.artist || "Unknown");

  const filename = `${title} - ${artist}.opus`;

  const outputFile = path.join(
    MUSIC_LIBRARY,
    filename
  );

  // Already exists?
  try {
    await fs.access(outputFile);

    console.log("Already downloaded:", filename);

    return outputFile;

  } catch {
    // Continue
  }

  const search = `${job.title} ${job.artist} audio`;

  const command =
    `"${YTDLP}" ` +
    `ytsearch1:"${search}" ` +
    `-x ` +
    `--audio-format opus ` +
    `--audio-quality 0 ` +
    `-o "${outputFile}"`;

  console.log(command);

  await execAsync(command);

  // Verify file exists
  await fs.access(outputFile);

  const stat = await fs.stat(outputFile);

  if (stat.size < 10000) {
    throw new Error("Downloaded file is invalid.");
  }

  return outputFile;
}