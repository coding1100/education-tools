'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, HelpCircle, CheckCircle2, XCircle, RefreshCw, Award } from 'lucide-react';
import { EducationApi } from '@/lib/api';
import ToolHeader from '@/components/ui/ToolHeader';

export default function AiTutor() {
  const [tab, setTab] = useState<'chat' | 'quiz'>('chat');

  // Chat State
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Hello! I am your 24/7 AI Academic Tutor. What subject or concept would you like to study or clarify today?' },
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Quiz State
  const [topic, setTopic] = useState('');
  const [quizLoading, setQuizLoading] = useState(false);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await EducationApi.tutorChat(userMsg);
      setMessages((prev) => [...prev, { sender: 'bot', text: res.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return;
    setQuizLoading(true);
    setSubmitted(false);
    setUserAnswers({});
    try {
      const res = await EducationApi.generateQuiz(topic, 5);
      setQuiz(res.quiz || []);
    } catch (err) {
      console.error(err);
    } finally {
      setQuizLoading(false);
    }
  };

  const score = quiz.reduce((acc, q, idx) => (userAnswers[idx] === q.correctAnswer ? acc + 1 : acc), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ToolHeader
        title="AI Academic Tutor & Quiz Deck"
        description="Interactive step-by-step tutoring chat assistant and instant quiz/flashcard deck generator for exam preparation."
        icon={Bot}
        badge="Socratic Learning"
      />

      {/* Tab switch */}
      <div className="flex items-center gap-2 p-1.5 glass-card rounded-2xl border border-surface-border w-fit">
        <button
          onClick={() => setTab('chat')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            tab === 'chat' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bot size={16} /> 24/7 AI Tutor Chat
        </button>
        <button
          onClick={() => setTab('quiz')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            tab === 'quiz' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle size={16} /> Practice Quiz Deck
        </button>
      </div>

      {tab === 'chat' ? (
        <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-4 flex flex-col h-[500px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-sm ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-indigo-400" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-lg leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-900/80 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse">
                <Bot size={14} /> AI Tutor thinking...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question about physics, biology, history, calculus..."
              className="flex-1 glass-input p-3 rounded-xl text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={chatLoading || !input.trim()}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition flex items-center justify-center disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-5 border border-surface-border space-y-5">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic for practice quiz (e.g. Organic Chemistry, Macroeconomics)..."
              className="flex-1 glass-input p-3 rounded-xl text-sm"
            />
            <button
              onClick={handleGenerateQuiz}
              disabled={quizLoading || !topic.trim()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {quizLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generate Quiz</span>
            </button>
          </div>

          {quiz.length > 0 && (
            <div className="space-y-6 pt-3 border-t border-slate-800">
              {quiz.map((q, idx) => (
                <div key={q.id || idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h4 className="font-semibold text-white text-sm">
                    {idx + 1}. {q.question}
                  </h4>
                  <div className="space-y-2">
                    {q.options.map((opt: string, optIdx: number) => {
                      const isSelected = userAnswers[idx] === optIdx;
                      const isCorrect = optIdx === q.correctAnswer;
                      let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800';
                      if (submitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200';
                        else if (isSelected && !isCorrect) btnStyle = 'bg-red-500/20 border-red-500 text-red-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-600/40 border-indigo-500 text-white';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={submitted}
                          onClick={() => setUserAnswers({ ...userAnswers, [idx]: optIdx })}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {submitted && isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                          {submitted && isSelected && !isCorrect && <XCircle size={16} className="text-red-400" />}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <div className="p-2.5 rounded bg-slate-950 text-indigo-300 text-xs mt-2 border border-slate-800">
                      <strong>Explanation: </strong>{q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {!submitted ? (
                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-600/30"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center space-y-1">
                  <Award className="w-8 h-8 text-indigo-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Quiz Score: {score} / {quiz.length}</h3>
                  <p className="text-xs text-slate-400">Great effort! Review the explanations above to solidify concepts.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
