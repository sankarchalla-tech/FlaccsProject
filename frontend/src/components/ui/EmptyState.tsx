import { Download, type LucideIcon } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Icon size={32} className="text-slate-500" />
      </div>

      <h3 className="mt-6 text-xl font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 text-slate-500">
        {description}
      </p>

      <EmptyState
  icon={Download}
  title="Queue Empty"
  description="Add songs to start downloading."
>
  <Button>Browse Songs</Button>
  <Button variant="secondary">Import Playlist</Button>
</EmptyState>
    </div>
  );
}