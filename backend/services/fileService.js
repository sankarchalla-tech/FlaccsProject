import fs from "fs/promises";

export async function fileExists(path) {
  if (!path) return false;

  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}