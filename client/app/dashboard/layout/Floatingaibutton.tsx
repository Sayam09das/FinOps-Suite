"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/app/lib/utils/cn";
import AIInsightPanel from "./Aiinsightpanel";

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * FloatingAIButton
 *
 * Drop this once anywhere inside your root layout or page.
 * It renders a fixed bottom-right trigger that toggles the AI Insight Panel.
 *
 * No props required.
 */
export default function FloatingAIButton() {
    const [open, setOpen] = useState(false);
    const [hasNew, setHasNew] = useState(true); // notification pulse state
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (open && !wrapperRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    const toggle = () => {
        setOpen((v) => !v);
        if (hasNew) setHasNew(false); // clear pulse once opened
    };

    return (
        <div ref={wrapperRef} className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">
            {/* AI panel */}
            <AIInsightPanel open={open} onClose={() => setOpen(false)} />

            {/* Trigger button */}
            <div className="relative flex items-center justify-center">

                {/* Notification pulse rings — visible when hasNew */}
                {hasNew && !open && (
                    <>
                        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
                        <span className="absolute inset-[-4px] animate-pulse rounded-full bg-emerald-400/12" />
                    </>
                )}

                <button
                    type="button"
                    onClick={toggle}
                    aria-label={open ? "Close AI assistant" : "Open AI assistant"}
                    aria-expanded={open}
                    aria-haspopup="dialog"
                    className={cn(
                        // Base
                        "relative flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full",
                        "bg-gradient-to-br from-emerald-500 to-emerald-400",
                        "shadow-[0_8px_32px_rgba(52,211,153,0.35),0_2px_8px_rgba(0,0,0,0.3)]",
                        // Border
                        "ring-2 ring-emerald-300/30",
                        // Transitions
                        "transition-all duration-200 ease-out",
                        // Hover
                        "hover:scale-110 hover:shadow-[0_12px_40px_rgba(52,211,153,0.50),0_2px_12px_rgba(0,0,0,0.35)]",
                        // Open state — slightly depressed
                        open && "scale-95 shadow-[0_4px_16px_rgba(52,211,153,0.28)] ring-emerald-300/50",
                    )}
                >
                    <Sparkles
                        className={cn(
                            "h-[22px] w-[22px] text-white transition-transform duration-300",
                            open && "rotate-12 scale-90",
                        )}
                    />

                    {/* Notification dot */}
                    {hasNew && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white shadow-sm ring-2 ring-emerald-400">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}