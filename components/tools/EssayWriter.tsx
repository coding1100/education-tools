'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Copy, RefreshCw, PenTool } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function EssayWriter() {
  const [topic, setTopic] = useState('');
  const [essayType, setEssayType] = useState('Argumentative');
  const [length, setLength] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await EducationApi.generateParagraph(topic, essayType, length);
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
        title="AI Paragraph & Essay Writer"
        description="Draft structured academic paragraphs and essay sections tailored to your specific prompt and academic level."
        icon={PenTool}
        badge="Structured Drafts"
      />

      <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Essay Type / Format</label>
            <select
              value={essayType}
              onChange={(e) => setEssayType(e.target.value)}
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            >
              <option value="Argumentative" className="bg-slate-900">Argumentative Essay</option>
              <option value="Analytical" className="bg-slate-900">Analytical Paper</option>
              <option value="Expository" className="bg-slate-900">Expository Essay</option>
              <option value="Persuasive" className="bg-slate-900">Persuasive Essay</option>
              <option value="Research" className="bg-slate-900">Research Paper Section</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full glass-input p-2.5 rounded-xl text-sm"
            >
              <option value="Short" className="bg-slate-900">Short (150 words)</option>
              <option value="Medium" className="bg-slate-900">Medium (300 words)</option>
              <option value="Detailed" className="bg-slate-900">Detailed (500+ words)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Topic or Prompt</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The economic impact of renewable energy transitions in developing nations..."
            className="w-full glass-input p-3 rounded-xl text-sm"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate Essay Draft</span>
          </button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 border-t border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase">Generated Academic Draft</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.content);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Draft'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 text-sm leading-relaxed whitespace-pre-line">
              {result.content}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
