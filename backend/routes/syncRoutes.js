import express from "express";
import * as syncController from "../controllers/syncController.js";

const router = express.Router();

router.post("/sql-to-sheets", syncController.syncSqlToSheets);

router.post("/sheets-to-sql", syncController.syncSheetsToSql);

router.post("/clear", syncController.clearSheet);

export default router;