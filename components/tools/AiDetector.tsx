'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Sparkles, Check, Copy, RefreshCw, Upload, AlertCircle } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function AiDetector() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await EducationApi.checkAiDetection(text);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`AI Probability: ${result.aiProbability}%\n${result.summary}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ToolHeader
        title="AI Content Detector & Analysis"
        description="Analyze text for AI-generated patterns with sentence-level breakdown and probability scores."
        icon={ShieldAlert}
        badge="Live AI Engine"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left input column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-2xl p-4 border border-surface-border space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span>Enter or paste academic content (min 20 words)</span>
              <span>{text.trim().split(/\s+/).filter(Boolean).length} Words</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your essay, article, or research paper excerpt here..."
              rows={12}
              className="w-full bg-transparent text-slate-100 text-sm focus:outline-none resize-none placeholder-slate-500"
            />
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => setText('')}
                className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
              >
                <RefreshCw size={12} /> Clear Text
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Detect AI Probability
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right result column */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-2xl p-6 border border-surface-border space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-base">Analysis Results</h3>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>

                {/* Score Gauge */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={result.aiProbability > 50 ? 'text-amber-500' : 'text-emerald-400'}
                        strokeDasharray={`${result.aiProbability}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-white">{result.aiProbability}%</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">AI Score</span>
                    </div>
                  </div>
                  <p className="text-xs text-center text-slate-300 mt-4 font-medium">{result.summary}</p>
                </div>

                {/* Sentence Highlight Breakdown */}
                {result.sentences && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Sentence Breakdown
                    </span>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {result.sentences.map((s: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl text-xs border ${
                            s.isAi
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                          }`}
                        >
                          {s.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass-card rounded-2xl p-8 border border-surface-border flex flex-col items-center justify-center text-center h-full min-h-[300px] text-slate-400">
                <AlertCircle size={40} className="text-slate-600 mb-3" />
                <p className="text-sm font-medium text-slate-300">Ready to Analyze</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Paste your text on the left and click "Detect AI Probability" to see instant sentence-level results.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
