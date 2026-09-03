"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  FileText,
  ImagePlus,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import { Alert, AlertDescription } from "@/components/ui/alert";

import type { Category } from "@/features/categories/types/category.types";

import { getAdminCategories } from "@/features/categories/services/category-admin.service";

import {
  adminArticlesService,
  type UpdateArticleInput,
} from "../services/admin-articles.service";

import type { Article, ArticleStatus } from "../types/article.types";

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

const articleEditSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters"),

  content: z.string().trim().min(20, "Content must be at least 20 characters"),

  category: z.string().min(1, "Please select a category"),

  tags: z.string().optional(),

  status: z.enum(["draft", "review", "published"]),
});

type ArticleEditFormValues = z.infer<typeof articleEditSchema>;

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

interface ArticleEditFormProps {
  articleId: string;
}

export default function ArticleEditForm({ articleId }: ArticleEditFormProps) {
  const router = useRouter();

  /* ------------------------------------------------------------------------ */
  /* State                                                                    */
  /* ------------------------------------------------------------------------ */

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [article, setArticle] = useState<Article | null>(null);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [media, setMedia] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  const [existingMedia, setExistingMedia] = useState<Article["mediaFiles"]>([]);

  const [removedMedia, setRemovedMedia] = useState<string[]>([]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Form                                                                     */
  /* ------------------------------------------------------------------------ */

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ArticleEditFormValues>({
    resolver: zodResolver(articleEditSchema),

    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: "",
      status: "draft",
    },
  });

  const selectedStatus = watch("status");

  /* ------------------------------------------------------------------------ */
  /* Load Article                                                             */
  /* ------------------------------------------------------------------------ */

  const {
    data: articleResponse,
    isLoading: articleLoading,
    isError: articleError,
  } = useQuery({
    queryKey: ["admin-article", articleId],

    queryFn: () => adminArticlesService.getAdminArticleById(articleId),

    enabled: Boolean(articleId),
  });

  /* ------------------------------------------------------------------------ */
  /* Load Categories                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const data = await getAdminCategories();

        if (mounted) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (mounted) {
          setSubmitError(
            "Failed to load categories. Please refresh and try again.",
          );
        }
      } finally {
        if (mounted) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Set Article Data                                                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const loadedArticle = articleResponse?.data;

    if (!loadedArticle) return;

    setArticle(loadedArticle);

    reset({
      title: loadedArticle.title,
      content: loadedArticle.content,

      category: loadedArticle.category?._id ?? "",

      tags: loadedArticle.tags?.join(", ") ?? "",

      status: loadedArticle.status,
    });

    /* Existing thumbnail */

    if (loadedArticle.thumbnail?.url) {
      setThumbnailPreview(loadedArticle.thumbnail.url);
    }

    /* Existing media */

    setExistingMedia(loadedArticle.mediaFiles ?? []);
  }, [articleResponse, reset]);

  /* ------------------------------------------------------------------------ */
  /* Thumbnail                                                                */
  /* ------------------------------------------------------------------------ */

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSubmitError("Thumbnail must be an image file.");

      event.target.value = "";

      return;
    }

    setSubmitError(null);

    /*
     * If current preview is a local object URL,
     * revoke it before replacing it.
     */
    if (thumbnail && thumbnailPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setThumbnail(file);
    setThumbnailPreview(previewUrl);

    event.target.value = "";
  };

  const removeNewThumbnail = () => {
    if (thumbnail && thumbnailPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnail(null);

    /*
     * Restore existing server thumbnail
     * when user removes the newly selected one.
     */
    if (article?.thumbnail?.url) {
      setThumbnailPreview(article.thumbnail.url);
    } else {
      setThumbnailPreview(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Existing Media                                                           */
  /* ------------------------------------------------------------------------ */

  const removeExistingMedia = (publicId: string) => {
    setExistingMedia((prev) =>
      prev.filter((mediaFile) => mediaFile.public_id !== publicId),
    );

    setRemovedMedia((prev) =>
      prev.includes(publicId) ? prev : [...prev, publicId],
    );
  };

  /* ------------------------------------------------------------------------ */
  /* New Media                                                                */
  /* ------------------------------------------------------------------------ */

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (!selectedFiles.length) return;

    const totalMediaCount = existingMedia.length + media.length;

    const remainingSlots = 10 - totalMediaCount;

    if (remainingSlots <= 0) {
      setSubmitError("You can upload a maximum of 10 media files.");

      event.target.value = "";

      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    const invalidFile = filesToAdd.find(
      (file) =>
        !file.type.startsWith("image/") && !file.type.startsWith("video/"),
    );

    if (invalidFile) {
      setSubmitError("Media files must be images or videos.");

      event.target.value = "";

      return;
    }

    if (selectedFiles.length > remainingSlots) {
      setSubmitError(`Only ${remainingSlots} more media file(s) can be added.`);
    } else {
      setSubmitError(null);
    }

    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));

    setMedia((prev) => [...prev, ...filesToAdd]);

    setMediaPreviews((prev) => [...prev, ...newPreviews]);

    event.target.value = "";
  };

  const removeNewMedia = (index: number) => {
    const preview = mediaPreviews[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setMedia((prev) => prev.filter((_, i) => i !== index));

    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  const onSubmit = async (values: ArticleEditFormValues) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const tags = values.tags
        ? values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const payload: UpdateArticleInput = {
        title: values.title,
        content: values.content,
        category: values.category,
        tags,
        status: values.status as ArticleStatus,

        thumbnail,

        media,

        removedMedia,
      };

      await adminArticlesService.updateArticle(articleId, payload);

      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      console.error("Failed to update article:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        setSubmitError(
          axiosError.response?.data?.message ??
            "Failed to update article. Please try again.",
        );
      } else {
        setSubmitError("Failed to update article. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (articleLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />

          <span>Loading article...</span>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (articleError || !article) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/articles")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Button>

        <Alert variant="destructive">
          <AlertDescription>
            Failed to load article. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/articles")}
            >
              <ArrowLeft className="h-5 w-5" />

              <span className="sr-only">Back to articles</span>
            </Button>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Edit Article
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Update and manage this news article.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Article Information                                               */}
        {/* ---------------------------------------------------------------- */}

        <Card>
          <CardHeader>
            <CardTitle>Article Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Title */}

            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>

              <Input
                id="title"
                placeholder="Enter article title"
                {...register("title")}
                disabled={isSubmitting}
              />

              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Content */}

            <div className="space-y-2">
              <Label htmlFor="content">
                Content <span className="text-destructive">*</span>
              </Label>

              <Textarea
                id="content"
                placeholder="Write your article content..."
                className="min-h-[300px] resize-y"
                {...register("content")}
                disabled={isSubmitting}
              />

              {errors.content && (
                <p className="text-sm text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Category + Status */}

            <div className="grid gap-5 md:grid-cols-2">
              {/* Category */}

              <div className="space-y-2">
                <Label>
                  Category <span className="text-destructive">*</span>
                </Label>

                <Select
                  value={watch("category")}
                  onValueChange={(value) =>
                    setValue("category", value, {
                      shouldValidate: true,
                    })
                  }
                  disabled={categoriesLoading || isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        categoriesLoading
                          ? "Loading categories..."
                          : "Select category"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="no-category" disabled>
                        No categories found
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                {errors.category && (
                  <p className="text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Status */}

              <div className="space-y-2">
                <Label>Status</Label>

                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setValue("status", value as ArticleStatus, {
                      shouldValidate: true,
                    })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>

                    <SelectItem value="review">Review</SelectItem>

                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>

              <Input
                id="tags"
                placeholder="politics, bangladesh, news"
                {...register("tags")}
                disabled={isSubmitting}
              />

              <p className="text-xs text-muted-foreground">
                Separate tags with commas.
              </p>

              {errors.tags && (
                <p className="text-sm text-destructive">
                  {errors.tags.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* Thumbnail                                                         */}
        {/* ---------------------------------------------------------------- */}

        <Card>
          <CardHeader>
            <CardTitle>Thumbnail</CardTitle>
          </CardHeader>

          <CardContent>
            {!thumbnailPreview ? (
              <label
                htmlFor="thumbnail"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center transition hover:bg-muted/50"
              >
                <ImagePlus className="mb-3 h-8 w-8 text-muted-foreground" />

                <p className="font-medium">Upload thumbnail</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Select one image
                </p>

                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailChange}
                  disabled={isSubmitting}
                />
              </label>
            ) : (
              <div className="relative w-fit overflow-hidden rounded-lg border">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="h-48 w-80 object-cover"
                />

                {thumbnail && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={removeNewThumbnail}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                {!thumbnail && (
                  <label
                    htmlFor="thumbnail-replace"
                    className="absolute bottom-2 right-2 cursor-pointer rounded-md bg-background px-3 py-1.5 text-xs font-medium shadow"
                  >
                    Replace
                    <input
                      id="thumbnail-replace"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailChange}
                      disabled={isSubmitting}
                    />
                  </label>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* Existing + New Media                                              */}
        {/* ---------------------------------------------------------------- */}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Media Files</CardTitle>

              <span className="text-sm text-muted-foreground">
                {existingMedia.length + media.length}
                /10
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Upload */}

            {existingMedia.length + media.length < 10 && (
              <label
                htmlFor="media"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center transition hover:bg-muted/50"
              >
                <Upload className="mb-3 h-8 w-8 text-muted-foreground" />

                <p className="font-medium">Upload images or videos</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  You can select up to{" "}
                  {10 - (existingMedia.length + media.length)} more files
                </p>

                <input
                  id="media"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleMediaChange}
                  disabled={isSubmitting}
                />
              </label>
            )}

            {/* Existing Media */}

            {existingMedia.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-medium">Existing Media</p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {existingMedia.map((file, index) => (
                    <div
                      key={file.public_id}
                      className="relative overflow-hidden rounded-lg border bg-muted"
                    >
                      {file.resource_type === "video" ? (
                        <video
                          src={file.url}
                          className="h-40 w-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={file.url}
                          alt={`Existing media ${index + 1}`}
                          className="h-40 w-full object-cover"
                        />
                      )}

                      <div className="flex items-center justify-between p-2">
                        <p className="truncate text-xs text-muted-foreground">
                          Existing file
                        </p>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExistingMedia(file.public_id)}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Media */}

            {media.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-medium">New Media</p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {media.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="relative overflow-hidden rounded-lg border bg-muted"
                    >
                      {file.type.startsWith("video/") ? (
                        <video
                          src={mediaPreviews[index]}
                          className="h-40 w-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={mediaPreviews[index]}
                          alt={`New media ${index + 1}`}
                          className="h-40 w-full object-cover"
                        />
                      )}

                      <div className="flex items-center justify-between gap-2 p-2">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">
                            {file.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeNewMedia(index)}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* Actions                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/articles")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Update Article
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
