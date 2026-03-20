"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Share2, Download, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockLectureResult } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ResultsPage() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const flashcards = mockLectureResult.flashcards;

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
          <button className="p-2.5 rounded-xl glass border-white/10 text-zinc-400 hover:text-white transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl glass border-white/10 text-zinc-400 hover:text-white transition-all">
            <Download className="w-5 h-5" />
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
            <Save className="w-4 h-4" /> Save Report
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <section className="space-y-6">
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
      </section>

      {/* Flashcards Section */}
      <section className="space-y-6 pb-20">
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
      </section>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
