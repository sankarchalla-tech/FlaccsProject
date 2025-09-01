import { useState } from "react";
import axios from "axios";

export default function SyncControls() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSync = async (direction: "toSQL" | "toGoogle" | "clearSheet") => {
    setLoading(true);
    setMessage("");

    try {
      let res;
      if (direction === "toSQL") {
        res = await axios.post("/api/sync/from-sheet");
      } else if (direction === "toGoogle") {
        res = await axios.post("/api/sync/to-sheet");
      } else if (direction === "clearSheet") {
        res = await axios.post("/api/sync/clear");
      }

      setMessage(res?.data?.message || "✅ Done!");
    } catch (err: any) {
      setMessage("❌ Error: " + (err.response?.data?.error || err.message));
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4 space-x-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => handleSync("toSQL")}
        disabled={loading}
      >
        Sync ➜ SQL Server
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => handleSync("toGoogle")}
        disabled={loading}
      >
        Sync ➜ Google Sheet
      </button>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={() => handleSync("clearSheet")}
        disabled={loading}
      >
        🧹 Clear Sheet (keep header)
      </button>

      {message && (
        <div className="text-center text-sm font-medium text-white">
          {message}
        </div>
      )}
    </div>
  );
}
