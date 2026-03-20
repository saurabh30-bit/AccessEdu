"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Loader2, BookOpen, Sparkles, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { AITutorSidebar } from '@/components/ai-tutor/AITutorSidebar';
import { useSettings } from '@/context/SettingsContext';
import { MessageCircle, Highlighter, StickyNote } from 'lucide-react';

const mockTranscriptData = [
  "Welcome everyone to today's session on Quantum Computing.",
  "We'll be exploring how qubits differ from classical bits.",
  "The principle of superposition is what allows qubits to be in multiple states.",
  "Imagine a coin spinning on a table - it's both heads and tails until it lands.",
  "This is essentially what superposition looks like at the subatomic level.",
  "Next, we have entanglement, which Einstein called 'spooky action at a distance'.",
  "When two qubits are entangled, the state of one instantly determines the other.",
  "This happens regardless of how far apart they are in the universe.",
  "Quantum supremacy is the milestone where these systems outperform classical ones.",
  "Google and IBM are currently leading the race in this field.",
  "However, error correction remains one of our biggest challenges today."
];

export default function LiveLecturePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const mode = searchParams.get('mode') || 'live';
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [currentSummary, setCurrentSummary] = useState("Waiting for lecture to begin...");
  const [keyTerms, setKeyTerms] = useState<{term: string, def: string}[]>([]);
  const [highlights, setHighlights] = useState<number[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const toggleHighlight = (idx: number) => {
    setHighlights(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const getTranslatedText = (text: string) => {
    if (settings.targetLanguage === 'English') return text;
    return `[${settings.targetLanguage}] ${text} (Translated)`;
  };


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      let index = 0;
      interval = setInterval(() => {
        if (index < mockTranscriptData.length) {
          setTranscript(prev => [...prev, mockTranscriptData[index]]);
          
          // Simulate AI updating summary and terms
          if (index === 3) {
            setCurrentSummary("The lecture introduced Quantum Computing and the concept of qubits vs bits.");
            setKeyTerms([{ term: "Qubit", def: "Basic unit of quantum information." }]);
          } else if (index === 6) {
            setCurrentSummary("Exploring Superposition and Entanglement as core quantum principles.");
            setKeyTerms(prev => [...prev, { term: "Entanglement", def: "Quantum connection between distant particles." }]);
          }
          
          index++;
        } else {
          setIsRecording(false);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === 'youtube' ? 'YouTube Analysis' : 
             mode === 'online' ? 'Online Session' : 
             mode === 'file' ? 'File Analysis' :
             mode === 'collab' ? 'Shared Study Room' :
             'Live Recording'}
          </h1>
          <p className="text-zinc-400 mt-1">
            {mode === 'collab' ? `Room Code: ${searchParams.get('room') || 'AB12'}` : 'Real-time AI assistance is active'}
          </p>
        </div>

        
        <div className="flex items-center gap-4">
          {!isRecording && transcript.length > 0 && (
            <button 
              onClick={() => router.push('/results')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              Generate Full Report
            </button>
          )}
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all active:scale-95 shadow-lg",
              isRecording 
                ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 shadow-red-500/10" 
                : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20"
            )}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                Stop Session
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Start Session
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Transcript */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-card p-8 flex flex-col h-[600px] relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <LayoutList className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-semibold uppercase tracking-wider text-zinc-400">Live Transcript</h3>
              </div>
              {isRecording && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-medium text-red-400 uppercase tracking-widest">Recording</span>
                </div>
              )}
            </div>

            <div className="flex-grow overflow-y-auto pr-4 space-y-4 scrollbar-hide">
              <AnimatePresence initial={false}>
                {transcript.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "p-4 rounded-2xl border transition-all group relative",
                      highlights.includes(idx) 
                        ? "bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_20px_-10px_rgba(234,179,8,0.3)]" 
                        : "bg-white/5 border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-grow">
                        <p className="text-zinc-200 leading-relaxed">{getTranslatedText(line)}</p>
                        {notes[idx] && (
                          <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex gap-2 items-start">
                            <StickyNote className="w-3 h-3 text-indigo-400 mt-1 flex-shrink-0" />
                            <p className="text-xs text-indigo-300 italic">{notes[idx]}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toggleHighlight(idx)}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            highlights.includes(idx) ? "bg-yellow-500/20 text-yellow-400" : "hover:bg-white/10 text-zinc-500 hover:text-zinc-300"
                          )}
                        >
                          <Highlighter className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setActiveNoteIdx(activeNoteIdx === idx ? null : idx)}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            notes[idx] ? "bg-indigo-500/20 text-indigo-400" : "hover:bg-white/10 text-zinc-500 hover:text-zinc-300"
                          )}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {activeNoteIdx === idx && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex gap-2"
                      >
                        <input 
                          type="text"
                          autoFocus
                          placeholder="Add a personal note..."
                          className="flex-grow bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                          value={notes[idx] || ''}
                          onChange={(e) => setNotes({ ...notes, [idx]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && setActiveNoteIdx(null)}
                        />
                        <button 
                          onClick={() => setActiveNoteIdx(null)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                        >
                          Save
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={transcriptEndRef} />
            </div>


            {/* Mic Animation Overlay */}
            {!isRecording && transcript.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/50 backdrop-blur-sm">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsRecording(true)}
                  className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)] transition-all hover:bg-indigo-500"
                >
                  <Mic className="w-10 h-10 text-white" />
                </motion.button>
                <p className="mt-6 text-zinc-400 font-medium">Click to start capturing the lecture</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="flex flex-col gap-6">
          {/* AI Summary */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">AI Summary</h3>
            </div>
            <div className="min-h-[100px] flex items-center justify-center">
              <p className="text-zinc-200 text-sm leading-relaxed italic">
                {currentSummary}
              </p>
            </div>
          </div>

          {/* Key Terms */}
          <div className="glass-card p-6 flex-grow space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Key Terms</h3>
            </div>
            
            <div className="space-y-4">
              {keyTerms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 opacity-30">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-xs font-medium">Listening for concepts...</p>
                </div>
              ) : (
                keyTerms.map((term, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1"
                  >
                    <h4 className="text-indigo-400 font-bold text-sm">{term.term}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">{term.def}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <AITutorSidebar />
    </div>
  );
}
