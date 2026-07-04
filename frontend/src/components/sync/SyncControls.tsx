import { useState } from "react";
import { Database, Cloud, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { syncToSql, syncToGoogle, clearGoogleSheet } from "../../services/syncService";
import { useLoading } from "../context/LoadingContext";

export default function SyncControls() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { showLoading, hideLoading } = useLoading();

  const handleSync = async (direction: "toSQL" | "toGoogle" | "clearSheet") => {
    setLoading(true);

    try {
      let res;
      if (direction === "toSQL") {
        showLoading(
          "Syncing to SQL",
          "Importing Google Sheet changes into PostgreSQL..."
        );
        res = await syncToSql();
        hideLoading();
      } else if (direction === "toGoogle") {
        showLoading(
          "Syncing to Google",
          "Exporting latest database changes..."
        );
        res = await syncToGoogle();
        hideLoading();
      } else if (direction === "clearSheet") {
        showLoading(
          "Clearing Sheet",
          "Removing all rows while preserving the header..."
        );
        res = await clearGoogleSheet();
        hideLoading();
      }

      setMessage({
        type: "success",
        text: res?.data?.message || "Operation completed successfully.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || err.message,
      });
    }

    setLoading(false);
  };

  const actions = [
    {
      title: "SQL Server",
      description: "Import Google Sheet changes into PostgreSQL",
      action: "toSQL" as const,
      icon: Database,
      variant: "primary" as const,
      buttonLabel: "Sync to SQL",
    },
    {
      title: "Google Sheets",
      description: "Export latest database changes",
      action: "toGoogle" as const,
      icon: Cloud,
      variant: "primary" as const,
      buttonLabel: "Sync to Google",
    },
    {
      title: "Clear Sheet",
      description: "Remove all rows while preserving the header",
      action: "clearSheet" as const,
      icon: Trash2,
      variant: "danger" as const,
      buttonLabel: "Clear Sheet",
    },
  ];

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {actions.map((item) => (
          <div
            key={item.action}
            className="rounded-xl border border-slate-200 p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">{item.description}</p>
            </div>

            <Button
              className="mt-6 w-full"
              variant={item.variant}
              icon={item.icon}
              disabled={loading}
              onClick={() => handleSync(item.action)}
            >
              {loading ? "Processing..." : item.buttonLabel}
            </Button>
          </div>
        ))}
        {message && (
          <Card
            className={
              message.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }
          >
            <p
              className={
                message.type === "success" ? "text-green-700" : "text-red-700"
              }
            >
              {message.text}
            </p>
          </Card>
        )}
      </div>
    </Card>
  );
}
