import { CalendarDays } from "lucide-react";
import { useLocation } from "react-router-dom";

import { pageConfig } from "../../config/pageConfig";

export default function Header() {
  const location = useLocation();

  const page =
    pageConfig[location.pathname] ??
    {
      title: "FLACC",
      subtitle: "",
    };

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-6">
      <div className="flex items-start justify-between">

        {/* Left */}

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            {page.title}
          </h1>

          <p className="mt-1 text-slate-500">
            {page.subtitle}
          </p>

        </div>

        {/* Right */}

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <CalendarDays size={18} />

          <span>{today}</span>

        </div>

      </div>
    </header>
  );
}