import * as songService from "../services/songService.js";

export async function getSongs(req, res) {
  try {
    const songs = await songService.getAllSongs();

    res.json(songs);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
}

export async function getSong(req, res) {
  try {
    const song = await songService.getSongById(req.params.songId);

    if (!song) {
      return res.status(404).json({
        error: "Song not found"
      });
    }

    res.json(song);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

export async function updateSong(req, res) {
  try {
    const song = await songService.updateSong(
      req.params.songId,
      req.body
    );

    res.json(song);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
}

export async function deleteSong(req, res) {
  try {
    await songService.deleteSong(req.params.songId);

    res.json({
      message: "Song deleted successfully"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
}

export async function searchSongs(req, res) {
  try {
    const q = req.query.q ?? "";

    const songs = await songService.searchSongs(q);

    res.json(songs);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
}

export async function getNotDownloadedSongs(req,res){
    const songs=await songService.getNotDownloadedSongs();
    res.json(songs);
}

// export async function getMissingSongs(req, res) {
//   try {
//     const songs = await songService.getMissingSongs();

//     res.json(songs);
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       error: err.message
//     });
//   }
// }

export async function getStats(req, res) {
  try {
    const stats = await songService.getStats();

    res.json(stats);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
}

export async function getMissingFiles(req, res) {
  try {
    const songs = await songService.getMissingFiles();
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
}