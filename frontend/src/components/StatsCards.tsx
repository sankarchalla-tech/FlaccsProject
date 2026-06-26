import { useEffect, useState } from "react";
import { getStats } from "../services/songService";

interface Stats {
  total_songs: string;
  downloaded: string;
  missing: string;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    total_songs: "0",
    downloaded: "0",
    missing: "0",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await getStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-4">
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6">
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-gray-500 text-sm">Total Songs</h3>
        <p className="text-3xl font-bold">{stats.total_songs}</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-gray-500 text-sm">Downloaded</h3>
        <p className="text-3xl font-bold text-green-600">
          {stats.downloaded}
        </p>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-gray-500 text-sm">Missing</h3>
        <p className="text-3xl font-bold text-red-600">
          {stats.missing}
        </p>
      </div>
    </div>
  );
}