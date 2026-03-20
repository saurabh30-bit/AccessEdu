'use client';

import React, { useEffect, useMemo, useState } from 'react';

export default function Typewriter({
  text,
  startDelayMs = 200,
  speedMs = 18,
  className,
}: {
  text: string;
  startDelayMs?: number;
  speedMs?: number;
  className?: string;
}) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    // Reset the cursor after paint to avoid synchronous state updates in effects.
    const resetTimeout = window.setTimeout(() => setVisible(0), 0);
    const timeout = window.setTimeout(() => {
      let i = 0;
      const interval = window.setInterval(() => {
        i += 1;
        setVisible(i);
        if (i >= chars.length) window.clearInterval(interval);
      }, speedMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(resetTimeout);
      window.clearTimeout(timeout);
    };
  }, [chars, speedMs, startDelayMs]);

  return (
    <span className={className}>
      {chars.slice(0, visible).join('')}
      <span className="inline-block w-[2px] animate-pulse align-baseline text-indigo-200/70">
        {visible < chars.length ? '|' : ''}
      </span>
    </span>
  );
}

