'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookmarkPlus, Sparkles, Check, Copy, RefreshCw } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function CitationGenerator() {
  const [style, setStyle] = useState('APA');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('2024');
  const [publisher, setPublisher] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const STYLES = ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE'];

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await EducationApi.generateCitation(style, { author, title, year, publisher, url });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ToolHeader
        title="Citation & Bibliography Generator"
        description="Format perfect academic citations in APA 7, MLA 9, Chicago, Harvard, and IEEE styles."
        icon={BookmarkPlus}
        badge="Multi-Style Support"
      />

      <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4">
        {/* Style switch */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-400 mr-2">Citation Style:</span>
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                style === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Author(s)</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Smith, John A."
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Work / Article Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cognitive Foundations of Artificial Intelligence"
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Year of Publication</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Publisher / Journal</label>
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="Academic Press"
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading || !title.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate Citation</span>
          </button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 border-t border-slate-800 space-y-4"
          >
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{result.style} Full Reference</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.formattedCitation);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy Citation'}</span>
                </button>
              </div>
              <p className="text-sm font-serif italic text-slate-100 bg-slate-950 p-3 rounded-lg border border-slate-800">
                {result.formattedCitation}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-center justify-between">
              <span>In-Text Parenthetical Citation: <strong className="text-white">{result.inTextCitation}</strong></span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
