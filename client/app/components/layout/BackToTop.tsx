'use client';

import { useEffect, useRef, useState } from 'react';

const SHOW_THRESHOLD = 100; // px scrolled before button appears
const SIZE = 44;            // button diameter in px
const STROKE = 3;           // ring stroke width
const RADIUS = (SIZE - STROKE * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function BackToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

        setProgress(pct);
        setVisible(scrollTop > SHOW_THRESHOLD);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // strokeDashoffset: full circumference = 0% filled, 0 = 100% filled
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{ width: SIZE, height: SIZE }}
      className={[
        'fixed bottom-6 right-6 z-50',
        'flex items-center justify-center',
        'rounded-full bg-background',
        'shadow-[0_4px_24px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.16)]',
        'border border-border/40',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-0.5 active:translate-y-0 active:scale-95',
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none',
      ].join(' ')}
    >
      {/* Progress ring */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className="text-border/30"
        />
        {/* Fill */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          className="text-[#1f3a31] transition-[stroke-dashoffset] duration-100 ease-linear" />
      </svg>

      {/* Arrow icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="relative z-10 text-foreground transition-transform duration-200 group-hover:-translate-y-0.5"
      >
        <path
          d="M7 11V3M3.5 6.5L7 3l3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
