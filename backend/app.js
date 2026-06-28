import express from "express";
import cors from "cors";

import songRoutes from "./routes/songRoutes.js";
import queueRoutes from "./routes/queueRoutes.js";
import syncRoutes from "./routes/syncRoutes.js";
import fileVerificationRoutes from "./routes/fileVerificationRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    application: "FLACC Music Manager",
    version: "2.0.0",
    status: "Running",
  });
});

app.use("/api/downloads", queueRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/library", fileVerificationRoutes);

export default app;
