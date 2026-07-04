import Card from "./Card";
import Button from "./Button";
import { TriangleAlert } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6">

        <div className="flex items-start gap-4">

          <div className="rounded-full bg-red-100 p-3">
            <TriangleAlert
              className="text-red-600"
              size={24}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {message}
            </p>
          </div>

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </Button>

        </div>

      </Card>
    </div>
  );
}