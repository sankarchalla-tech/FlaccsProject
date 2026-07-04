import StatsCards from "../components/dashboard/StatsCards";
import QueueStatsCards from "../components/dashboard/QueueStatsCards";

export default function DashboardPage() {
  return (
    <>
      <StatsCards /> <br />
      <QueueStatsCards />
    </>
  );
}