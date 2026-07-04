import {
  LayoutDashboard,
  Music4,
  Download,
  RefreshCw,
  Settings,
  Music,
} from "lucide-react";

export const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Songs",
    path: "/songs",
    icon: Music,
  },
  {
    label: "Downloads",
    path: "/downloads",
    icon: Download,
  },
  {
    label: "Library",
    path: "/library",
    icon: Music4,
  },
  {
    label: "Sync",
    path: "/sync",
    icon: RefreshCw,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];