"use client";

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { LiveLecturePage } from '@/app/live/page';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  );
}

export default function LivePageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LiveLecturePage />
    </Suspense>
  );
}
