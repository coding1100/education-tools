'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

export default function ToolHeader({ title, description, icon: Icon, badge }: ToolHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 p-6 glass-card rounded-2xl border border-surface-border relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-0.5 shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <div className="w-full h-full bg-surface-dark rounded-[14px] flex items-center justify-center">
              <Icon className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
              {badge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
