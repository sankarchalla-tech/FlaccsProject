import { useEffect, useState } from "react";
import { getSongs, deleteSong, queueSong, queueMissingSongs } from "../services/songService";
import EditSongModal from "./EditSongModal";

export default function SongTable() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [queuingAll, setQueuingAll] = useState(false);

  const PAGE_SIZE = 50;

  useEffect(() => {
    loadSongs();
  }, []);

  async function loadSongs() {
    try {
      const res = await getSongs();
      setSongs(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const filteredSongs = songs.filter((song: any) => {
    const matchesSearch =
      song.Title?.toLowerCase().includes(search.toLowerCase()) ||
      song.Artist?.toLowerCase().includes(search.toLowerCase());

    const matchesMissing =
      !showMissingOnly || song.IsDownloaded?.toLowerCase() !== "yes";

    return matchesSearch && matchesMissing;
  });

  const handleDelete = async (songId: number, title: string) => {
    const confirmed = window.confirm(`Delete "${title}"?`);

    if (!confirmed) return;

    try {
      await deleteSong(songId);

      await loadSongs();

      alert("Song deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete song");
    }
  };

  const handleQueue = async (songId: number) => {
    try {
      await queueSong(songId);

      alert("Song added to download queue");
    } catch (err) {
      console.error(err);
      alert("Failed to queue song");
    }
  };

  const handleQueueAllMissing = async () => {
    const confirmed = window.confirm(
      "Queue all missing songs for download?"
    );
    if (!confirmed) return;

    setQueuingAll(true);
    try {
      const res = await queueMissingSongs();
      alert(`${res.data.queued} missing songs added to queue`);
      loadSongs();
    } catch (err) {
      console.error(err);
      alert("Failed to queue missing songs");
    } finally {
      setQueuingAll(false);
    }
  };

  const totalPages = Math.ceil(filteredSongs.length / PAGE_SIZE);

  const paginatedSongs = filteredSongs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search songs..."
          className="w-full border rounded px-3 py-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to first page on search change
          }}
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="missingOnly"
          checked={showMissingOnly}
          onChange={(e) => {
            setShowMissingOnly(e.target.checked);
            setCurrentPage(1); // Reset to first page on filter change
          }}
          className="h-4 w-4"
        />

        <label htmlFor="missingOnly" className="text-sm font-medium">
          Show Missing Songs Only
        </label>

        <button
          onClick={handleQueueAllMissing}
          disabled={queuingAll}
          className="ml-auto bg-purple-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {queuingAll ? "Queuing..." : "Queue All Missing"}
        </button>
      </div>

      <div className="mb-3 text-sm text-gray-600">
        Showing {(currentPage - 1) * PAGE_SIZE + 1}-
        {Math.min(currentPage * PAGE_SIZE, filteredSongs.length)}
        of {filteredSongs.length} songs
      </div>

      <div className="overflow-auto max-h-[600px]">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>SongID</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSongs.map((song: any) => (
              <tr key={song.SongID}>
                <td>{song.SongID}</td>
                <td>{song.Title}</td>
                <td>{song.Artist}</td>
                <td>{song.Album}</td>

                <td>
                  {song.IsDownloaded === "YES" ? (
                    <span className="text-green-600 font-bold">YES</span>
                  ) : (
                    <span className="text-red-600 font-bold">NO</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedSong(song);
                      setShowModal(true);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(song.SongID, song.Title)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>

                  {song.IsDownloaded?.toUpperCase() !== "YES" && (
                    <button
                      onClick={() => handleQueue(song.SongID)}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Queue
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <EditSongModal
          song={selectedSong}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSaved={loadSongs}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : "border"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
