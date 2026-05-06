"use client";

import { useState } from "react";

import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const items = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    icon: BarChart3,
  },
  {
    name: "Leads",
    icon: Users,
  },
  {
    name: "Fraud Detection",
    icon: ShieldAlert,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {

  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-white/10 bg-white/5 backdrop-blur-2xl transition-all duration-300 ${
        collapsed ? "w-[90px]" : "w-[260px]"
      }`}
    >

      {/* TOP */}
      <div className="flex items-center justify-between border-b border-white/10 p-6">

        {!collapsed && (
          <div>
            <h1 className="text-2xl font-bold text-white">
              SmartLeads
            </h1>

            <p className="text-sm text-slate-400">
              Analytics Platform
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-white" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-white" />
          )}
        </button>

      </div>

      {/* MENU */}
      <div className="flex-1 p-4 space-y-2">

        {items.map((item, i) => {

          const Icon = item.icon;

          return (
            <button
              key={i}
              className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >

              <Icon className="h-5 w-5 min-w-[20px]" />

              {!collapsed && (
                <span className="whitespace-nowrap">
                  {item.name}
                </span>
              )}

            </button>
          );
        })}
      </div>

      {/* USER */}
      <div className="border-t border-white/10 p-4">

        <div className="rounded-2xl bg-white/5 p-4">

          {!collapsed ? (
            <>
              <div className="text-sm text-slate-400">
                Logged in as
              </div>

              <div className="mt-1 font-semibold text-white">
                Admin User
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500" />
            </div>
          )}

        </div>
      </div>

    </aside>
  );
}