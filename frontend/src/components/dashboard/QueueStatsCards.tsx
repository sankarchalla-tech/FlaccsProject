import { useEffect, useState } from "react";
import { Clock3, Download, CheckCircle2, XCircle } from "lucide-react";

import { getDownloadStats } from "../../services/songService";
import StatCard from "../ui/StatCard";
import CardSkeleton from "../ui/CardSkeleton";

interface QueueStats {
  pending: number;
  downloading: number;
  completed: number;
  failed: number;
}

export default function QueueStatsCards() {
  const [stats, setStats] = useState<QueueStats>({
    pending: 0,
    downloading: 0,
    completed: 0,
    failed: 0,
  });

  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
    if (loading) {
      return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      );
    }
  }

  useEffect(() => {
    loadStats();

    const timer = setInterval(loadStats, 5000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-2xl bg-white border border-slate-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Pending",
      value: stats.pending.toLocaleString(),
      subtitle: "Waiting in Queue",
      icon: Clock3,
      iconColor: "text-amber-600",
    },
    {
      title: "Downloading",
      value: stats.downloading.toLocaleString(),
      subtitle: "Currently Active",
      icon: Download,
      iconColor: "text-blue-600",
    },
    {
      title: "Completed",
      value: stats.completed.toLocaleString(),
      subtitle: "Successfully Downloaded",
      icon: CheckCircle2,
      iconColor: "text-green-600",
    },
    {
      title: "Failed",
      value: stats.failed.toLocaleString(),
      subtitle: "Requires Attention",
      icon: XCircle,
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
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
