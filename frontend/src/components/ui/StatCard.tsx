import type { LucideIcon } from "lucide-react";
import Card from "./Card";


interface StatCardProps {
  title: string;

  value: string | number;

  subtitle?: string;

  icon: LucideIcon;

  iconColor?: string;
}

export default function StatCard({
  title,

  value,

  subtitle,

  icon: Icon,

  iconColor = "text-blue-600",
}: StatCardProps) {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>

          {subtitle && (
            <p className="text-sm text-slate-400 mt-2">{subtitle}</p>
          )}
        </div>

        <div className="rounded-xl bg-slate-100 p-3">
          <Icon size={24} className={iconColor} />
        </div>
      </div>
    </Card>
  );
}
