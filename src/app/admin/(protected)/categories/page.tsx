"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  Loader2,
  Folder,
  CornerDownRight,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";

import type { Category } from "@/features/categories/types/category.types";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  normalizeCategories,
  updateCategory,
} from "@/features/categories/services/category-admin.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/Skeleton";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parent, setParent] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState<number>(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Collapsible parent state
  const [collapsedParentIds, setCollapsedParentIds] = useState<Record<string, boolean>>({});

  const formRef = useRef<HTMLDivElement | null>(null);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getAdminCategories();
      setCategories(normalizeCategories(data));
    } catch (error: any) {
      console.error("Failed to load categories:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load categories. Please refresh.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  /**
   * Helper to get parent ID string safely
   */
  const getParentId = (cat: Category): string | null => {
    if (!cat.parent) return null;
    if (typeof cat.parent === "object" && cat.parent._id) {
      return cat.parent._id;
    }
    return cat.parent as string;
  };

  /**
   * Only top-level categories (parent is null) can be parents
   */
  const parentCategories = useMemo(() => {
    return categories
      .filter((cat) => getParentId(cat) === null)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [categories]);

  /**
   * Map parent IDs to their children
   */
  const parentChildrenMap = useMemo(() => {
    const map = new Map<string, Category[]>();
    categories.forEach((cat) => {
      const pId = getParentId(cat);
      if (pId) {
        if (!map.has(pId)) map.set(pId, []);
        map.get(pId)!.push(cat);
      }
    });

    // Sort children by sortOrder
    map.forEach((children) => {
      children.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    });

    return map;
  }, [categories]);

  /**
   * Filtered list based on search term
   */
  const filteredParents = useMemo(() => {
    if (!search.trim()) return parentCategories;
    const q = search.trim().toLowerCase();

    return parentCategories.filter((parentCat) => {
      const matchesParent =
        parentCat.name.toLowerCase().includes(q) ||
        parentCat.slug.toLowerCase().includes(q);

      const children = parentChildrenMap.get(parentCat._id) ?? [];
      const matchesChild = children.some(
        (child) =>
          child.name.toLowerCase().includes(q) ||
          child.slug.toLowerCase().includes(q),
      );

      return matchesParent || matchesChild;
    });
  }, [parentCategories, parentChildrenMap, search]);

  /**
   * Auto-suggest English slug when user types name
   */
  function handleNameChange(val: string) {
    setName(val);
    if (!editingId && (!slug || slug === name.toLowerCase().replace(/\s+/g, "-"))) {
      const candidate = val
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      if (candidate) {
        setSlug(candidate);
      }
    }
  }

  /**
   * Submit create or update
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim().toLowerCase();

    if (!trimmedName) {
      toast.error("Category name is required");
      return;
    }

    if (!trimmedSlug) {
      toast.error("Category slug is required");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      toast.error(
        "Slug must contain only English letters, numbers and hyphens (e.g. share-market)",
      );
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        const updated = await updateCategory(editingId, {
          name: trimmedName,
          slug: trimmedSlug,
          parent,
          isFeatured,
          sortOrder: Number(sortOrder) || 0,
        });

        toast.success("Category updated successfully");
        setCategories((prev) =>
          prev.map((c) => (c._id === editingId ? updated : c)),
        );
      } else {
        const created = await createCategory({
          name: trimmedName,
          slug: trimmedSlug,
          parent,
          isFeatured,
          sortOrder: Number(sortOrder) || 0,
        });

        toast.success(
          parent ? "Sub-category created successfully" : "Category created successfully",
        );
        // Refresh to ensure full consistency and hierarchy
        await loadCategories();
      }

      handleResetForm();
    } catch (error: any) {
      console.error("Save failed:", error);
      toast.error(
        error?.response?.data?.message || "Failed to save category. Please check your input.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(category: Category) {
    setEditingId(category._id);
    setName(category.name);
    setSlug(category.slug);
    setParent(getParentId(category));
    setIsFeatured(category.isFeatured ?? false);
    setSortOrder(category.sortOrder ?? 0);

    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleAddSubcategory(parentCat: Category) {
    handleResetForm();
    setParent(parentCat._id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    toast.info(`Creating subcategory under "${parentCat.name}"`);
  }

  function handleResetForm() {
    setEditingId(null);
    setName("");
    setSlug("");
    setParent(null);
    setIsFeatured(false);
    setSortOrder(0);
  }

  async function confirmDelete() {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCategory(categoryToDelete._id);
      toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
      setCategories((prev) =>
        prev.filter((c) => c._id !== categoryToDelete._id),
      );
      setCategoryToDelete(null);
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Cannot delete category. Ensure it has no subcategories or articles.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function toggleParentCollapse(id: string) {
    setCollapsedParentIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  const totalMainCategories = parentCategories.length;
  const totalSubcategories = categories.length - totalMainCategories;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Categories & Sub-categories
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your news categories, sub-categories, hierarchy, and ordering.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            Total: <span className="ml-1 font-bold">{categories.length}</span>
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            Main: <span className="ml-1 font-bold">{totalMainCategories}</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">
            Sub: <span className="ml-1 font-bold">{totalSubcategories}</span>
          </Badge>
        </div>
      </div>

      {/* Add / Edit Form Card */}
      <div ref={formRef}>
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                {editingId ? (
                  <>
                    <Pencil className="h-4 w-4 text-primary" />
                    Edit Category
                    <Badge variant="secondary" className="ml-2">
                      {name || "Untitled"}
                    </Badge>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 text-primary" />
                    Add Category / Sub-category
                  </>
                )}
              </CardTitle>

              {editingId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetForm}
                  className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" /> Cancel Edit
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
                {/* Name */}
                <div className="space-y-1.5 lg:col-span-4">
                  <Label htmlFor="cat-name" className="text-xs font-medium">
                    Category Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cat-name"
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. বাণিজ্য or শেয়ার বাজার"
                    required
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5 lg:col-span-4">
                  <Label htmlFor="cat-slug" className="text-xs font-medium">
                    Slug (English only) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cat-slug"
                    type="text"
                    value={slug}
                    onChange={(e) =>
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                      )
                    }
                    placeholder="e.g. business or share-market"
                    required
                  />
                </div>

                {/* Parent Category */}
                <div className="space-y-1.5 lg:col-span-4">
                  <Label htmlFor="cat-parent" className="text-xs font-medium">
                    Parent Category
                  </Label>
                  <select
                    id="cat-parent"
                    value={parent ?? ""}
                    onChange={(e) => setParent(e.target.value || null)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">None (Main Category)</option>
                    {parentCategories
                      .filter((c) => c._id !== editingId)
                      .map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.slug})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div className="space-y-1.5 sm:col-span-1 lg:col-span-3">
                  <Label htmlFor="cat-order" className="text-xs font-medium flex items-center gap-1">
                    <ArrowUpDown className="h-3 w-3" /> Sort Order
                  </Label>
                  <Input
                    id="cat-order"
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>

                {/* Featured Category Toggle */}
                <div className="flex items-center space-x-2 pt-6 sm:col-span-1 lg:col-span-4">
                  <input
                    id="cat-featured"
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <Label htmlFor="cat-featured" className="text-sm font-medium cursor-pointer flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Featured Category (Highlights)
                  </Label>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex items-end justify-end gap-2 pt-4 sm:col-span-2 lg:col-span-5">
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetForm}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={saving || !name.trim() || !slug.trim()}
                    className="min-w-[140px]"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : editingId ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Update Category
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        {parent ? "Add Sub-category" : "Add Category"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table Section */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base font-semibold">
              Category Hierarchy Tree
            </CardTitle>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search category or subcategory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Category Name</th>
                  <th className="px-4 py-3 text-left font-medium">Slug</th>
                  <th className="px-4 py-3 text-center font-medium">Type</th>
                  <th className="px-4 py-3 text-center font-medium">Subcategories</th>
                  <th className="px-4 py-3 text-center font-medium">Featured</th>
                  <th className="px-4 py-3 text-center font-medium">Order</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-36" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-24" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Skeleton className="mx-auto h-5 w-16" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Skeleton className="mx-auto h-5 w-10" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Skeleton className="mx-auto h-5 w-8" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Skeleton className="mx-auto h-5 w-8" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Skeleton className="ml-auto h-7 w-28" />
                      </td>
                    </tr>
                  ))
                ) : filteredParents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      <Folder className="mx-auto h-10 w-10 opacity-30 mb-2" />
                      <p className="font-medium">No categories found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {search
                          ? "Try searching with a different keyword."
                          : "Use the form above to add your first category."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredParents.map((parentCat) => {
                    const children = parentChildrenMap.get(parentCat._id) ?? [];
                    const hasChildren = children.length > 0;
                    const isCollapsed = Boolean(collapsedParentIds[parentCat._id]);

                    return (
                      <React.Fragment key={parentCat._id}>
                        {/* Parent Category Row */}
                        <tr className="hover:bg-muted/30 transition-colors bg-background font-medium">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {hasChildren ? (
                                <button
                                  type="button"
                                  onClick={() => toggleParentCollapse(parentCat._id)}
                                  className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                  title={isCollapsed ? "Expand subcategories" : "Collapse subcategories"}
                                >
                                  {isCollapsed ? (
                                    <ChevronRight className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                              ) : (
                                <span className="w-6 inline-block" />
                              )}
                              <span className="font-semibold text-foreground">
                                {parentCat.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {parentCat.slug}
                          </td>

                          <td className="px-4 py-3 text-center">
                            <Badge variant="default" className="text-[11px] font-normal">
                              Parent
                            </Badge>
                          </td>

                          <td className="px-4 py-3 text-center">
                            {hasChildren ? (
                              <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                                {children.length}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">0</span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-center">
                            {parentCat.isFeatured ? (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                                ✓ Yes
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">No</span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                            {parentCat.sortOrder ?? 0}
                          </td>

                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs px-2 gap-1 text-primary hover:text-primary hover:bg-primary/5"
                                onClick={() => handleAddSubcategory(parentCat)}
                                title="Add subcategory under this parent"
                              >
                                <Plus className="h-3 w-3" />
                                Sub
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs px-2 gap-1"
                                onClick={() => handleEdit(parentCat)}
                              >
                                <Pencil className="h-3 w-3" />
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs px-2 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                                onClick={() => setCategoryToDelete(parentCat)}
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Subcategory Rows */}
                        {!isCollapsed &&
                          children.map((childCat, index) => {
                            const isLast = index === children.length - 1;

                            return (
                              <tr
                                key={childCat._id}
                                className="hover:bg-muted/40 transition-colors bg-muted/10 text-sm"
                              >
                                <td className="px-4 py-2.5">
                                  <div className="flex items-center gap-1.5 pl-8 sm:pl-10">
                                    <span className="text-muted-foreground/60 select-none font-mono text-xs">
                                      {isLast ? "└─" : "├─"}
                                    </span>
                                    <CornerDownRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                                    <span className="text-foreground/90 font-medium">
                                      {childCat.name}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                                  {childCat.slug}
                                </td>

                                <td className="px-4 py-2.5 text-center">
                                  <Badge variant="outline" className="text-[11px] font-normal bg-background">
                                    Child
                                  </Badge>
                                </td>

                                <td className="px-4 py-2.5 text-center text-xs text-muted-foreground">
                                  —
                                </td>

                                <td className="px-4 py-2.5 text-center">
                                  {childCat.isFeatured ? (
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                                      ✓ Yes
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">No</span>
                                  )}
                                </td>

                                <td className="px-4 py-2.5 text-center text-xs text-muted-foreground">
                                  {childCat.sortOrder ?? 0}
                                </td>

                                <td className="px-4 py-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 text-xs px-2 gap-1 hover:bg-background"
                                      onClick={() => handleEdit(childCat)}
                                    >
                                      <Pencil className="h-3 w-3" />
                                      Edit
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 text-xs px-2 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                      onClick={() => setCategoryToDelete(childCat)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => {
          if (!open) setCategoryToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete category{" "}
              <strong className="text-foreground font-semibold">
                "{categoryToDelete?.name}"
              </strong>
              ?
              <br />
              <span className="mt-2 block text-xs text-muted-foreground">
                Note: Categories with existing subcategories or attached articles cannot be deleted.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete Category"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
