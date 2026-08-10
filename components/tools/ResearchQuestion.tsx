'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Sparkles, Check, Copy, RefreshCw } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function ResearchQuestion() {
  const [topic, setTopic] = useState('');
  const [field, setField] = useState('Computer Science');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await EducationApi.generateResearchQuestions(topic, field);
      setQuestions(res.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ToolHeader
        title="Academic Research Question Generator"
        description="Formulate precise, narrow, and high-impact research questions categorized by descriptive, comparative, and causal scope."
        icon={HelpCircle}
        badge="Methodology Aligned"
      />

      <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-400 block mb-1">Research Field / Subject Area</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Machine Learning algorithms in financial fraud detection"
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Academic Discipline</label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            >
              <option value="Computer Science" className="bg-slate-900">Computer Science</option>
              <option value="Medicine & Health" className="bg-slate-900">Medicine & Health</option>
              <option value="Social Sciences" className="bg-slate-900">Social Sciences</option>
              <option value="Business & Finance" className="bg-slate-900">Business & Finance</option>
              <option value="Humanities" className="bg-slate-900">Humanities</option>
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
            <span>Generate Research Questions</span>
          </button>
        </div>

        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4 border-t border-slate-800 space-y-3"
          >
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Formulated Questions</span>
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 hover:border-indigo-500/40 transition"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 mb-1 inline-block">
                      {q.category}
                    </span>
                    <p className="text-sm text-slate-100 font-medium">{q.question}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(q.question);
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
