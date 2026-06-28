import { useEffect, useState } from "react";
import { getDownloadStats } from "../services/songService";

export default function QueueStatsCards() {
  const [stats, setStats] = useState({
    pending: 0,
    downloading: 0,
    completed: 0,
    failed: 0,
  });

useEffect(() => {
  loadStats();

  const timer = setInterval(loadStats, 5000);

  return () => clearInterval(timer);
}, []);

  async function loadStats() {
    try {
      const res = await getDownloadStats();

      setStats({
        pending: Number(res.data.pending),
        downloading: Number(res.data.downloading),
        completed: Number(res.data.completed),
        failed: Number(res.data.failed),
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-gray-500 text-sm">
          Pending
        </h3>

        <p className="text-2xl font-bold">
          {stats.pending}
        </p>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-gray-500 text-sm">
          Downloading
        </h3>

        <p className="text-2xl font-bold">
          {stats.downloading}
        </p>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-gray-500 text-sm">
          Completed
        </h3>

        <p className="text-2xl font-bold">
          {stats.completed}
        </p>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-gray-500 text-sm">
          Failed
        </h3>

        <p className="text-2xl font-bold">
          {stats.failed}
        </p>
      </div>
    </div>
  );
}