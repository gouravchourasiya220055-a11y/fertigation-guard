import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        ) : null}

        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border border-[#DDE7D9] bg-white text-sm text-[#1B4332] placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32]/20 focus-visible:border-[#2E7D32] disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
            icon ? "pl-11" : undefined,
            error ? "border-[#DC2626] focus-visible:ring-[#DC2626]" : undefined,
            className
          )}
          {...props}
        />

        {error ? (
          <p className="mt-1.5 text-sm text-destructive font-medium">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";