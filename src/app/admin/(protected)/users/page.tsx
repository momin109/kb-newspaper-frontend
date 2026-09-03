"use client";

import { useEffect, useMemo, useState } from "react";

import type { User, UserRole } from "@/features/users/types/user.types";

import {
  banUser,
  deleteUser,
  getAdminUsers,
  unbanUser,
  updateUserRole,
} from "@/features/users/services/user-admin.service";

const ROLES: UserRole[] = ["admin", "editor", "journalist", "subscriber"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");

  async function loadUsers() {
    try {
      setLoading(true);

      const data = await getAdminUsers();

      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.fullName.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  async function handleRoleChange(id: string, role: UserRole) {
    try {
      setActionId(id);

      const updatedUser = await updateUserRole(id, role);

      setUsers((prev) =>
        prev.map((user) => (user._id === id ? updatedUser : user)),
      );
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setActionId(null);
    }
  }

  async function handleBan(id: string) {
    const reason = window.prompt("Ban reason:", "Violation of policy");

    if (reason === null) return;

    try {
      setActionId(id);

      const updatedUser = await banUser(
        id,
        reason.trim() || "Violation of policy",
      );

      setUsers((prev) =>
        prev.map((user) => (user._id === id ? updatedUser : user)),
      );
    } catch (error) {
      console.error("Failed to ban user:", error);
    } finally {
      setActionId(null);
    }
  }

  async function handleUnban(id: string) {
    try {
      setActionId(id);

      const updatedUser = await unbanUser(id);

      setUsers((prev) =>
        prev.map((user) => (user._id === id ? updatedUser : user)),
      );
    } catch (error) {
      console.error("Failed to unban user:", error);
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "আপনি কি এই user টি permanently delete করতে চান?",
    );

    if (!confirmed) return;

    try {
      setActionId(id);

      await deleteUser(id);

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Users</h1>

        <p className="text-sm text-muted-foreground">
          Manage registered users and their access
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2 outline-none"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
          className="rounded-md border px-3 py-2"
        >
          <option value="all">All Roles</option>

          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      {!loading && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">User</th>

                <th className="px-4 py-3 text-left">Phone</th>

                <th className="px-4 py-3 text-left">Role</th>

                <th className="px-4 py-3 text-left">Status</th>

                <th className="px-4 py-3 text-left">Verified</th>

                <th className="px-4 py-3 text-left">Joined</th>

                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isActionLoading = actionId === user._id;

                  return (
                    <tr key={user._id} className="border-t">
                      {/* User */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{user.fullName}</p>

                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3">{user.phone}</td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          disabled={isActionLoading}
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              e.target.value as UserRole,
                            )
                          }
                          className="rounded-md border px-2 py-1.5 text-sm"
                        >
                          {ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {user.isBanned ? (
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                            Banned
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Verified */}
                      <td className="px-4 py-3">
                        {user.isVerified ? "Yes" : "No"}
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("bn-BD")}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {user.isBanned ? (
                            <button
                              disabled={isActionLoading}
                              onClick={() => handleUnban(user._id)}
                              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              disabled={isActionLoading}
                              onClick={() => handleBan(user._id)}
                              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                            >
                              Ban
                            </button>
                          )}

                          <button
                            disabled={isActionLoading}
                            onClick={() => handleDelete(user._id)}
                            className="rounded-md border border-destructive px-3 py-1.5 text-sm text-destructive disabled:opacity-50"
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
    </div>
  );
}
