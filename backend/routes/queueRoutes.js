import express from "express";

import * as queueController from "../controllers/queueController.js";

const router=express.Router();

router.get(
    "/",
    queueController.getQueue
);

router.get(
    "/stats",
    queueController.getQueueStats
);

export const queueMissingSongs = () =>
  axios.post(
    "http://localhost:5001/api/songs/queue/missing"
  );

export default router;

