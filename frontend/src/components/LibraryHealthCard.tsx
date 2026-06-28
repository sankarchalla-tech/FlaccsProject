import { useEffect, useState } from "react";
import {
  getLibraryHealth,
  verifyLibrary,
} from "../services/libraryService";

interface HealthSummary {
  totalSongs: number;
  downloaded: number;
  verified: number;
  missingFiles: number;
  notDownloaded: number;
  pendingQueue: number;
  failedQueue: number;
  lastVerification: string | null;
}

interface MissingSong {
  song_id: number;
  title: string;
  artist: string;
}

export default function LibraryHealthCard() {
  const [summary, setSummary] = useState<HealthSummary>({
    totalSongs: 0,
    downloaded: 0,
    verified: 0,
    missingFiles: 0,
    notDownloaded: 0,
    pendingQueue: 0,
    failedQueue: 0,
    lastVerification: null,
  });

  const [missingSongs, setMissingSongs] = useState<MissingSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function loadHealth() {
    try {
      const res = await getLibraryHealth();

      setSummary(res.data.summary);
      setMissingSongs(res.data.missingSongs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function scanLibrary() {
    setScanning(true);

    try {
      const res = await verifyLibrary();

      setSummary(res.data.summary);
      setMissingSongs(res.data.missingSongs);

      alert("Library verification completed.");
    } catch (err) {
      console.error(err);
      alert("Verification failed.");
    }

    setScanning(false);
  }

  useEffect(() => {
    loadHealth();

    const interval = setInterval(loadHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        Loading library health...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">
        📚 Library Health
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">

        <div>Total Songs</div>
        <div className="font-semibold">{summary.totalSongs}</div>

        <div>Downloaded</div>
        <div className="font-semibold text-green-600">
          {summary.downloaded}
        </div>

        <div>Verified Files</div>
        <div className="font-semibold text-green-600">
          {summary.verified}
        </div>

        <div>Missing Files</div>
        <div className="font-semibold text-red-600">
          {summary.missingFiles}
        </div>

        <div>Not Downloaded</div>
        <div>{summary.notDownloaded}</div>

        <div>Pending Queue</div>
        <div>{summary.pendingQueue}</div>

        <div>Failed Queue</div>
        <div>{summary.failedQueue}</div>

        <div>Last Scan</div>
        <div>
          {summary.lastVerification
            ? new Date(
                summary.lastVerification
              ).toLocaleString()
            : "Never"}
        </div>

      </div>

      <button
        onClick={scanLibrary}
        disabled={scanning}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {scanning ? "Scanning..." : "🔍 Scan Library"}
      </button>

      <button
        onClick={() => setExpanded(!expanded)}
        className="ml-4 text-blue-600 underline"
      >
        {expanded
          ? "Hide Missing Songs"
          : `Show Missing Songs (${missingSongs.length})`}
      </button>

      {expanded && (
        <div className="mt-4 border rounded p-3 max-h-64 overflow-auto">
          {missingSongs.length === 0 ? (
            <div className="text-green-600">
              No missing files found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Song ID</th>
                  <th className="text-left">Title</th>
                  <th className="text-left">Artist</th>
                </tr>
              </thead>

              <tbody>
                {missingSongs.map((song) => (
                  <tr key={song.song_id}>
                    <td>{song.song_id}</td>
                    <td>{song.title}</td>
                    <td>{song.artist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}