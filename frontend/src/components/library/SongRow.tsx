import SongStatusBadge from "./SongStatusBadge";
import { Pencil, Trash2, Download } from "lucide-react";
import Button from "../ui/Button";
import { useState } from "react";
import {
  getSongs,
  getNotDownloadedSongs,
  getMissingFiles,
  deleteSong,
  queueSong,
  queueMissingSongs,
} from "../../services/songService";
import { useToast } from "../../hooks/useToast";
import { toast } from "sonner";


interface SongRowProps {
  song: any;
  onEdit: () => void;
  onDelete: () => void;
  onQueue: () => void;
}

export default function SongRow({ song, onEdit, onDelete, onQueue }: SongRowProps) {

    const [selectedSong, setSelectedSong] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [songs, setSongs] = useState([]);
    const [filter, setFilter] = useState("all");

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

    const handleDelete = async (songId: number, title: string) => {
    const confirmed = window.confirm(`Delete "${title}"?`);
    const toast = useToast();

    if (!confirmed) return;

    try {
      await deleteSong(songId);

      await loadSongs();

      toast.success("Song deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete song");
    }
  };

  const handleQueue = async (songId: number) => {
    try {
      await queueSong(songId);

      toast.success("Song added to download queue");
    } catch (err) {
      console.error(err);
      toast.error("Failed to queue song");
    }
  };

<tr className="border-b border-slate-200">
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
                        onClick={() => handleDelete(song.SongID, song.Title)}
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
}