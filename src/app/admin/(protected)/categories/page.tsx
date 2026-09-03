"use client";

import { useEffect, useState } from "react";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setSaving(true);

      if (editingId) {
        const updated = await updateCategory(editingId, name.trim());

        setCategories((prev) =>
          prev.map((category) =>
            category._id === editingId ? updated : category,
          ),
        );
      } else {
        const created = await createCategory(name.trim());

        setCategories((prev) => [created, ...prev]);
      }

      setName("");
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
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
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
          Manage your news categories
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg border bg-background p-5">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "Edit Category" : "Add Category"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="flex-1 rounded-md border px-3 py-2 outline-none"
          />

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update" : "Add Category"}
          </button>

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
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center">
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{category.name}</td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {category.slug}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
