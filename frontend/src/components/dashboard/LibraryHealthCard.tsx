import { useEffect, useState } from "react";
import { getLibraryHealth, verifyLibrary } from "../../services/libraryService";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import ProgressBar from "../ui/ProgressBar";
import Button from "../ui/Button";
import { useToast } from "../../hooks/useToast";
import { useLoading } from "../context/LoadingContext";
import CardSkeleton from "../ui/CardSkeleton";
import EmptyState from "../ui/EmptyState";
import { CheckCircle } from "lucide-react";


interface HealthSummary {
  totalSongs: number;
  downloaded: number;
  verified: number;
  missingFiles: number;
  notDownloaded: number;
  pendingQueue: number;
  failedQueue: number;
  lastVerification: string | null;
}

interface MissingSong {
  song_id: number;
  title: string;
  artist: string;
}

export default function LibraryHealthCard() {
  const [summary, setSummary] = useState<HealthSummary>({
    totalSongs: 0,
    downloaded: 0,
    verified: 0,
    missingFiles: 0,
    notDownloaded: 0,
    pendingQueue: 0,
    failedQueue: 0,
    lastVerification: null,
  });

  const [missingSongs, setMissingSongs] = useState<MissingSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const toast = useToast();
  const { showLoading, hideLoading } = useLoading();

  const verificationPercent =
    summary.totalSongs > 0
      ? Math.round((summary.verified / summary.totalSongs) * 100)
      : 0;

  const healthStatus =
    verificationPercent >= 90
      ? {
          label: "Healthy",
          variant: "success" as const,
        }
      : verificationPercent >= 70
        ? {
            label: "Needs Attention",
            variant: "warning" as const,
          }
        : {
            label: "Critical",
            variant: "danger" as const,
          };

  async function loadHealth() {
    try {
      const res = await getLibraryHealth();

      setSummary(res.data.summary);
      setMissingSongs(res.data.missingSongs);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load library health.");
    } finally {
      setLoading(false);
    }
  }

  async function scanLibrary() {
    showLoading("Scanning Library", "Checking every downloaded song...");

    try {
      const res = await verifyLibrary();

      setSummary(res.data.summary);
      setMissingSongs(res.data.missingSongs);

      toast.success("Library verification completed.");
    } catch (err) {
      console.error(err);
      toast.error("Verification failed.");
    }

    hideLoading();
  }

  useEffect(() => {
    loadHealth();

    const interval = setInterval(loadHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Library Health</h2>

          <p className="text-sm text-slate-500">Current verification status</p>
        </div>

        <Badge variant={healthStatus.variant}>{healthStatus.label}</Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Verification Progress</span>

          <span className="font-semibold">{verificationPercent}%</span>
        </div>

        <ProgressBar value={verificationPercent} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-slate-500">Total Songs</p>

          <p className="mt-1 text-2xl font-bold">{summary.totalSongs}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Verified</p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            {summary.verified}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Missing</p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {summary.missingFiles}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-3 text-sm">
        <span className="text-slate-500">Downloaded</span>

        <span className="text-right font-medium">{summary.downloaded}</span>

        <span className="text-slate-500">Not Downloaded</span>

        <span className="text-right font-medium">{summary.notDownloaded}</span>

        <span className="text-slate-500">Pending Queue</span>

        <span className="text-right font-medium">{summary.pendingQueue}</span>

        <span className="text-slate-500">Failed Queue</span>

        <span className="text-right font-medium text-red-600">
          {summary.failedQueue}
        </span>
      </div>

      <Button onClick={scanLibrary} disabled={scanning}>
        {scanning ? "Scanning..." : "Scan Library"}
      </Button>

      <Button variant="secondary" onClick={() => setExpanded(!expanded)}>
        {expanded
          ? "Hide Missing Songs"
          : `Show Missing Songs (${missingSongs.length})`}
      </Button>

      {expanded && (
        <Card className="overflow-hidden">
          {missingSongs.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="Library Healthy"
              description="No missing files were found."
            />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left">Song ID</th>
                  <th className="text-left">Title</th>
                  <th className="text-left">Artist</th>
                </tr>
              </thead>

              <tbody>
                {missingSongs.map((song) => (
                  <tr key={song.song_id} className="hover:bg-slate-50">
                    <td>{song.song_id}</td>
                    <td>{song.title}</td>
                    <td>{song.artist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </Card>
  );
}
