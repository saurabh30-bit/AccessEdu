'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'min-h-[120px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400/80 backdrop-blur-xl outline-none transition focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-400/20',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

