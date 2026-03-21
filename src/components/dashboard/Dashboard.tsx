'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Play, Video, Youtube } from 'lucide-react';
import { GradientBorderCard as GradientCard } from '@/components/ui/gradient-border-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { analyzeYoutube, connectOnlineSession } from '@/lib/mockApi';
import { setLastLecture } from '@/lib/storage';

function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={
        className ??
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white'
      }
    />
  );
}

type ModeCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  footer: React.ReactNode;
  onClick?: () => void;
};

function ModeCard({
  icon,
  title,
  description,
  footer,
  onClick,
}: ModeCardProps) {
  return (
    <div
      className="group"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <GradientCard className="cursor-pointer transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_120px_-60px_rgba(99,102,241,0.55)]">
        <div className="p-7">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-white/8">
              {icon}
            </div>
            <div className="min-w-0">
              <div className="text-base font-semibold text-white">
                {title}
              </div>
              <div className="mt-1 text-sm leading-relaxed text-slate-300/80">
                {description}
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
              AccessEdu Mode
            </div>
            <div className="flex items-center gap-2">{footer}</div>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();

  const [youtubeLink, setYoutubeLink] = useState('');
  const [isAnalyzingYoutube, setIsAnalyzingYoutube] = useState(false);

  async function handleLive() {
    await new Promise((r) => setTimeout(r, 250));
    router.push('/live?mode=live-irl&autostart=1');
  }

  async function handleOnline() {
    // Mock connection + then jump to live.
    await connectOnlineSession();
    router.push('/live?mode=online&autostart=1');
  }

  async function handleYoutubeAnalyze() {
    if (!youtubeLink.trim()) return;
    setIsAnalyzingYoutube(true);
    try {
      const lecture = await analyzeYoutube(youtubeLink);
      setLastLecture(lecture);
      router.push('/results');
    } finally {
      setIsAnalyzingYoutube(false);
    }
  }

  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-6xl">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_40px_140px_-90px_rgba(99,102,241,0.55)]">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10" />
          <div className="absolute -right-24 top-0 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-slate-200/90 backdrop-blur-xl">
                <Play className="h-3.5 w-3.5 text-indigo-200" />
                AI Classroom Equalizer
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Turn Any Lecture Into Understanding
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300/80 md:text-base">
                Record, connect, or paste a YouTube link—then get an
                understanding-first summary, key terms, and flashcards
                instantly.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
                  Fast Setup
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  Backend + Gemini AI
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
                  Premium UI
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  Glass + motion
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <ModeCard
            icon={<Mic className="h-6 w-6 text-indigo-200" />}
            title="Live IRL Lecture Mode"
            description="Start recording and let AccessEdu stream a transcript + AI understanding in real time."
            footer={<Button size="md">Start Recording</Button>}
            onClick={handleLive}
          />

          <ModeCard
            icon={<Video className="h-6 w-6 text-purple-200" />}
            title="Online Lecture Mode (Zoom/Meet)"
            description="Connect a session and watch the AI summary update while the lecture is still happening."
            footer={<Button variant="secondary">Connect Session</Button>}
            onClick={handleOnline}
          />

          <div
            className="group cursor-default"
            role="region"
            aria-label="YouTube lecture mode"
          >
            <GradientCard className="transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_120px_-60px_rgba(99,102,241,0.55)]">
              <div className="p-7">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-white/8">
                    <Youtube className="h-6 w-6 text-blue-200" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-white">
                      YouTube Lecture Mode
                    </div>
                    <div className="mt-1 text-sm leading-relaxed text-slate-300/80">
                      Paste a link and get instant key terms + flashcards.
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  {isAnalyzingYoutube ? (
                    <div className="space-y-3">
                      <Skeleton className="h-11 w-full" />
                      <Skeleton className="h-11 w-full" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <Input
                          value={youtubeLink}
                          onChange={(e) => setYoutubeLink(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="bg-white/5"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
                          Analyze with AI
                        </div>
                        <Button
                          onClick={handleYoutubeAnalyze}
                          disabled={!youtubeLink.trim()}
                        >
                          {isAnalyzingYoutube ? <Spinner /> : 'Analyze'}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </GradientCard>
          </div>
        </section>

        <div className="mt-8 text-center text-xs text-slate-400/70">
          Live IRL uses real mic + AI. YouTube fetches transcripts. Online mode demos with simulated stream.
        </div>
      </div>
    </div>
  );
}

