'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, Check, Copy, RefreshCw } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function ThesisGenerator() {
  const [topic, setTopic] = useState('');
  const [claim, setClaim] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [theses, setTheses] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim() || !claim.trim()) return;
    setLoading(true);
    try {
      const res = await EducationApi.generateThesis(topic, claim, reason);
      setTheses(res.thesisStatements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ToolHeader
        title="Thesis Statement Generator"
        description="Craft strong, defensible, and compelling academic thesis statements based on your main claim and supporting evidence."
        icon={Lightbulb}
        badge="Argumentation Engine"
      />

      <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Topic or Subject</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Social media consumption among teenagers"
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Main Claim / Position</label>
            <input
              type="text"
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              placeholder="e.g. negatively affects sleep quality and academic performance"
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Primary Reason / Evidence</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. continuous blue light exposure and delayed circadian rhythms"
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim() || !claim.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate Thesis Options</span>
          </button>
        </div>

        {theses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4 border-t border-slate-800 space-y-3"
          >
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Generated Thesis Statements</span>
            <div className="space-y-3">
              {theses.map((t, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 hover:border-indigo-500/40 transition"
                >
                  <p className="text-sm text-slate-100 font-medium leading-relaxed">{t}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(t);
                      setCopiedIdx(idx);
                      setTimeout(() => setCopiedIdx(null), 2000);
                    }}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition flex-shrink-0"
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
