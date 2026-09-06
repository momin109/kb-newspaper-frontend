"use client";

import { useEffect, useMemo, useState } from "react";

import type { Category } from "@/features/categories/types/category.types";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from "@/features/categories/services/category-admin.service";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parent, setParent] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    try {
      setLoading(true);

      const data = await getAdminCategories();

      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  /**
   * Only top-level categories can be selected
   * as a parent.
   */
  const parentCategories = useMemo(() => {
    return categories.filter((category) => category.parent === null);
  }, [categories]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim().toLowerCase();

    if (!trimmedName || !trimmedSlug) return;

    // English slug validation
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      alert(
        "Slug must contain only English letters, numbers and hyphens.\nExample: entertainment",
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
        });

        setCategories((prev) =>
          prev.map((category) =>
            category._id === editingId ? updated : category,
          ),
        );
      } else {
        const created = await createCategory({
          name: trimmedName,
          slug: trimmedSlug,
          parent,
        });

        setCategories((prev) => [created, ...prev]);
      }

      setName("");
      setSlug("");
      setParent(null);
      setEditingId(null);
    } catch (error) {
      console.error("Category save failed:", error);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(category: Category) {
    setEditingId(category._id);
    setName(category.name);
    setSlug(category.slug);
    setParent(category.parent);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
    setSlug("");
    setParent(null);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("আপনি কি এই category টি delete করতে চান?");

    if (!confirmed) return;

    try {
      await deleteCategory(id);

      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Category delete failed:", error);
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>

        <p className="text-sm text-muted-foreground">
          Manage your news categories and sub-categories
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg border bg-background p-5">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "Edit Category" : "Add Category"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid gap-3 sm:grid-cols-[1fr_1fr_220px_auto_auto]"
        >
          {/* Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
          />

          {/* Slug */}
          <input
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
            placeholder="Slug (e.g. entertainment)"
            className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
          />

          {/* Parent */}
          <select
            value={parent ?? ""}
            onChange={(e) => setParent(e.target.value || null)}
            className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">No Parent</option>

            {parentCategories
              .filter((category) => category._id !== editingId)
              .map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="rounded-md bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update" : "Add Category"}
          </button>

          {/* Cancel */}
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-md border px-5 py-2"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Helper text */}
        <p className="mt-3 text-xs text-muted-foreground">
          Select a parent category to create a sub-category.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>

              <th className="px-4 py-3 text-left">Slug</th>

              <th className="px-4 py-3 text-left">Parent</th>

              <th className="px-4 py-3 text-left">Featured</th>

              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((category) => {
                const parentCategory = categories.find(
                  (item) => item._id === category.parent,
                );

                const isSubCategory = category.parent !== null;

                return (
                  <tr key={category._id} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      <div className={isSubCategory ? "pl-6" : ""}>
                        {isSubCategory && (
                          <span className="mr-2 text-muted-foreground">└─</span>
                        )}

                        {category.name}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {category.slug}
                    </td>

                    <td className="px-4 py-3">
                      {parentCategory?.name ?? (
                        <span className="text-muted-foreground">
                          Main Category
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {category.isFeatured ? "Yes" : "No"}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="rounded-md border px-3 py-1.5 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(category._id)}
                          className="rounded-md border border-destructive px-3 py-1.5 text-sm text-destructive"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
