"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1120]/80 backdrop-blur-2xl">

      <div className="flex items-center justify-between px-6 py-4">

        {/* SEARCH */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 w-[320px]">

          <Search className="h-4 w-4 text-slate-400" />

          <input
            placeholder="Search dashboard..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">

          <button className="rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10">
            <Bell className="h-5 w-5 text-slate-300" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">

            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500" />

            <div>
              <div className="text-sm font-semibold text-white">
                Saurabh
              </div>

              <div className="text-xs text-slate-400">
                Super Admin
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}