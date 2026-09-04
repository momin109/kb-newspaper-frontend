"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit,
  Eye,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";

import {
  createStory,
  deleteStory,
  getAdminStories,
  updateStory,
} from "@/features/stories/services/story-admin.service";

import type { Story } from "@/features/stories/types/story.types";

export default function StoriesPage() {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stories"],
    queryFn: getAdminStories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-stories"],
      });
    },
  });

  function handleCreate() {
    setEditingStory(null);
    setIsFormOpen(true);
  }

  function handleEdit(story: Story) {
    setEditingStory(story);
    setIsFormOpen(true);
  }

  async function handleDelete(story: Story) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${story.title || "this story"}"?`,
    );

    if (!confirmed) return;

    deleteMutation.mutate(story._id);
  }

  function handleFormSuccess() {
    setIsFormOpen(false);
    setEditingStory(null);

    queryClient.invalidateQueries({
      queryKey: ["admin-stories"],
    });
  }

  const stories = data?.stories ?? [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Stories</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage temporary image and video stories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Story
        </button>
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
          <p className="text-sm text-destructive">Failed to load stories.</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading stories...
          </div>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && stories.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border">
          <ImageIcon className="mb-3 h-10 w-10 text-muted-foreground" />

          <h2 className="font-medium">No stories found</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first story to get started.
          </p>

          <button
            type="button"
            onClick={handleCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Create Story
          </button>
        </div>
      )}

      {/* Stories */}
      {!isLoading && !isError && stories.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stories.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              deleting={deleteMutation.isPending}
              onEdit={() => handleEdit(story)}
              onDelete={() => handleDelete(story)}
            />
          ))}
        </div>
      )}

      {/* Form */}
      {isFormOpen && (
        <StoryForm
          story={editingStory}
          onClose={() => {
            setIsFormOpen(false);
            setEditingStory(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

interface StoryCardProps {
  story: Story;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function StoryCard({ story, deleting, onEdit, onDelete }: StoryCardProps) {
  const expired = new Date(story.expiresAt) <= new Date();

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {/* Media */}
      <div className="relative aspect-[9/12] overflow-hidden bg-muted">
        {story.mediaType === "video" ? (
          <video
            src={story.mediaUrl}
            poster={story.thumbnail || undefined}
            controls
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={story.mediaUrl}
            alt={story.title || "Story"}
            className="h-full w-full object-cover"
          />
        )}

        {/* Type badge */}
        <div className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
          {story.mediaType === "video" ? (
            <span className="flex items-center gap-1">
              <Video className="h-3 w-3" />
              Video
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              Image
            </span>
          )}
        </div>

        {/* Status */}
        <div
          className={`absolute right-3 top-3 rounded-md px-2 py-1 text-xs font-medium ${
            expired
              ? "bg-destructive text-destructive-foreground"
              : "bg-black/70 text-white"
          }`}
        >
          {expired ? "Expired" : "Active"}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-2 font-medium">
            {story.title || "Untitled Story"}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(story.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {story.views} views
          </span>

          <span className="text-xs">
            Expires: {new Date(story.expiresAt).toLocaleDateString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center rounded-md border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface StoryFormProps {
  story: Story | null;
  onClose: () => void;
  onSuccess: () => void;
}

function StoryForm({ story, onClose, onSuccess }: StoryFormProps) {
  const [title, setTitle] = useState(story?.title ?? "");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">(
    story?.mediaType ?? "image",
  );
  const [error, setError] = useState("");

  const createMutation = useMutation({
    mutationFn: createStory,
    onSuccess,
    onError: (error: any) => {
      setError(error?.response?.data?.message || "Failed to create story.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: {
      title?: string;
      image?: File | null;
      video?: File | null;
    }) => updateStory(story!._id, input),
    onSuccess,
    onError: (error: any) => {
      setError(error?.response?.data?.message || "Failed to update story.");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) return;

    if (mediaType === "image" && !file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (mediaType === "video" && !file.type.startsWith("video/")) {
      setError("Please select a video file.");
      return;
    }

    setError("");
    setMediaFile(file);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!story && !mediaFile) {
      setError("Please select an image or video.");
      return;
    }

    if (story && mediaFile) {
      if (mediaType === "image") {
        updateMutation.mutate({
          title,
          image: mediaFile,
          video: null,
        });
      } else {
        updateMutation.mutate({
          title,
          image: null,
          video: mediaFile,
        });
      }

      return;
    }

    if (story) {
      updateMutation.mutate({
        title,
      });

      return;
    }

    if (mediaType === "image") {
      createMutation.mutate({
        title,
        image: mediaFile,
        video: null,
      });
    } else {
      createMutation.mutate({
        title,
        image: null,
        video: mediaFile,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-lg font-semibold">
              {story ? "Edit Story" : "Create Story"}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {story
                ? "Update story information or media."
                : "Upload an image or video. Stories expire after 24 hours."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {/* Error */}
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter story title"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Media type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Media Type</label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMediaType("image");
                  setMediaFile(null);
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm ${
                  mediaType === "image"
                    ? "border-primary bg-primary/5 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                Image
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaType("video");
                  setMediaFile(null);
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm ${
                  mediaType === "video"
                    ? "border-primary bg-primary/5 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <Video className="h-4 w-4" />
                Video
              </button>
            </div>
          </div>

          {/* File */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {story ? "Replace Media (optional)" : "Media"}
            </label>

            <input
              type="file"
              accept={mediaType === "image" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="block w-full rounded-md border p-2 text-sm"
            />

            {mediaFile && (
              <p className="text-xs text-muted-foreground">
                Selected: {mediaFile.name}
              </p>
            )}

            {story && !mediaFile && (
              <p className="text-xs text-muted-foreground">
                Current media will be kept.
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}

              {story ? "Update Story" : "Create Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
