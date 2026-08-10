'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, Check, Copy, RefreshCw, Sliders, ArrowRight } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function Humanizer() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('Academic');
  const [tone, setTone] = useState('Natural');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleHumanize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await EducationApi.humanizeText(text, mode, tone);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.humanizedText) return;
    navigator.clipboard.writeText(result.humanizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ToolHeader
        title="AI Text Humanizer & Bypass Engine"
        description="Convert AI-generated draft text into natural, academic human phrasing that bypasses AI detectors seamlessly."
        icon={Wand2}
        badge="Zero AI Footprint"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Column */}
        <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Input AI Draft</span>
            <div className="flex items-center gap-2">
              {['Standard', 'Academic', 'Creative', 'Casual'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                    mode === m
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
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
            placeholder="Paste your AI generated draft (ChatGPT, Claude, Gemini)..."
            rows={12}
            className="w-full bg-transparent text-slate-100 text-sm focus:outline-none resize-none placeholder-slate-500"
          />

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => setText('')}
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <RefreshCw size={12} /> Reset
            </button>
            <button
              onClick={handleHumanize}
              disabled={loading || !text.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-violet-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Humanizing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Humanize Text
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> Humanized Output
              </span>
              {result && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-sm text-slate-100 whitespace-pre-line leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 min-h-[220px]">
                    {result.humanizedText}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <span className="text-xs text-emerald-400 font-medium block">Bypassed AI Score</span>
                      <span className="text-xl font-bold text-white mt-1 block">{result.bypassedAiScore}% AI</span>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                      <span className="text-xs text-indigo-300 font-medium block">Readability Grade</span>
                      <span className="text-xl font-bold text-white mt-1 block">{result.readabilityScore}/100</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-center text-slate-400">
                  <Wand2 size={36} className="text-slate-600 mb-3 animate-bounce" />
                  <p className="text-sm font-medium text-slate-300">Humanization Ready</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Your transformed, human-phrased content will appear here with readability metrics.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
