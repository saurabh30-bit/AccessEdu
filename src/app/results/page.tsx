"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Share2, Download, RotateCcw, ChevronLeft, ChevronRight, LayoutList, BookOpen, BrainCircuit, GraduationCap, CheckCircle2 } from 'lucide-react';
import { mockLectureResult } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'quiz' | 'mindmap'>('summary');
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (platform: string) => {
    setIsExporting(platform);
    setTimeout(() => setIsExporting(null), 2000);
  };


  const flashcards = mockLectureResult.flashcards;
  const quiz = mockLectureResult.quiz || [];
  const mindMap = mockLectureResult.mindMap || [];

  const tabs = [
    { id: 'summary', label: 'Summary', icon: LayoutList },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { id: 'quiz', label: 'Quiz', icon: GraduationCap },
    { id: 'mindmap', label: 'Mind Map', icon: BrainCircuit },
  ];


  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/live" className="text-sm text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1 mb-2">
            <ChevronLeft className="w-4 h-4" /> Back to Session
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">{mockLectureResult.title}</h1>
          <p className="text-zinc-400">Processed on {mockLectureResult.date}</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => handleExport('Anki')}
            className={cn(
              "px-4 py-2.5 rounded-xl glass border-white/10 text-xs font-bold transition-all flex items-center gap-2",
              isExporting === 'Anki' ? "text-green-400 border-green-500/20" : "text-zinc-400 hover:text-white"
            )}
          >
            {isExporting === 'Anki' ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {isExporting === 'Anki' ? "Sent to Anki" : "Export to Anki"}
          </button>
          <button 
            onClick={() => handleExport('Notion')}
            className={cn(
              "px-4 py-2.5 rounded-xl glass border-white/10 text-xs font-bold transition-all flex items-center gap-2",
              isExporting === 'Notion' ? "text-green-400 border-green-500/20" : "text-zinc-400 hover:text-white"
            )}
          >
            {isExporting === 'Notion' ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {isExporting === 'Notion' ? "Saved to Notion" : "Send to Notion"}
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
            <Save className="w-4 h-4" /> Save Report
          </button>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 glass rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all",
              activeTab === tab.id 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'summary' && (
          <motion.section 
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
              Executive Summary
            </h2>
            <div className="glass-card p-8 space-y-4">
              {mockLectureResult.summary.map((point, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">
                    {idx + 1}
                  </span>
                  <p className="text-zinc-300 leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'flashcards' && (
          <motion.section 
            key="flashcards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 pb-20"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <div className="w-1.5 h-8 bg-purple-500 rounded-full" />
                AI Flashcards
              </h2>
              <div className="text-sm text-zinc-500 font-medium">
                Card {currentCard + 1} of {flashcards.length}
              </div>
            </div>

            <div className="relative flex flex-col items-center gap-8">
              <div className="w-full max-w-md perspective-1000">
                <motion.div
                  className="relative w-full h-64 cursor-pointer preserve-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden glass-card flex flex-col items-center justify-center p-8 text-center border-indigo-500/20 shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">Term</span>
                    <h3 className="text-3xl font-bold">{flashcards[currentCard].term}</h3>
                    <div className="mt-8 flex items-center gap-2 text-zinc-500 text-sm">
                      <RotateCcw className="w-4 h-4" /> Click to flip
                    </div>
                  </div>

                  {/* Back */}
                  <div 
                    className="absolute inset-0 backface-hidden glass-card flex flex-col items-center justify-center p-8 text-center rotate-y-180 border-purple-500/20 shadow-[0_0_40px_-10px_rgba(168,85,247,0.2)]"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">Definition</span>
                    <p className="text-xl text-zinc-200 leading-relaxed">
                      {flashcards[currentCard].definition}
                    </p>
                    <div className="mt-8 flex items-center gap-2 text-zinc-500 text-sm">
                      <RotateCcw className="w-4 h-4" /> Click to flip
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center gap-6">
                <button 
                  disabled={currentCard === 0}
                  onClick={() => {
                    setCurrentCard(prev => prev - 1);
                    setIsFlipped(false);
                  }}
                  className="p-3 rounded-full glass border-white/10 text-zinc-400 hover:text-white transition-all disabled:opacity-20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  disabled={currentCard === flashcards.length - 1}
                  onClick={() => {
                    setCurrentCard(prev => prev + 1);
                    setIsFlipped(false);
                  }}
                  className="p-3 rounded-full glass border-white/10 text-zinc-400 hover:text-white transition-all disabled:opacity-20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'quiz' && (
          <motion.section 
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <div className="w-1.5 h-8 bg-pink-500 rounded-full" />
                Retention Quiz
              </h2>
              <div className="text-sm text-zinc-500 font-medium">
                Question {quizIndex + 1} of {quiz.length}
              </div>
            </div>

            <div className="glass-card p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold leading-relaxed">{quiz[quizIndex].question}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {quiz[quizIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (selectedOption === null) {
                          setSelectedOption(idx);
                          setShowExplanation(true);
                        }
                      }}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all",
                        selectedOption === null 
                          ? "bg-white/5 border-white/10 hover:bg-white/10" 
                          : idx === quiz[quizIndex].correctAnswer
                            ? "bg-green-500/10 border-green-500/50 text-green-400"
                            : selectedOption === idx
                              ? "bg-red-500/10 border-red-500/50 text-red-400"
                              : "bg-white/5 border-white/10 opacity-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedOption !== null && idx === quiz[quizIndex].correctAnswer && (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <ChevronRight className="w-3 h-3 text-black fill-current" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2"
                >
                  <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Explanation</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">{quiz[quizIndex].explanation}</p>
                  <button 
                    onClick={() => {
                      if (quizIndex < quiz.length - 1) {
                        setQuizIndex(prev => prev + 1);
                        setSelectedOption(null);
                        setShowExplanation(false);
                      }
                    }}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all"
                  >
                    {quizIndex < quiz.length - 1 ? "Next Question" : "Quiz Complete"}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {activeTab === 'mindmap' && (
          <motion.section 
            key="mindmap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
              Visual Mind Map
            </h2>
            <div className="glass-card p-12 h-[500px] relative overflow-hidden flex items-center justify-center">
              {/* Simple Mock Mind Map with SVG lines */}
              <div className="relative w-full h-full flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="50%" y1="50%" x2="30%" y2="30%" stroke="rgba(99,102,241,0.3)" strokeWidth="2" />
                  <line x1="50%" y1="50%" x2="70%" y2="30%" stroke="rgba(99,102,241,0.3)" strokeWidth="2" />
                  <line x1="30%" y1="30%" x2="20%" y2="15%" stroke="rgba(99,102,241,0.3)" strokeWidth="2" />
                  <line x1="70%" y1="30%" x2="80%" y2="15%" stroke="rgba(99,102,241,0.3)" strokeWidth="2" />
                </svg>

                <div className="relative z-10 flex flex-col items-center gap-12">
                  <div className="p-6 rounded-2xl bg-indigo-600 text-white font-bold shadow-2xl shadow-indigo-500/40 border border-indigo-400">
                    {mockLectureResult.title}
                  </div>
                  <div className="flex gap-32">
                    <div className="flex flex-col items-center gap-12">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-indigo-400 font-bold">
                        Superposition
                      </div>
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-zinc-400 text-xs">
                        Simultaneous States
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-12">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-indigo-400 font-bold">
                        Entanglement
                      </div>
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-zinc-400 text-xs">
                        Particle Connection
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 right-6 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-600">
                <BrainCircuit className="w-3 h-3" /> Interactive Visualization
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
