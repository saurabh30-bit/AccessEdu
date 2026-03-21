import * as React from 'react';
import { cn } from '@/lib/utils';

export function GradientBorderCard({
  className,
  innerClassName,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  innerClassName?: string;
}) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-[1px] bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'rounded-[calc(1rem-1px)] bg-black/30 backdrop-blur-xl border border-white/10',
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

