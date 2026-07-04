import { useEffect, useState } from "react";
import {
  Music4,
  Download,
  AlertTriangle,
} from "lucide-react";

import { getStats } from "../../services/songService";
import StatCard from "../ui/StatCard";
import CardSkeleton from "../ui/CardSkeleton";



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

    const timer = setInterval(fetchStats, 5000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-2xl bg-white border border-slate-200 animate-pulse"
          />
        ))} */}
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-36 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
          <p className="text-slate-500">Failed to load stats</p>
        </div>
        <div className="h-36 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
          <p className="text-slate-500">Failed to load stats</p>
        </div>
        <div className="h-36 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
          <p className="text-slate-500">Failed to load stats</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Songs",
      value: Number(stats.total_songs).toLocaleString(),
      subtitle: "Music Library",
      icon: Music4,
      iconColor: "text-blue-600",
    },
    {
      title: "Downloaded",
      value: Number(stats.downloaded).toLocaleString(),
      subtitle: "Available Offline",
      icon: Download,
      iconColor: "text-green-600",
    },
    {
      title: "Missing",
      value: Number(stats.missing).toLocaleString(),
      subtitle: "Needs Attention",
      icon: AlertTriangle,
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          icon={card.icon}
          iconColor={card.iconColor}
        />
      ))}
    </div>
  );
}