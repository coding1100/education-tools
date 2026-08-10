'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCheck, Sparkles, Check, Copy, RefreshCw, AlertTriangle } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function GrammarChecker() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await EducationApi.checkGrammar(text);
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
        title="AI Grammar, Spelling & Style Checker"
        description="Enhance text clarity, correct typos, fix grammatical errors, and polish academic style instantly."
        icon={CheckCheck}
        badge="Real-time Proofreading"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your essay or research document to check spelling and grammar errors..."
              rows={12}
              className="w-full bg-transparent text-slate-100 text-sm focus:outline-none resize-none placeholder-slate-500"
            />
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                {text.trim().split(/\s+/).filter(Boolean).length} Words
              </span>
              <button
                onClick={handleCheck}
                disabled={loading || !text.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                <span>Check Proofreading</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          {result ? (
            <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-sm font-semibold text-white">Grammar Score: {result.score}/100</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.correctedText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition flex items-center gap-1"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied Corrected' : 'Copy All'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Suggested Fixes</h4>
                {result.issues?.map((issue: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-red-400 line-through">{issue.original}</span>
                      <span className="text-xs font-semibold text-emerald-400">→ {issue.suggestion}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{issue.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 border border-surface-border flex flex-col items-center justify-center text-center h-full min-h-[300px] text-slate-400">
              <CheckCheck size={40} className="text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-300">Proofreading Ready</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Submit text to highlight typos, subject-verb agreement errors, and vocabulary enhancements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
