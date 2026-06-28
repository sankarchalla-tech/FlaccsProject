import express from "express";
import * as songController from "../controllers/songController.js";
import * as queueController from "../controllers/queueController.js";

const router = express.Router();

router.get("/", songController.getSongs);

router.get("/stats", songController.getStats);

// router.get("/missing", songController.getMissingSongs);

router.get("/search", songController.searchSongs);

router.post("/queue/missing", queueController.queueMissingSongs);

router.get("/not-downloaded", songController.getNotDownloadedSongs);

router.get("/missing-files", songController.getMissingFiles);

router.get("/:songId", songController.getSong);

router.put("/:songId", songController.updateSong);

router.delete("/:songId", songController.deleteSong);

router.post("/queue/:songId", queueController.queueSong);

export default router;