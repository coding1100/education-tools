'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Sparkles, Check, Copy, RefreshCw, List, AlignLeft, Target } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function Summarizer() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('Bullets');
  const [length, setLength] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await EducationApi.summarize(text, mode, length);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ToolHeader
        title="AI Summarizer & Insight Extractor"
        description="Condense lengthy papers, articles, and research chapters into concise bullet points, executive summaries, or key takeaways."
        icon={FileSpreadsheet}
        badge="Key Takeaway Extraction"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Format & Controls</span>
            <div className="flex items-center gap-2">
              {['Bullets', 'Paragraph', 'Executive'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                    mode === m ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your research article, chapter, or essay text..."
            rows={12}
            className="w-full bg-transparent text-slate-100 text-sm focus:outline-none resize-none placeholder-slate-500"
          />

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">Length: {length}</span>
            <button
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate Summary</span>
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target size={14} /> Summarized Insights
            </span>
            {result && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.summary);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-100 text-sm leading-relaxed whitespace-pre-line">
                {result.summary}
              </div>

              {result.keyTakeaways && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Core Takeaways</span>
                  <div className="space-y-1.5">
                    {result.keyTakeaways.map((t: string, i: number) => (
                      <div key={i} className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-center text-slate-400">
              <FileSpreadsheet size={36} className="text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-300">Summary Preview</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Your key takeaways and condensed text will render here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
