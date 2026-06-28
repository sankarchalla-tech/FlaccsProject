import * as libraryService from "../services/libraryService.js";
import * as verificationService from "../services/fileVerificationService.js";

export async function getHealth(req, res) {
  try {
    const result = await libraryService.getLibraryHealth();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function verify(req, res) {
  try {
    await verificationService.verifyLibrary();
    const result = await libraryService.getLibraryHealth();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}