import dotenv from "dotenv";
dotenv.config();

import { upsertSong } from "./services/songService.js";

async function test() {
  try {
    const song = {
      SongID: 999999,
      Title: "Test Song",
      Artist: "FLACC Test",
      Album: "Testing",
      PlaylistName: "Test Playlist",
      IsDownloaded: "NO",
      DateAdded: new Date(),
    };

    const result = await upsertSong(song);

    console.log("✅ UPSERT Successful");
    console.log(result);
  } catch (err) {
    console.error("❌ UPSERT Failed");
    console.error(err);
  }
}

test();