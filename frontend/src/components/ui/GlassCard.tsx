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
        "bg-white dark:bg-[#131A15] border border-slate-200 dark:border-[#232D26] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300",
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