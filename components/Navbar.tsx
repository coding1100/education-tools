'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Search, Command, Zap, Menu, X, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-surface-border px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left section: Logo & Sidebar toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-surface-border transition"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-surface-dark rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                Education<span className="gradient-text">Suite</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                Academic AI Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Center section: Search bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tools (e.g. AI Detector, Citation, Math Solver)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2 text-sm glass-input rounded-xl focus:outline-none placeholder-slate-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-slate-400 border border-slate-700 rounded px-1.5 py-0.5 bg-slate-900/60">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right section: Actions & Status */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40"
          >
            <Zap size={14} />
            <span>All Tools</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
