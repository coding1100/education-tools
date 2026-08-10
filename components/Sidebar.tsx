'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
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
  LayoutDashboard,
  Sparkles
} from 'lucide-react';

export const TOOLS_LIST = [
  {
    category: 'Detection & Refinement',
    items: [
      { name: 'AI Detector', href: '/tools/ai-detector', icon: ShieldAlert, badge: 'Popular' },
      { name: 'Plagiarism Checker', href: '/tools/plagiarism-checker', icon: ShieldCheck },
      { name: 'AI Humanizer', href: '/tools/humanizer', icon: Wand2, badge: 'Hot' },
      { name: 'Grammar Checker', href: '/tools/grammar-checker', icon: CheckCheck },
      { name: 'AI Paraphraser', href: '/tools/paraphraser', icon: FileText },
    ],
  },
  {
    category: 'Writing & Generation',
    items: [
      { name: 'AI Summarizer', href: '/tools/summarizer', icon: FileSpreadsheet },
      { name: 'Paragraph & Essay Writer', href: '/tools/essay-writer', icon: Sparkles },
      { name: 'Essay Outline Builder', href: '/tools/essay-outline', icon: ListTree },
      { name: 'Essay Title Generator', href: '/tools/title-generator', icon: Heading },
      { name: 'Thesis Statement Generator', href: '/tools/thesis-generator', icon: Lightbulb },
    ],
  },
  {
    category: 'STEM & Research Tools',
    items: [
      { name: 'Math & STEM Solver', href: '/tools/math-solver', icon: Calculator},
      { name: 'Citation Generator', href: '/tools/citation-generator', icon: BookmarkPlus },
      { name: 'Research Question Gen', href: '/tools/research-question', icon: HelpCircle },
      { name: 'CGPA & Grade Calculator', href: '/tools/cgpa-calculator', icon: GraduationCap },
      { name: 'AI Tutor & Quiz Deck', href: '/tools/ai-tutor', icon: Bot, },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed lg:sticky top-[65px] left-0 z-30 w-64 h-[calc(100vh-65px)] glass-card border-r border-surface-border transition-transform duration-300 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="p-4 space-y-6">
        {/* Main Dashboard Link */}
        <Link
          href="/"
          onClick={onClose}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            pathname === '/'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard Overview</span>
        </Link>

        {/* Tools by Category */}
        {TOOLS_LIST.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {group.category}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={17}
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-300'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
