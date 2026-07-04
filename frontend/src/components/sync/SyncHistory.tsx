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

  useEffect(() => {
    fetch("/api/sync/logs")
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Sync History</h2>
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
              <td className="p-2">{new Date(log.Timestamp).toLocaleString()}</td>
              <td className="p-2">{log.SyncDirection}</td>
              <td className="p-2">{log.RowsInserted}</td>
              <td className="p-2">{log.RowsUpdated}</td>
              <td className="p-2">{log.RowsDeleted}</td>
              <td className={`p-2 font-semibold ${
                log.Status === "Success" ? "text-green-600" : "text-red-600"
              }`}>
                {log.Status}
              </td>
              <td className="p-2">{log.ErrorMessage || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
