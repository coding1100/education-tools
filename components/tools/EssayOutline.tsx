'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ListTree, Sparkles, Check, Copy, RefreshCw } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function EssayOutline() {
  const [topic, setTopic] = useState('');
  const [essayType, setEssayType] = useState('Analytical');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await EducationApi.generateOutline(topic, essayType);
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
        title="Essay Outline Builder"
        description="Generate structured, multi-level academic essay outlines with thesis statements, main claims, and supporting points."
        icon={ListTree}
        badge="Structured Framework"
      />

      <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-400 block mb-1">Essay Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Ethical implications of Artificial Intelligence in healthcare..."
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Paper Type</label>
            <select
              value={essayType}
              onChange={(e) => setEssayType(e.target.value)}
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            >
              <option value="Analytical" className="bg-slate-900">Analytical</option>
              <option value="Argumentative" className="bg-slate-900">Argumentative</option>
              <option value="Research" className="bg-slate-900">Research Paper</option>
              <option value="Compare & Contrast" className="bg-slate-900">Compare & Contrast</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Build Essay Outline</span>
          </button>
        </div>

        {result?.outline && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 border-t border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{result.outline.title}</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(result.outline, null, 2));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied Outline' : 'Copy Outline'}</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
              <span className="font-bold text-indigo-300">Thesis Statement: </span>
              {result.outline.thesis}
            </div>

            <div className="space-y-3">
              {result.outline.sections.map((sec: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-white text-sm">{sec.header}</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                    {sec.points.map((p: string, pIdx: number) => (
                      <li key={pIdx}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
