"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowUpRight, MoreVertical } from 'lucide-react';
import { mockHistory } from '@/lib/mockData';
import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Lecture History</h1>
          <p className="text-zinc-400 mt-2">Access your past summaries and flashcards</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search lectures..."
            className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 w-full md:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockHistory.map((lecture, idx) => (
          <motion.div
            key={lecture.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card group"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                  <Calendar className="w-6 h-6" />
                </div>
                <button className="text-zinc-500 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold leading-tight group-hover:text-indigo-400 transition-colors">
                  {lecture.title}
                </h3>
                <p className="text-zinc-500 text-sm">{lecture.dateISO}</p>
              </div>

              <Link 
                href="/results"
                className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group/btn"
              >
                <span className="text-sm font-semibold">View Details</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover/btn:text-indigo-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {mockHistory.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
          <div className="p-6 rounded-full bg-white/5 text-zinc-600">
            <Calendar className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">No lectures found</h3>
            <p className="text-zinc-500 max-w-xs">Your recorded sessions and analyzed links will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
}
