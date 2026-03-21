"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Youtube, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  Loader2, 
  ExternalLink,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockYoutubeResult } from '@/lib/mockData';
import { AITutorSidebar } from '@/components/ai-tutor/AITutorSidebar';

export function YoutubeAnalysisPage() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const videoId = searchParams.get('v');
  const videoUrl = searchParams.get('url');

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Simulate AI analysis process
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (!videoId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Youtube className="w-16 h-16 text-red-500 opacity-20" />
        <h2 className="text-2xl font-bold">Invalid YouTube URL</h2>
        <p className="text-zinc-400">Please provide a valid link from the dashboard.</p>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <button 
            onClick={() => router.push('/')}
            className="text-sm text-zinc-500 hover:text-pink-400 transition-colors flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Youtube className="w-8 h-8 text-red-500" />
            YouTube Video Analysis
          </h1>
        </div>
        
        {showResults && (
          <button 
            onClick={() => router.push('/results')}
            className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-pink-500/20 flex items-center gap-2"
          >
            View Full Report
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Video & Summary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Video Embed */}
          <div className="glass-card overflow-hidden aspect-video relative group">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Analysis Section */}
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
                  <Sparkles className="w-6 h-6 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">AI is analyzing the lecture...</h3>
                  <p className="text-zinc-400 max-w-xs mx-auto text-sm">
                    We're transcribing the video and extracting key educational insights.
                  </p>
                </div>
                
                {/* Simulated Progress Steps */}
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-12 h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 1, delay: i * 0.8 }}
                        className="w-full h-full bg-pink-500"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Executive Summary Card */}
                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-pink-400" />
                    <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-400">AI Summary</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {mockYoutubeResult.summary.map((point, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                      >
                        <CheckCircle2 className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                        <p className="text-zinc-200 leading-relaxed">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Key Terms & Metadata */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Key Terms</h3>
            </div>

            <div className="space-y-4">
              {isAnalyzing ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="h-4 w-24 bg-white/5 rounded" />
                    <div className="h-12 w-full bg-white/5 rounded-xl" />
                  </div>
                ))
              ) : (
                mockYoutubeResult.flashcards.map((term, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1 group hover:bg-white/10 transition-all cursor-default"
                  >
                    <h4 className="text-pink-400 font-bold text-sm">{term.term}</h4>
                    <p className="text-zinc-400 text-xs leading-relaxed">{term.definition}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Video Metadata Card */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Source Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Platform</span>
                <span className="text-zinc-300">YouTube</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Video ID</span>
                <span className="text-zinc-300 font-mono">{videoId}</span>
              </div>
              <a 
                href={videoUrl || `https://youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition-all"
              >
                Original Video <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <AITutorSidebar />
    </div>
  );
}

export default function YoutubeAnalysisPageWrapper() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    }>
      <YoutubeAnalysisPage />
    </React.Suspense>
  );
}
