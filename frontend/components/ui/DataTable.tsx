// ============================================================
// COMPONENT: DataTable — Reusable data table
// UI Layer (MVVM - View/Component)
// ============================================================

"use client";

import React from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data found",
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`
                  border-b border-gray-100 dark:border-gray-700
                  hover:bg-gray-50 dark:hover:bg-gray-800/50
                  ${onRowClick ? "cursor-pointer" : ""}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-gray-700 dark:text-gray-300 ${col.className || ""}`}
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
