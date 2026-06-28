export const QUEUE_STATUS = {
  PENDING: "PENDING",
  DOWNLOADING: "DOWNLOADING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED"
};

export const PAGE_SIZE = 50;

export const DOWNLOAD_FOLDER =
  process.env.MUSIC_LIBRARY || "/home/sankar/Music/OPUS";