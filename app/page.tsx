'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Wand2,
  CheckCheck,
  FileText,
  FileSpreadsheet,
  ListTree,
  Heading,
  Lightbulb,
  Calculator,
  BookmarkPlus,
  HelpCircle,
  GraduationCap,
  Bot,
  Zap,
  Search
} from 'lucide-react';
import { TOOLS_LIST } from '@/components/Sidebar';

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const allTools = TOOLS_LIST.flatMap((group) =>
    group.items.map((item) => ({ ...item, category: group.category }))
  );

  const filteredTools = allTools.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category.includes(activeCategory);
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden glass-card rounded-3xl p-8 border border-surface-border text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles size={14} className="text-indigo-400 animate-spin" /> Next-Generation Academic Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Comprehensive <span className="gradient-text">Academic AI Suite</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Access 14+ specialized educational tools engineered for researchers, students, and writers.
            Integrated directly with high-performance real-time academic backends.
          </p>
        </div>

        <div className="flex flex-col gap-2 relative z-10 w-full sm:w-auto flex-shrink-0">
          <Link
            href="/tools/ai-detector"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-2xl shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 group"
          >
            <span>Launch AI Detector</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/tools/humanizer"
            className="px-6 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-sm font-semibold rounded-2xl border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <span>Try AI Humanizer</span>
          </Link>
        </div>
      </motion.div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['All', 'Detection', 'Writing', 'STEM'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat} Tools
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs glass-input rounded-xl"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
            >
              <Link
                href={tool.href}
                className="group glass-card glass-card-hover rounded-2xl p-5 border border-surface-border flex flex-col justify-between h-full space-y-4 block"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800 p-0.5 flex items-center justify-center group-hover:border-indigo-500/50 transition duration-300">
                    <Icon className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Production-grade tool powered by real-time academic intelligence algorithms.
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 pt-2 border-t border-slate-800/80">
                  <span>Open Tool</span>
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
