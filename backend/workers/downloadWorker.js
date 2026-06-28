import dotenv from "dotenv";
dotenv.config();

import * as queueService from "../services/queueService.js";
import { downloadSong } from "../services/downloaderService.js";
import { getSongById, markDownloaded } from "../services/songService.js";
import { updateDownloadedSong } from "../services/googleSheetsService.js";

console.log("🎵 Downloader Worker Started");

async function workerLoop() {
  try {
    const job = await queueService.getNextPendingJob();

    if (!job) {
      return;
    }

    console.log(`⬇️ Downloading: ${job.title} - ${job.artist}`);

    await queueService.markDownloading(job.id);

    try {
      const song = await getSongById(job.song_id);

      if (!song) {
        await queueService.markFailed(job.id, "Song not found");
        return;
      }

      if (song.is_downloaded === "YES" && song.local_file_path) {
        console.log(`⏭ Already downloaded: ${song.title}`);

        await queueService.markCompleted(job.id, song.local_file_path);

        return;
      }

      const result = await downloadSong(job);

      if (result.alreadyExisted) {
        console.log(`⏭ Using existing file: ${job.title}`);
      } else {
        console.log(`⬇️ Downloaded: ${job.title}`);
      }

      await markDownloaded(job.song_id, result.filePath);

      try {
        await updateDownloadedSong(job.song_id);
      } catch (err) {
        console.error("Google Sheet update failed:", err.message);
      }

      await queueService.markCompleted(job.id, result.filePath);

      console.log(`✅ Completed: ${job.title}`);
    } catch (err) {
      console.error("❌ Download failed:", err.message);

      await queueService.markFailed(job.id, err.message);
    }
  } catch (err) {
    console.error("Worker Error:", err);
  }
}

const POLL = Number(process.env.DOWNLOAD_POLL_INTERVAL) || 5000;

// Run immediately
workerLoop();

// Continue polling
setInterval(workerLoop, POLL);
