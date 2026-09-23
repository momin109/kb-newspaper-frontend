"use client";

import { useEffect, useState } from "react";

import type { Media, MediaType } from "@/features/media/types/media.types";

import {
  addYoutubeVideo,
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

  const [uploadMode, setUploadMode] = useState<"file" | "youtube">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
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

    if (uploadMode === "youtube" && !youtubeUrl.trim()) {
      alert("Please paste a YouTube link");
      return;
    }

    if (uploadMode === "file" && !selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      setUploading(true);

      let newMedia: Media;

      if (uploadMode === "youtube") {
        newMedia = await addYoutubeVideo(youtubeUrl.trim(), title.trim());
      } else {
        newMedia = await uploadMedia(selectedFile!, title.trim());
      }

      setMedia((prev) => [newMedia, ...prev]);

      // Reset form
      setSelectedFile(null);
      setYoutubeUrl("");
      setTitle("");

      const fileInput = document.getElementById(
        "media-file",
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);

      alert(
        uploadMode === "youtube"
          ? "Adding YouTube video failed"
          : "Media upload failed",
      );
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
          Upload images/videos, or add a YouTube video by link
        </p>
      </div>

      {/* Add Media */}
      <div className="rounded-lg border p-5">
        <h2 className="mb-4 text-lg font-semibold">Add Media</h2>

        {/* Mode Switch */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setUploadMode("file")}
            className={`rounded-md border px-4 py-2 text-sm ${
              uploadMode === "file" ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            File Upload
          </button>

          <button
            type="button"
            onClick={() => setUploadMode("youtube")}
            className={`rounded-md border px-4 py-2 text-sm ${
              uploadMode === "youtube"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            YouTube Link
          </button>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* Title */}
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

          {/* File Upload */}
          {uploadMode === "file" ? (
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

              {selectedFile && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          ) : (
            /* YouTube */
            <div>
              <label
                htmlFor="youtube-url"
                className="mb-1 block text-sm font-medium"
              >
                YouTube URL
              </label>

              <input
                id="youtube-url"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-md border px-3 py-2 outline-none"
              />

              <p className="mt-1 text-xs text-muted-foreground">
                watch, youtu.be, embed, ও shorts — সব link support করে
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            className="rounded-md bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"
          >
            {uploading
              ? "Saving..."
              : uploadMode === "youtube"
                ? "Add YouTube Video"
                : "Upload Media"}
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "image", "video"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-md border px-4 py-2 text-sm ${
              filter === value ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            {value === "all" ? "All" : value === "image" ? "Images" : "Videos"}
          </button>
        ))}
      </div>

      {/* Media List */}
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
            const isYoutube = item.sourceType === "youtube";

            return (
              <div key={item._id} className="overflow-hidden rounded-lg border">
                {/* Preview */}
                <div className="relative aspect-video bg-muted">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.title || "Media"}
                      className="h-full w-full object-cover"
                    />
                  ) : isYoutube ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="relative block h-full w-full"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title || "YouTube video"}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                        ▶
                      </span>
                    </a>
                  ) : (
                    <video
                      src={item.url}
                      controls
                      className="h-full w-full object-cover"
                    />
                  )}

                  {/* YouTube Badge */}
                  {isYoutube && (
                    <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-[10px] font-medium text-white">
                      YouTube
                    </span>
                  )}
                </div>

                {/* Media Info */}
                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-medium">{item.title || "Untitled"}</p>

                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString("bn-BD")}
                  </p>

                  {/* Delete */}
                  <button
                    type="button"
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
