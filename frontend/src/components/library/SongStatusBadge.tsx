import Badge from "../ui/Badge";

interface SongStatusBadgeProps {
  status?: string;
}

export default function SongStatusBadge({
  status,
}: SongStatusBadgeProps) {
  const normalized = status?.toUpperCase();

  switch (normalized) {
    case "YES":
      return (
        <Badge variant="success">
          🟢 Downloaded
        </Badge>
      );

    case "NO":
      return (
        <Badge variant="danger">
          🔴 Missing
        </Badge>
      );

    default:
      return (
        <Badge variant="neutral">
          🔵 Unknown
        </Badge>
      );
  }
}