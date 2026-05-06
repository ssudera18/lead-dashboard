"use client";

import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  ShieldAlert,
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
  return (
    <aside className="hidden lg:flex w-[260px] flex-col border-r border-white/10 bg-white/5 backdrop-blur-2xl">

      {/* LOGO */}
      <div className="border-b border-white/10 p-6">
        <h1 className="text-2xl font-bold text-white">
          LeadIntel
        </h1>

        <p className="text-sm text-slate-400">
          Analytics Platform
        </p>
      </div>

      {/* MENU */}
      <div className="flex-1 p-4 space-y-2">

        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <button
              key={i}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <Icon className="h-5 w-5" />

              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* USER */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl bg-white/5 p-4">
          <div className="text-sm text-slate-400">
            Logged in as
          </div>

          <div className="mt-1 font-semibold text-white">
            Admin User
          </div>
        </div>
      </div>

    </aside>
  );
}