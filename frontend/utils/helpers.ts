// ============================================================
// UTILS: Formatting helpers
// ============================================================

// Format currency (INR)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date to readable string
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

// Format month/year to readable string
export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(date);
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Status badge color mapping
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    inactive: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    terminated: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    present: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    absent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "half-day": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    leave: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    holiday: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    processed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

// Truncate text
export function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
}
