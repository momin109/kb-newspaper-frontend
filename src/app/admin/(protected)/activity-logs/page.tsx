"use client";

import { getActivityLogs } from "@/features/articles/activity/services/activity-admin.service";
import {
  ActivityDevice,
  ActivityLog,
} from "@/features/articles/activity/types/activity.types";
import { useEffect, useMemo, useState } from "react";

// import {
//   getActivityLogs,
// } from '@/features/activity/services/activity-admin.services'

// import type {
//   ActivityDevice,
//   ActivityLog,
// } from '@/features/activity/types/activity.types'

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deviceFilter, setDeviceFilter] = useState<"all" | ActivityDevice>(
    "all",
  );

  async function loadLogs() {
    try {
      setLoading(true);

      const data = await getActivityLogs();

      setLogs(data);
    } catch (error) {
      console.error("Failed to load activity logs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return logs.filter((log) => {
      const matchesSearch =
        !searchValue ||
        log.user?.fullName?.toLowerCase().includes(searchValue) ||
        log.user?.email?.toLowerCase().includes(searchValue) ||
        log.action?.toLowerCase().includes(searchValue) ||
        log.target?.toLowerCase().includes(searchValue) ||
        log.details?.toLowerCase().includes(searchValue) ||
        log.ip?.toLowerCase().includes(searchValue);

      const matchesDevice =
        deviceFilter === "all" || log.device === deviceFilter;

      return matchesSearch && matchesDevice;
    });
  }, [logs, search, deviceFilter]);

  function formatDate(date: string) {
    return new Date(date).toLocaleString("bn-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function getDeviceLabel(device: ActivityDevice) {
    switch (device) {
      case "mobile":
        return "Mobile";

      case "tablet":
        return "Tablet";

      default:
        return "Desktop";
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Activity Logs</h1>

        <p className="text-sm text-muted-foreground">
          Monitor admin activity across the system
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search user, action, target, IP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border bg-background px-3 py-2 outline-none"
        />

        <select
          value={deviceFilter}
          onChange={(e) =>
            setDeviceFilter(e.target.value as "all" | ActivityDevice)
          }
          className="rounded-md border bg-background px-3 py-2"
        >
          <option value="all">All Devices</option>

          <option value="desktop">Desktop</option>

          <option value="mobile">Mobile</option>

          <option value="tablet">Tablet</option>
        </select>
      </div>

      {/* Result Count */}
      {!loading && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {logs.length} activities
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">User</th>

                <th className="px-4 py-3 text-left">Action</th>

                <th className="px-4 py-3 text-left">Target</th>

                <th className="px-4 py-3 text-left">Details</th>

                <th className="px-4 py-3 text-left">Device</th>

                <th className="px-4 py-3 text-left">IP</th>

                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    Loading activity logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No activity logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="border-t">
                    {/* User */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">
                          {log.user?.fullName ?? "System"}
                        </p>

                        {log.user?.email && (
                          <p className="text-xs text-muted-foreground">
                            {log.user.email}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                        {log.action}
                      </span>
                    </td>

                    {/* Target */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{log.target || "-"}</p>

                        {log.targetId && (
                          <p className="max-w-[160px] truncate text-xs text-muted-foreground">
                            {log.targetId}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Details */}
                    <td className="max-w-[260px] px-4 py-3">
                      <span className="line-clamp-2 text-sm text-muted-foreground">
                        {log.details || "-"}
                      </span>
                    </td>

                    {/* Device */}
                    <td className="px-4 py-3">{getDeviceLabel(log.device)}</td>

                    {/* IP */}
                    <td className="px-4 py-3 font-mono text-xs">
                      {log.ip || "-"}
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
