import { useState, useEffect } from "react";
import { updateSong } from "../../services/songService";
import { useToast } from "../../hooks/useToast";

interface Props {
  song: any;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditSongModal({
  song,
  isOpen,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    setForm(song || {});
  }, [song]);

  if (!isOpen || !song) return null;
  const toast = useToast();

  const handleSave = async () => {
    try {
      await updateSong(song.SongID, form);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update song");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[500px]">
        <h2 className="text-xl font-bold mb-4">Edit Song</h2>

        <div className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            value={form.Title || ""}
            placeholder="Title"
            onChange={(e) =>
              setForm({ ...form, Title: e.target.value })
            }
          />

          <input
            className="w-full border p-2 rounded"
            value={form.Artist || ""}
            placeholder="Artist"
            onChange={(e) =>
              setForm({ ...form, Artist: e.target.value })
            }
          />

          <input
            className="w-full border p-2 rounded"
            value={form.Album || ""}
            placeholder="Album"
            onChange={(e) =>
              setForm({ ...form, Album: e.target.value })
            }
          />

          <input
            className="w-full border p-2 rounded"
            value={form.PlaylistName || ""}
            placeholder="Playlist"
            onChange={(e) =>
              setForm({ ...form, PlaylistName: e.target.value })
            }
          />

          <select
            className="w-full border p-2 rounded"
            value={form.IsDownloaded || "NO"}
            onChange={(e) =>
              setForm({
                ...form,
                IsDownloaded: e.target.value,
              })
            }
          >
            <option value="YES">YES</option>
            <option value="NO">NO</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}