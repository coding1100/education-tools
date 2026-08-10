'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heading, Sparkles, Check, Copy, RefreshCw } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function TitleGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Academic');
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await EducationApi.generateTitles(topic, tone);
      setTitles(res.titles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ToolHeader
        title="Essay & Research Title Generator"
        description="Generate captivating, scholarly, and publication-ready essay titles and paper topics."
        icon={Heading}
        badge="Publication Quality"
      />

      <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-400 block mb-1">Subject / Main Theme</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Climate change policy in coastal cities..."
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Tone / Style</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            >
              <option value="Academic" className="bg-slate-900">Academic & Formal</option>
              <option value="Catchy" className="bg-slate-900">Catchy & Engaging</option>
              <option value="Analytical" className="bg-slate-900">Analytical</option>
              <option value="Creative" className="bg-slate-900">Creative & Metaphorical</option>
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
            <span>Generate Titles</span>
          </button>
        </div>

        {titles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4 border-t border-slate-800 space-y-3"
          >
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suggested Titles</span>
            <div className="space-y-2">
              {titles.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 hover:border-indigo-500/40 transition"
                >
                  <span className="text-sm font-medium text-slate-100">{t}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(t);
                      setCopiedIdx(idx);
                      setTimeout(() => setCopiedIdx(null), 2000);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition flex-shrink-0"
                  >
                    {copiedIdx === idx ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
