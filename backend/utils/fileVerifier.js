import fs from "fs/promises";

export async function verifyDownloadedFile(filePath) {
  try {
    const stat = await fs.stat(filePath);

    if (stat.size < 10000) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}