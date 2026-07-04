export const pageConfig: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Dashboard",
    subtitle: "Overview of your music library",
  },

  "/library": {
    title: "Music Library",
    subtitle: "Manage your songs and metadata",
  },

  "/queue": {
    title: "Download Queue",
    subtitle: "Monitor current downloads",
  },

  "/sync": {
    title: "Synchronization",
    subtitle: "Google Sheets and PostgreSQL sync",
  },

  "/settings": {
    title: "Settings",
    subtitle: "Application configuration",
  },
};
