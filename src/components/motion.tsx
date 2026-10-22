"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";

// One spring for the whole site: quick, settles without wobble.
export const spring = { type: "spring", stiffness: 380, damping: 36 } as const;

/**
 * Fades and lifts content into place once, as it scrolls into view.
 * Reduced motion is handled in one place: MotionConfig (providers) drops the movement, and the
 * `[data-reveal]` rule in theme.css shows the content at once, so server and browser render the same.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}

const MotionLink = motion.create(Link);

type Variant = "solid" | "ghost" | "ember";

const variants: Record<Variant, string> = {
  solid: "bg-accent text-on-accent",
  ember: "bg-ember text-on-ember",
  ghost: "border border-control text-text hover:border-accent hover:text-accent",
};

/** Link styled as a button. Presses in with a spring; the arrow nudges forward on hover. */
export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  return (
    <MotionLink
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      whileTap={{ scale: 0.97 }}
      whileHover="hover"
      transition={spring}
      className={`inline-flex h-12 items-center gap-3 px-6 text-[17px] font-semibold transition-colors duration-150 ${variants[variant]} ${className}`}
    >
      {children}
      <motion.span
        aria-hidden="true"
        variants={{ hover: { x: 4 } }}
        transition={spring}
        className="inline-block"
      >
        →
      </motion.span>
    </MotionLink>
  );
}
