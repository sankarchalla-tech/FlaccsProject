import { Music4 } from "lucide-react";

export default function AppLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-blue-600 p-2">
        <Music4 className="h-6 w-6 text-white" />
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-wide">
          FLACC
        </h1>

        <p className="text-xs text-slate-400">
          Music Manager
        </p>
      </div>
    </div>
  );
}