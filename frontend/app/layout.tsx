// ============================================================
// ROOT LAYOUT — Next.js App Router root layout
// ============================================================

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayrollPro — Payroll Management System",
  description: "Modern payroll management system with MVVM architecture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
