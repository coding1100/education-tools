'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Trash2, Calculator, Sparkles } from 'lucide-react';
import ToolHeader from '@/components/ui/ToolHeader';

interface Course {
  id: string;
  name: string;
  grade: number; // 4.0 scale
  credits: number;
}

export default function CgpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Advanced Mathematics', grade: 4.0, credits: 4 },
    { id: '2', name: 'Computer Science 101', grade: 3.7, credits: 3 },
    { id: '3', name: 'Academic Research Writing', grade: 3.3, credits: 3 },
  ]);

  const GRADE_OPTIONS = [
    { label: 'A (4.0)', value: 4.0 },
    { label: 'A- (3.7)', value: 3.7 },
    { label: 'B+ (3.3)', value: 3.3 },
    { label: 'B (3.0)', value: 3.0 },
    { label: 'B- (2.7)', value: 2.7 },
    { label: 'C+ (2.3)', value: 2.3 },
    { label: 'C (2.0)', value: 2.0 },
    { label: 'D (1.0)', value: 1.0 },
    { label: 'F (0.0)', value: 0.0 },
  ];

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: `Course ${courses.length + 1}`,
      grade: 4.0,
      credits: 3,
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const totalCredits = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
  const totalPoints = courses.reduce((acc, c) => acc + (Number(c.grade) * Number(c.credits) || 0), 0);
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ToolHeader
        title="GPA & CGPA Calculator"
        description="Calculate semester GPA and cumulative CGPA with credit hour weighting and target GPA forecasting."
        icon={GraduationCap}
        badge="Credit Hour Weighting"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase">Course List</span>
              <button
                onClick={addCourse}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition flex items-center gap-1"
              >
                <Plus size={14} /> Add Course
              </button>
            </div>

            <div className="space-y-2">
              {courses.map((c) => (
                <div key={c.id} className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCourse(c.id, 'name', e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="col-span-4">
                    <select
                      value={c.grade}
                      onChange={(e) => updateCourse(c.id, 'grade', parseFloat(e.target.value))}
                      className="w-full bg-slate-950 text-xs text-slate-200 p-1.5 rounded border border-slate-800"
                    >
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={c.credits}
                      onChange={(e) => updateCourse(c.id, 'credits', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-950 text-xs text-slate-200 p-1.5 rounded border border-slate-800 text-center"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => removeCourse(c.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="glass-card rounded-2xl p-6 border border-surface-border flex flex-col items-center justify-center text-center space-y-4 sticky top-24">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Calculated GPA</span>
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 p-1 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">{gpa}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Out of 4.0</span>
              </div>
            </div>

            <div className="w-full space-y-2 text-xs border-t border-slate-800 pt-3">
              <div className="flex justify-between text-slate-400">
                <span>Total Credits:</span>
                <span className="font-bold text-white">{totalCredits} hrs</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Honor Points:</span>
                <span className="font-bold text-white">{totalPoints.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
