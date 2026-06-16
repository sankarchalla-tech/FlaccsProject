import { useEffect, useState } from "react";

interface SyncLog {
  LogID: number;
  SyncDirection: string;
  Timestamp: string;
  RowsInserted: number;
  RowsUpdated: number;
  RowsDeleted: number;
  Status: string;
  ErrorMessage: string | null;
}

export default function SyncHistory() {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sync/logs")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        // ✅ handle different formats safely
        if (Array.isArray(data)) {
          setLogs(data);
        } else if (data?.recordset && Array.isArray(data.recordset)) {
          setLogs(data.recordset);
        } else {
          setLogs([]);
          setError("Unexpected response format");
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading sync history...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Sync History</h2>
      {logs.length === 0 ? (
        <p className="text-gray-500">No logs found.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Time</th>
              <th className="p-2">Direction</th>
              <th className="p-2">Inserted</th>
              <th className="p-2">Updated</th>
              <th className="p-2">Deleted</th>
              <th className="p-2">Status</th>
              <th className="p-2">Error</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.LogID} className="border-t">
                <td className="p-2">
                  {new Date(log.Timestamp).toLocaleString()}
                </td>
                <td className="p-2">{log.SyncDirection}</td>
                <td className="p-2">{log.RowsInserted}</td>
                <td className="p-2">{log.RowsUpdated}</td>
                <td className="p-2">{log.RowsDeleted}</td>
                <td
                  className={`p-2 font-semibold ${
                    log.Status === "Success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {log.Status}
                </td>
                <td className="p-2">{log.ErrorMessage || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
