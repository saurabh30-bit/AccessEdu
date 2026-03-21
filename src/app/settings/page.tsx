"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, ShieldCheck, Info, CheckCircle2, Trash2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveGeminiKey, getGeminiKey, clearGeminiKey } from '@/lib/storage';
import { useSettings } from '@/context/SettingsContext';
import { Languages, Type, Volume2 } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [apiKey, setApiKey] = useState('');

  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedKeyExists, setSavedKeyExists] = useState(false);

  useEffect(() => {
    const saved = getGeminiKey();
    if (saved) {
      setApiKey(saved);
      setSavedKeyExists(true);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    saveGeminiKey(apiKey.trim());
    setIsSaved(true);
    setSavedKeyExists(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClear = () => {
    clearGeminiKey();
    setApiKey('');
    setSavedKeyExists(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-400">Configure your personal AI environment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* API Configuration Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Key className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold">Gemini API Configuration</h2>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed">
              To enable real-time AI processing for your lectures, please provide your Google Gemini API key. 
              Your key is stored locally in your browser and is never sent to our servers.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
                  API Key
                </label>
                <div className="relative group">
                  <input 
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white placeholder:text-zinc-600"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  type="submit"
                  disabled={!apiKey.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                  {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  {isSaved ? "Key Saved!" : "Save Configuration"}
                </button>

                {savedKeyExists && (
                  <button 
                    type="button"
                    onClick={handleClear}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95"
                    title="Clear API Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Security Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 border-indigo-500/10 bg-indigo-500/5 flex gap-4 items-start"
          >
            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Privacy First</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                AccessEdu operates as a client-side application. Your API keys and lecture data remain 
                within your browser's local storage. We do not track or store your sensitive information.
              </p>
            </div>
          </motion.div>

          {/* Accessibility Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold">Accessibility & Preferences</h2>
            </div>

            <div className="space-y-6">
              {/* Dyslexia Mode */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Type className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Dyslexia-Friendly Mode</h4>
                    <p className="text-xs text-zinc-500">Use OpenDyslexic font for better readability</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateSettings({ dyslexiaMode: !settings.dyslexiaMode })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    settings.dyslexiaMode ? "bg-indigo-600" : "bg-zinc-800"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    settings.dyslexiaMode ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              {/* Translation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Languages className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Target Translation Language</h4>
                    <p className="text-xs text-zinc-500">Translate transcripts in real-time</p>
                  </div>
                </div>
                <select 
                  value={settings.targetLanguage}
                  onChange={(e) => updateSettings({ targetLanguage: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>

              {/* TTS */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Volume2 className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Voice Synthesis (TTS)</h4>
                    <p className="text-xs text-zinc-500">Enable audio reading for summaries</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateSettings({ ttsEnabled: !settings.ttsEnabled })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    settings.ttsEnabled ? "bg-indigo-600" : "bg-zinc-800"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    settings.ttsEnabled ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Local Storage</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">API Connection</span>
                <span className={cn("font-medium", savedKeyExists ? "text-indigo-400" : "text-zinc-600")}>
                  {savedKeyExists ? "Configured" : "Not Set"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Environment</span>
                <span className="text-zinc-300">Hackathon Demo</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">How to get a key?</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Visit the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a> to generate a free Gemini API key.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
