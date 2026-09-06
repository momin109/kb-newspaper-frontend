"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Search,
  RefreshCw,
  FileText,
  Loader2,
  CheckCircle2,
  Clock3,
  Send,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { adminArticlesService } from "../services/admin-articles.service";

import type { Article, ArticleStatus } from "../types/article.types";

type StatusFilter = "all" | ArticleStatus;

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const [changingStatusId, setChangingStatusId] = useState<string | null>(null);

  /**
   * Fetch admin articles
   */
  const fetchArticles = useCallback(
    async (showRefreshLoader = false) => {
      try {
        setError(null);

        if (showRefreshLoader) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const response = await adminArticlesService.getAdminArticles(
          statusFilter === "all" ? undefined : statusFilter,
        );

        setArticles(response.data ?? []);
      } catch (err) {
        console.error("Failed to fetch admin articles:", err);

        setError("Failed to load articles. Please try again.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [statusFilter],
  );

  /**
   * Initial fetch + status filter change
   */
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  /**
   * Client-side search
   *
   * Backend admin API currently supports status only.
   */
  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return articles;
    }

    return articles.filter((article) => {
      const title = article.title?.toLowerCase() ?? "";

      const category = article.category?.name?.toLowerCase() ?? "";

      const author = article.author?.fullName?.toLowerCase() ?? "";

      const tags = article.tags?.join(" ").toLowerCase() ?? "";

      return (
        title.includes(query) ||
        category.includes(query) ||
        author.includes(query) ||
        tags.includes(query)
      );
    });
  }, [articles, search]);

  /**
   * Delete article
   */
  const handleDelete = async () => {
    if (!deleteArticleId) return;

    try {
      setIsDeleting(true);

      await adminArticlesService.deleteArticle(deleteArticleId);

      setArticles((prev) =>
        prev.filter((article) => article._id !== deleteArticleId),
      );

      setDeleteArticleId(null);
    } catch (err) {
      console.error("Failed to delete article:", err);

      setError("Failed to delete article. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Change article status
   */
  const handleStatusChange = async (
    articleId: string,
    status: ArticleStatus,
  ) => {
    try {
      setChangingStatusId(articleId);

      const response = await adminArticlesService.changeArticleStatus(
        articleId,
        status,
      );

      const updatedArticle = response.data;

      setArticles((prev) =>
        prev.map((article) =>
          article._id === articleId
            ? {
                ...article,
                ...updatedArticle,
              }
            : article,
        ),
      );
    } catch (err) {
      console.error("Failed to change article status:", err);

      setError("Failed to change article status. Please try again.");
    } finally {
      setChangingStatusId(null);
    }
  };

  /**
   * Status badge
   */
  const renderStatus = (status: ArticleStatus) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Published
          </Badge>
        );

      case "review":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            Review
          </Badge>
        );

      case "draft":
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <FileText className="h-3.5 w-3.5" />
            Draft
          </Badge>
        );
    }
  };

  /**
   * Format date
   */
  const formatDate = (date: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(date));
    } catch {
      return "—";
    }
  };

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-7 w-7 animate-spin" />

          <p className="text-sm">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage and monitor all news articles.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => fetchArticles(true)}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-destructive">{error}</p>

            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles..."
              className="pl-9"
            />
          </div>

          {/* Status */}
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>

              <SelectItem value="published">Published</SelectItem>

              <SelectItem value="review">Review</SelectItem>

              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredArticles.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {articles.length}
            </span>{" "}
            articles
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>

                  <TableHead>Article</TableHead>

                  <TableHead>Category</TableHead>

                  <TableHead>Author</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Views</TableHead>

                  <TableHead>Date</TableHead>

                  <TableHead className="w-[60px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-[300px] text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div>
                          <p className="font-medium">No articles found</p>

                          <p className="mt-1 text-sm text-muted-foreground">
                            Try changing your search or filter.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article) => (
                    <TableRow key={article._id}>
                      {/* Thumbnail */}
                      <TableCell>
                        <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                          {article.thumbnail?.url ? (
                            <Image
                              src={article.thumbnail.url}
                              alt={article.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Article */}
                      <TableCell>
                        <div className="max-w-[300px]">
                          <p className="truncate font-medium">
                            {article.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            /{article.slug}
                          </p>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <span className="text-sm">
                          {article.category?.name ?? "Uncategorized"}
                        </span>
                      </TableCell>

                      {/* Author */}
                      <TableCell>
                        <span className="text-sm">
                          {article.author?.fullName ?? "Unknown"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>{renderStatus(article.status)}</TableCell>

                      {/* Views */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Eye className="h-3.5 w-3.5" />

                          {article.views.toLocaleString()}
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        <span className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(article.createdAt)}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={changingStatusId === article._id}
                              />
                            }
                          >
                            {changingStatusId === article._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                            <span className="sr-only">Open actions</span>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-48">
                            {/* View */}
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(
                                  `/article/${article.slug}`,
                                  "_blank",
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Article
                            </DropdownMenuItem>

                            {/* Edit */}
                            <DropdownMenuItem
                              onClick={() =>
                                (window.location.href = `/admin/articles/${article._id}/edit`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Article
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Publish */}
                            {article.status !== "published" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(article._id, "published")
                                }
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Publish
                              </DropdownMenuItem>
                            )}

                            {/* Review */}
                            {article.status !== "review" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(article._id, "review")
                                }
                              >
                                <Clock3 className="mr-2 h-4 w-4" />
                                Move to Review
                              </DropdownMenuItem>
                            )}

                            {/* Draft */}
                            {article.status !== "draft" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(article._id, "draft")
                                }
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Move to Draft
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {/* Delete */}
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteArticleId(article._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Article
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={Boolean(deleteArticleId)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteArticleId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. The article and its uploaded media
              will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
