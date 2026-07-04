import { Music } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="py-20 text-center">
      <Music
        size={56}
        className="mx-auto mb-4 text-slate-300"
      />

      <h3 className="text-xl font-semibold text-slate-700">
        No Songs Found
      </h3>

      <p className="mt-2 text-slate-500">
        Try changing your filters or add songs to your library.
      </p>
    </div>
  );
}