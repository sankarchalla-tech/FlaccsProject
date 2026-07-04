import { Routes, Route } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import SongsPage from "../pages/SongsPage";
import DownloadsPage from "../pages/DownloadsPage";
import LibraryPage from "../pages/LibraryPage";
import SyncPage from "../pages/SyncPage";
import SettingsPage from "../pages/SettingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/songs" element={<SongsPage />} />
      <Route path="/downloads" element={<DownloadsPage />} />
      <Route path="/sync" element={<SyncPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}