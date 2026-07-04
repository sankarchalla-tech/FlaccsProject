import type { LucideIcon } from "lucide-react";
import Card from "./Card";
import Button from "./Button";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  buttonLabel: string;
  loading?: boolean;
  onClick: () => void;
}

export default function ActionCard({
  title,
  description,
  icon: Icon,
  iconColor = "text-blue-600",
  buttonLabel,
  loading = false,
  onClick,
}: ActionCardProps) {
  return (
    <Card className="flex flex-col justify-between h-full">
      <div className="space-y-4">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-slate-100 p-3">
            <Icon className={iconColor} size={24} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              {title}
            </h3>

            <p className="text-sm text-slate-500">
              {description}
            </p>
          </div>

        </div>

      </div>

      <div className="mt-6">

        <Button
          className="w-full"
          onClick={onClick}
          disabled={loading}
        >
          {loading ? "Processing..." : buttonLabel}
        </Button>

      </div>
    </Card>
  );
}