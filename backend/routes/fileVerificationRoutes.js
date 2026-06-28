import express from "express";

import * as controller from "../controllers/fileVerificationController.js";
import * as libraryController from "../controllers/libraryController.js";

const router = express.Router();

// router.post(
//     "/verify",
//     controller.verifyLibrary
// );

router.get("/health", libraryController.getHealth);

router.post("/verify", libraryController.verify);

export default router;