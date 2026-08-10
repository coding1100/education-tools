'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Check, Copy, RefreshCw, Sliders } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function Paraphraser() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('Standard');
  const [synonymLevel, setSynonymLevel] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const MODES = ['Standard', 'Fluency', 'Formal', 'Creative', 'Academic', 'Shorten', 'Expand'];

  const handleParaphrase = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await EducationApi.paraphrase(text, mode, synonymLevel);
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
        title="AI Paraphrasing & Rewriting Tool"
        description="Rephrase sentences and paragraphs into distinct academic tones with customizable synonym replacement levels."
        icon={FileText}
        badge="7 Custom Modes"
      />

      <div className="glass-card rounded-2xl p-4 border border-surface-border space-y-4">
        {/* Mode selection toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                  mode === m
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Sliders size={12} /> Synonyms:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={synonymLevel}
              onChange={(e) => setSynonymLevel(Number(e.target.value))}
              className="w-24 accent-indigo-500 cursor-pointer"
            />
            <span className="text-white font-mono">{synonymLevel}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter original text to rephrase..."
            rows={10}
            className="w-full bg-slate-950/40 p-4 rounded-xl text-slate-100 text-sm focus:outline-none resize-none border border-slate-800"
          />

          <div className="w-full bg-slate-950/40 p-4 rounded-xl text-slate-100 text-sm border border-slate-800 flex flex-col justify-between">
            {result ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold border-b border-slate-800 pb-2">
                  <span>Rephrased ({result.mode} Mode)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result.paraphrasedText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 text-slate-300 hover:text-white"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="leading-relaxed text-slate-200">{result.paraphrasedText}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Paraphrased version will appear here
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleParaphrase}
            disabled={loading || !text.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Paraphrase Text</span>
          </button>
        </div>
      </div>
    </div>
  );
}
