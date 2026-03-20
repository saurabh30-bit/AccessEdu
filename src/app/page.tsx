"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Video, Youtube, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const features = [
  {
    id: 'live',
    title: "Live IRL Lecture Mode",
    description: "Real-time transcription and AI summaries for in-person classes.",
    icon: Mic,
    color: "bg-indigo-500",
    buttonText: "Start Recording",
    href: "/live?mode=live",
  },
  {
    id: 'online',
    title: "Online Lecture Mode",
    description: "Connect to your online session and capture every word.",
    icon: Video,
    color: "bg-purple-500",
    buttonText: "Connect Session",
    href: "/live?mode=online",
  },
  {
    id: 'youtube',
    title: "YouTube Lecture Mode",
    description: "Paste a YouTube link to instantly analyze and summarize.",
    icon: Youtube,
    color: "bg-pink-500",
    buttonText: "Analyze Link",
    href: "/youtube-analysis",
    isInput: true,
  },
];

export default function DashboardPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const router = useRouter();

  const handleYoutubeAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;
    
    // Extract video ID if possible, or just pass the URL
    const urlParams = new URLSearchParams(new URL(youtubeUrl).search);
    const videoId = urlParams.get('v') || youtubeUrl.split('/').pop();
    
    router.push(`/youtube-analysis?url=${encodeURIComponent(youtubeUrl)}&v=${videoId}`);
  };

  return (
    <div className="max-w-6xl mx-auto pt-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Turn Any Lecture Into <br />
            <span className="text-gradient">Understanding</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mt-6">
            AccessEdu levels the classroom playing field using real-time AI to summarize, 
            define, and explain complex concepts as they happen.
          </p>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-card p-8 flex flex-col h-full"
          >
            <div className={cn("p-3 rounded-2xl w-fit mb-6", `${feature.color}/20`)}>
              <feature.icon className={cn("w-8 h-8", `text-${feature.color.split('-')[1]}-400`)} />
            </div>
            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
            <p className="text-zinc-400 mb-8 flex-grow">{feature.description}</p>
            
            {feature.isInput ? (
              <form onSubmit={handleYoutubeAnalyze} className="space-y-3">
                <input 
                  type="text" 
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Paste YouTube URL..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all text-white"
                />
                <button 
                  type="submit"
                  disabled={!youtubeUrl.trim()}
                  className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-pink-500/20"
                >
                  {feature.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <Link 
                href={feature.href}
                className={cn(
                  "w-full text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg mt-auto",
                  feature.id === 'live' ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20" : "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20"
                )}
              >
                {feature.buttonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        ))}
      </section>
    </div>
  );
}
