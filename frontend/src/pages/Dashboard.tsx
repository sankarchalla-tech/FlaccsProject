import SyncHistory from "../components/sync/SyncHistory";
import SyncControls from "../components/sync/SyncControls";
import StatsCards from "../components/dashboard/StatsCards";
import SongTable from "../components/library/SongTable";
import QueueStatsCards from "../components/dashboard/QueueStatsCards";
import LibraryHealthCard from "../components/dashboard/LibraryHealthCard";
import PageContainer from "../components/layout/PageContainer";
import Section from "../components/ui/Section";
import DashboardWidget from "../components/ui/DashboardWidget";

export default function Dashboard() {
  return (
    <PageContainer>

    <DashboardWidget title="Library Overview">
        <StatsCards />
    </DashboardWidget>

    <DashboardWidget  title="Download Activity">
        <QueueStatsCards />
    </DashboardWidget>

    <DashboardWidget title="Library Health">
        <LibraryHealthCard />
    </DashboardWidget>

    <DashboardWidget title="Quick Actions">
        <SyncControls />
    </DashboardWidget>

    <DashboardWidget title="Recent Activity">
        <SyncHistory />
    </DashboardWidget>

    <DashboardWidget title="Music Library">
        <SongTable />
    </DashboardWidget>

</PageContainer>
  );
}
