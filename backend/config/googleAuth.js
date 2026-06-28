import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";
import path from "path";

const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

if (!keyPath) {
  throw new Error(
    "GOOGLE_SERVICE_ACCOUNT_KEY is not defined in the .env file."
  );
}

const KEYFILE = path.resolve(keyPath);

export async function getGoogleSheetsClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILE,
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets"
        ]
    });

    return google.sheets({
        version: "v4",
        auth
    });
}