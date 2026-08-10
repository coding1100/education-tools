'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Sparkles, Check, Copy, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function MathSolver() {
  const [query, setQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSolve = async () => {
    if (!query.trim() && !imagePreview) return;
    setLoading(true);
    try {
      const res = await EducationApi.solveMath(query, imagePreview || undefined);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ToolHeader
        title="Math & STEM Problem Solver"
        description="Solve algebra, calculus, physics, and chemistry equations with step-by-step solutions and OCR image support."
        icon={Calculator}
        badge="LaTeX & OCR Support"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Enter Mathematical Equation or Question</label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Solve 2x^2 + 5x - 12 = 0 or calculate the derivative of f(x) = sin(x)*e^x..."
                rows={6}
                className="w-full glass-input p-3 rounded-xl text-sm font-mono"
              />
            </div>

            {/* OCR Image Upload Box */}
            <div className="border-2 border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-900/30 hover:border-indigo-500/40 transition">
              {imagePreview ? (
                <div className="relative w-full max-h-40 overflow-hidden rounded-lg">
                  <img src={imagePreview} alt="Problem scan" className="object-cover w-full h-full" />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-slate-900/80 text-xs text-red-400 px-2 py-1 rounded"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-1.5 text-slate-400">
                  <ImageIcon size={24} className="text-indigo-400" />
                  <span className="text-xs font-medium text-slate-300">Upload Photo / Scan of Math Problem</span>
                  <span className="text-[10px] text-slate-500">PNG, JPG up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            <button
              onClick={handleSolve}
              disabled={loading || (!query.trim() && !imagePreview)}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Solve Step-by-Step</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-5 border border-surface-border space-y-4"
            >
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                <span className="text-xs font-semibold text-indigo-300 uppercase block">Final Answer</span>
                <span className="text-xl font-bold text-white mt-1 block font-mono">{result.finalAnswer}</span>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step-by-Step Derivation</span>
                {result.steps?.map((s: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">
                        {s.step}
                      </span>
                      <span>Step {s.step}</span>
                    </div>
                    <p className="text-xs text-slate-300">{s.explanation}</p>
                    {s.formula && (
                      <div className="p-2 rounded bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto">
                        {s.formula}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-8 border border-surface-border flex flex-col items-center justify-center text-center h-full min-h-[320px] text-slate-400">
              <Calculator size={40} className="text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-300">STEM Solver Ready</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Type an equation or upload an image to receive detailed step-by-step analytical solutions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
