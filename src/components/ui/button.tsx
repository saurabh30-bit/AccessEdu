'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-[0_18px_60px_-18px_rgba(99,102,241,0.55)] hover:brightness-110',
        secondary:
          'bg-white/8 text-white hover:bg-white/12 ring-1 ring-white/10',
        outline: 'bg-transparent text-white ring-1 ring-white/15 hover:bg-white/5',
        ghost: 'bg-transparent text-white/85 hover:bg-white/5 hover:text-white',
        destructive:
          'bg-red-500/90 text-white hover:bg-red-500 shadow-[0_18px_60px_-18px_rgba(239,68,68,0.55)]',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-11 px-4',
        lg: 'h-12 px-5 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

