import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref" | "children"> {
  variant?: "default" | "panel" | "heavy";
  children?: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = "default",
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "glass rounded-2xl",
      panel: "glass-panel rounded-3xl",
      heavy:
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/40 dark:border-slate-700/50 rounded-2xl shadow-2xl",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(variants[variant], className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";