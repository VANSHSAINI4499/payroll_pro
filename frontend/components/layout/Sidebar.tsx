// ============================================================
// COMPONENT: Sidebar — Dashboard navigation sidebar
// UI Layer (MVVM - View/Component)
// ============================================================

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiHome,
  HiUserGroup,
  HiCalendar,
  HiCurrencyDollar,
  HiDocumentText,
  HiLogout,
} from "react-icons/hi";
import { useAuthViewModel } from "@/viewmodels/useAuthViewModel";
import { APP_NAME } from "@/config/constants";

const navItems = [
  { href: "/", label: "Dashboard", icon: HiHome },
  { href: "/employees", label: "Employees", icon: HiUserGroup },
  { href: "/attendance", label: "Attendance", icon: HiCalendar },
  { href: "/payroll", label: "Payroll", icon: HiCurrencyDollar },
  { href: "/payslips", label: "Payslips", icon: HiDocumentText },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuthViewModel();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <HiCurrencyDollar className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {APP_NAME}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <HiLogout className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
