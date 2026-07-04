import type { ReactNode } from "react";

interface DashboardWidgetProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function DashboardWidget({
  title,
  description,
  children,
}: DashboardWidgetProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}