"use client";

import { useEffect, useState } from "react";

import type { Media, MediaType } from "@/features/media/types/media.types";

import {
  deleteMedia,
  getAdminMedia,
  uploadMedia,
} from "@/features/media/services/media-admin.service";

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [filter, setFilter] = useState<"all" | MediaType>("all");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");

  async function loadMedia() {
    try {
      setLoading(true);

      const result = await getAdminMedia(filter === "all" ? undefined : filter);

      setMedia(result.data);
    } catch (error) {
      console.error("Failed to load media:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, [filter]);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      setUploading(true);

      const newMedia = await uploadMedia(selectedFile, title.trim());

      setMedia((prev) => [newMedia, ...prev]);

      setSelectedFile(null);
      setTitle("");

      const fileInput = document.getElementById(
        "media-file",
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Media upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "আপনি কি এই media permanently delete করতে চান?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteMedia(id);

      setMedia((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Media delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Media Library</h1>

        <p className="text-sm text-muted-foreground">
          Upload and manage images and videos
        </p>
      </div>

      {/* Upload */}
      <div className="rounded-lg border p-5">
        <h2 className="mb-4 text-lg font-semibold">Upload Media</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label
              htmlFor="media-title"
              className="mb-1 block text-sm font-medium"
            >
              Title
            </label>

            <input
              id="media-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Media title"
              className="w-full rounded-md border px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="media-file"
              className="mb-1 block text-sm font-medium"
            >
              File
            </label>

            <input
              id="media-file"
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-md border p-2"
            />
          </div>

          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name}
            </p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="rounded-md bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Media"}
          </button>
        </form>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "image", "video"] as const).map((value) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-md border px-4 py-2 text-sm ${
              filter === value ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            {value === "all" ? "All" : value === "image" ? "Images" : "Videos"}
          </button>
        ))}
      </div>

      {/* Gallery */}
      {loading ? (
        <div className="py-10 text-center">Loading media...</div>
      ) : media.length === 0 ? (
        <div className="rounded-lg border py-10 text-center text-muted-foreground">
          No media found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item) => {
            const isDeleting = deletingId === item._id;

            return (
              <div key={item._id} className="overflow-hidden rounded-lg border">
                {/* Preview */}
                <div className="aspect-video bg-muted">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.title || "Media"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-medium">{item.title || "Untitled"}</p>

                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString("bn-BD")}
                  </p>

                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={isDeleting}
                    className="w-full rounded-md border border-destructive px-3 py-2 text-sm text-destructive disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
