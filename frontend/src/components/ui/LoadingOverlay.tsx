import Card from "./Card";
import Spinner from "./Spinner";

interface LoadingOverlayProps {
  open: boolean;
  title?: string;
  message?: string;
}

export default function LoadingOverlay({
  open,
  title = "Loading...",
  message = "Please wait",
}: LoadingOverlayProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Card className="w-full max-w-sm p-8 text-center">

        <div className="flex justify-center">
          <Spinner />
        </div>

        <h2 className="mt-6 text-xl font-semibold">
          {title}
        </h2>

        <p className="mt-2 text-slate-500">
          {message}
        </p>

      </Card>
    </div>
  );
}