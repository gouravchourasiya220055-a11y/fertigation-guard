import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200 cursor-pointer shadow-sm";
    
    const variants = {
      primary: "bg-[#2E7D32] text-white hover:bg-[#1B5E20] hover:shadow-md transition-all duration-200 border border-transparent",
      secondary: "bg-white border border-[#2E7D32] text-[#2E7D32] hover:bg-[#EAF7EA] hover:shadow-md transition-all duration-200",
      outline: "border border-[#DDE7D9] bg-transparent text-[#1B4332] hover:bg-[#EAF7EA]/30 transition-all duration-200",
      ghost: "text-[#5E6E64] hover:bg-[#EAF7EA]/30 hover:text-[#1B4332] transition-all duration-200 shadow-none",
      destructive: "bg-[#DC2626] text-white hover:bg-[#B91C1C] hover:shadow-md transition-all duration-200"
    };
    
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
      icon: "h-11 w-11"
    };

    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
