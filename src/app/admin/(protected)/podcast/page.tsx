"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Edit,
  Eye,
  Loader2,
  MessageSquare,
  Mic,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  createPodcast,
  deletePodcast,
  getAdminPodcasts,
  updatePodcast,
  type CreatePodcastInput,
  type UpdatePodcastInput,
} from "@/features/podcasts/services/podcast-admin.service";

import type { Podcast } from "@/features/podcasts/types/podcast.types";

export default function PodcastAdminPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-podcasts", search],
    queryFn: () => getAdminPodcasts(search),
  });

  const podcasts = data?.podcasts ?? [];

  const createMutation = useMutation({
    mutationFn: createPodcast,

    onSuccess: () => {
      toast.success("Podcast created successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-podcasts"],
      });

      closeModal();
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create podcast");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePodcastInput }) =>
      updatePodcast(id, input),

    onSuccess: () => {
      toast.success("Podcast updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-podcasts"],
      });

      closeModal();
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update podcast");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePodcast,

    onSuccess: () => {
      toast.success("Podcast deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["admin-podcasts"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete podcast");
    },
  });

  function closeModal() {
    setIsModalOpen(false);
    setEditingPodcast(null);
  }

  function handleEdit(podcast: Podcast) {
    setEditingPodcast(podcast);
    setIsModalOpen(true);
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this podcast?",
    );

    if (!confirmed) return;

    deleteMutation.mutate(id);
  }

  function handleSubmit(input: CreatePodcastInput | UpdatePodcastInput) {
    if (editingPodcast) {
      updateMutation.mutate({
        id: editingPodcast._id,
        input: input as UpdatePodcastInput,
      });
    } else {
      createMutation.mutate(input as CreatePodcastInput);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Podcasts</h1>

          <p className="text-sm text-muted-foreground">
            Manage your podcast content
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingPodcast(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Podcast
        </button>
      </div>

      {/* Search */}
      <div>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search podcasts..."
          className="w-full max-w-md rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-60 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive">Failed to load podcasts.</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && podcasts.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <Mic className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

          <h3 className="font-medium">No podcasts found</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first podcast.
          </p>
        </div>
      )}

      {/* Podcast Grid */}
      {!isLoading && !isError && podcasts.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {podcasts.map((podcast) => (
            <PodcastCard
              key={podcast._id}
              podcast={podcast}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deleting={
                deleteMutation.isPending &&
                deleteMutation.variables === podcast._id
              }
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <PodcastFormModal
          podcast={editingPodcast}
          loading={isSaving}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

/* =========================================================
   Podcast Card
========================================================= */

interface PodcastCardProps {
  podcast: Podcast;
  onEdit: (podcast: Podcast) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
}

function PodcastCard({
  podcast,
  onEdit,
  onDelete,
  deleting,
}: PodcastCardProps) {
  // FIX: router must be created inside PodcastCard
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        {podcast.thumbnail ? (
          <img
            src={podcast.thumbnail}
            alt={podcast.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {podcast.mediaType === "video" ? (
              <Video className="h-12 w-12 text-muted-foreground" />
            ) : (
              <Mic className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-md bg-background/90 px-2 py-1 text-xs font-medium">
          {podcast.mediaType === "video" ? "Video" : "Audio"}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        <div>
          <h2 className="line-clamp-1 font-semibold">{podcast.title}</h2>

          {podcast.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {podcast.description}
            </p>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{podcast.category}</span>

          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {podcast.views}
          </span>
        </div>

        {/* Audio Player */}
        {podcast.mediaType === "audio" && podcast.audioUrl && (
          <audio controls src={podcast.audioUrl} className="w-full" />
        )}

        {/* Video Player */}
        {podcast.mediaType === "video" && podcast.videoUrl && (
          <video
            controls
            src={podcast.videoUrl}
            poster={podcast.thumbnail || undefined}
            className="max-h-48 w-full rounded-md"
          />
        )}

        {/* Actions */}
        <div className="grid grid-cols-4 gap-2 border-t pt-3">
          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(podcast)}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-sm hover:bg-muted"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/podcast/${podcast._id}/stats`)}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-sm hover:bg-muted"
          >
            <BarChart3 className="h-4 w-4" />
            Stats
          </button>

          {/* Comments */}
          <button
            type="button"
            onClick={() =>
              router.push(`/admin/podcast/${podcast._id}/comments`)
            }
            className="inline-flex items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-sm hover:bg-muted"
          >
            <MessageSquare className="h-4 w-4" />
            Comments
          </button>

          {/* Delete */}
          <button
            type="button"
            disabled={deleting}
            onClick={() => onDelete(podcast._id)}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/30 px-2 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Podcast Form Modal
========================================================= */

interface PodcastFormModalProps {
  podcast: Podcast | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (input: CreatePodcastInput | UpdatePodcastInput) => void;
}

function PodcastFormModal({
  podcast,
  loading,
  onClose,
  onSubmit,
}: PodcastFormModalProps) {
  const [title, setTitle] = useState(podcast?.title ?? "");

  const [description, setDescription] = useState(podcast?.description ?? "");

  const [category, setCategory] = useState(podcast?.category ?? "general");

  const [audio, setAudio] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  function handleAudioChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setAudio(file);

    if (file) {
      setVideo(null);
    }
  }

  function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setVideo(file);

    if (file) {
      setAudio(null);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!podcast && !audio && !video) {
      toast.error("Please select an audio or video file");
      return;
    }

    if (audio && video) {
      toast.error("Upload either audio OR video");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || "general",
      audio,
      video,
      thumbnail,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-background shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-lg font-semibold">
              {podcast ? "Edit Podcast" : "Create Podcast"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {podcast ? "Update podcast information" : "Add a new podcast"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md p-2 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Podcast title"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="Podcast description"
              className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>

            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="general"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Media */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Audio */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Audio</label>

              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="block w-full text-sm"
              />

              {audio && (
                <p className="text-xs text-muted-foreground">{audio.name}</p>
              )}
            </div>

            {/* Video */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Video</label>

              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="block w-full text-sm"
              />

              {video && (
                <p className="text-xs text-muted-foreground">{video.name}</p>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Thumbnail</label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setThumbnail(event.target.files?.[0] ?? null)
              }
              className="block w-full text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}

              {podcast ? "Update Podcast" : "Create Podcast"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
