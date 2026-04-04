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
          fixed top-0 left-0 z-50 h-full w-64
          bg-white/90 dark:bg-[#0d0d24]/95 backdrop-blur-2xl
          border-r border-gray-200/60 dark:border-white/5
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200/60 dark:border-white/5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <HiCurrencyDollar className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-violet-600 dark:from-primary-400 dark:to-violet-400 bg-clip-text text-transparent">
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
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500/10 to-violet-500/10 text-primary-700 dark:text-primary-300 shadow-sm border border-primary-200/50 dark:border-primary-500/20"
                      : "text-gray-600 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-white/5 hover:translate-x-1"
                  }
                `}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? "text-primary-600 dark:text-primary-400" : "group-hover:scale-110"}`} />
                {item.label}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-200/60 dark:border-white/5">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-all duration-300 hover:translate-x-1"
          >
            <HiLogout className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
