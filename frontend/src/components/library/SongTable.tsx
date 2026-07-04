import { useEffect, useState } from "react";
import {
  getSongs,
  getNotDownloadedSongs,
  getMissingFiles,
  deleteSong,
  queueSong,
  queueMissingSongs,
} from "../../services/songService";
import EditSongModal from "./EditSongModal";
import { Search, Download, Filter, Pencil, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import SongStatusBadge from "./SongStatusBadge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingTable from "../../components/table/LoadingTable";
// import EmptyState from "../table/EmptyState";
import { useToast } from "../../hooks/useToast";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useLoading } from "../context/LoadingContext";
import TableSkeleton from "../ui/TableSkeleton";
import EmptyState from "../ui/EmptyState";
import { Music } from "lucide-react";

export default function SongTable() {
  const [songs, setSongs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [songToDelete, setSongToDelete] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const PAGE_SIZE = 50;
  const toast = useToast();

  useEffect(() => {
    loadSongs(filter);

    const timer = setInterval(() => loadSongs(filter), 5000);

    return () => clearInterval(timer);
  }, [filter]);

  const filteredSongs = songs.filter((song: any) => {
    const matchesSearch =
      song.Title?.toLowerCase().includes(search.toLowerCase()) ||
      song.Artist?.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const { showLoading, hideLoading } = useLoading();

  async function loadSongs(selectedFilter = filter) {
    setLoading(true);

    try {
      let res;

      switch (selectedFilter) {
        case "notDownloaded":
          res = await getNotDownloadedSongs();
          break;

        case "missingFiles":
          res = await getMissingFiles();
          break;

        default:
          res = await getSongs();
      }

      setSongs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!songToDelete) return;

    setDeleteLoading(true);

    try {
      await deleteSong(songToDelete.SongID);

      await loadSongs();

      toast.success("Song deleted successfully");

      setSongToDelete(null);
    } catch (err) {
      console.error(err);

      toast.error("Failed to delete song");
    } finally {
      setDeleteLoading(false);
    }
  }

  const handleQueue = async (songId: number) => {
    try {
      await queueSong(songId);
      toast.success("Song added to download queue");
    } catch (err) {
      console.error(err);
      toast.error("Failed to queue song");
    }
  };

  const totalPages = Math.ceil(filteredSongs.length / PAGE_SIZE);

  const paginatedSongs = filteredSongs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));

  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return <TableSkeleton rows={10} columns={6} />;
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by title or artist..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              py-2.5
              pl-10
              pr-4
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              outline-none
            "
          />
        </div>

        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="
              rounded-xl
              border
              border-slate-300
              pl-9
              pr-8
              py-2.5
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="all">All Songs</option>
            <option value="notDownloaded">Not Downloaded</option>
            <option value="missingFiles">Missing Files</option>
          </select>
        </div>

        <Button
          icon={Download}
          onClick={async () => {
            showLoading(
              "Queueing Missing Songs",
              "Adding missing songs to the download queue...",
            );
            const res = await queueMissingSongs();
            hideLoading();
            toast.success(`${res.data.queued} songs queued successfully`);
          }}
        >
          Queue Missing Songs
        </Button>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-slate-500">
          Showing
          <span className="font-semibold text-slate-700">
            {" "}
            {(currentPage - 1) * PAGE_SIZE + 1}
          </span>
          –
          <span className="font-semibold text-slate-700">
            {" "}
            {Math.min(currentPage * PAGE_SIZE, filteredSongs.length)}
            {"   "}
          </span>
          of
          <span className="font-semibold text-slate-700">
            {" "}
            {filteredSongs.length}{" "}
          </span>
          songs
        </p>
      </div>

      <Card className="mt-6">
        {loading ? (
          <LoadingTable />
        ) : filteredSongs.length === 0 ? (
          <EmptyState
            icon={Music}
            title="No songs found"
            description="Try adjusting your search or filter to find what you're looking for."
          />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Song ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Artist
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Album
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedSongs.map((song) => (
                <tr key={song.SongID} className="border-b border-slate-200">
                  <td className="px-4 py-3">{song.SongID}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {song.Title}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{song.Artist}</td>
                  <td className="px-4 py-3 text-slate-500">{song.Album}</td>
                  <td className="px-4 py-3 justify-between">
                    <SongStatusBadge status={song.IsDownloaded} />
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        icon={Pencil}
                        title="Edit Song"
                        onClick={() => {
                          setSelectedSong(song);
                          setShowModal(true);
                        }}
                        className="bg-blue-500 text-black px-2 py-1 rounded text-xs"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="danger"
                        icon={Trash2}
                        title="Delete Song"
                        onClick={() => setSongToDelete(song)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      />
                    </div>
                    {song.IsDownloaded?.toUpperCase() !== "YES" && (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="primary"
                          icon={Download}
                          title="Queue Download"
                          onClick={() => handleQueue(song.SongID)}
                          className="bg-green-600 text-black px-2 py-1 rounded text-xs"
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              <ConfirmDialog
                open={songToDelete !== null}
                title="Delete Song"
                message={`Are you sure you want to delete "${songToDelete?.Title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                loading={deleteLoading}
                onConfirm={confirmDelete}
                onCancel={() => setSongToDelete(null)}
              />
            </tbody>
          </table>
        )}
        <EditSongModal
          song={selectedSong}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSaved={loadSongs}
        />
      </Card>

      <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-5">
        <div className="text-sm text-gray-600">
          <div className="text-sm text-slate-500">
            Page{" "}
            <span className="font-semibold text-slate-800">{currentPage}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={ChevronLeft}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>

          <div className="flex gap-1">
            {pageNumbers.map((page) => (
              <Button
                key={page}
                size="icon"
                variant={currentPage === page ? "primary" : "secondary"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="secondary"
            icon={ChevronRight}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
