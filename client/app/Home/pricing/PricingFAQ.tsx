"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal } from "@/app/components/ui/reveal";
import { SectionHeading } from "@/app/components/ui/section-heading";

const faqs = [
  {
    question: "Can we start on Starter and upgrade later?",
    answer: "Yes. The product and design language stay consistent across plans, so upgrading expands capability without forcing teams to relearn the interface.",
  },
  {
    question: "Do all plans work well on mobile and tablet?",
    answer: "Yes. The responsive layouts are built to keep pricing information, feature comparisons, and actions clear across devices.",
  },
  {
    question: "What changes most in Enterprise?",
    answer: "Enterprise focuses on deeper controls, custom policies, and more tailored reporting for larger organizations and cross-functional teams.",
  },
  {
    question: "Do you support onboarding for larger teams?",
    answer: "Yes. Enterprise plans include onboarding support, and the system structure is designed to help teams adopt it smoothly.",
  },
];

export default function PricingFAQ() {
  const [openItem, setOpenItem] = useState<number | null>(0);

  return (
    <section className="space-y-8">
      <Reveal>
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions teams ask before they commit,
              <span className="block text-accent-foreground">answered clearly.</span>
            </>
          }
          description="The FAQ uses motion carefully so it feels responsive and refined without becoming distracting."
        />
      </Reveal>

      <div className="grid gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openItem === index;

          return (
            <Reveal key={faq.question} delay={0.05 * index} variant="up">
              <Card variant={isOpen ? "accent" : "surface"} padding="none">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenItem((current) => (current === index ? null : index))}
                >
                  <span className="text-lg font-semibold text-foreground">{faq.question}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-5 w-5 text-foreground/68" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <CardContent className="px-6 pb-6 pt-0">
                        <p className="text-sm leading-7 text-foreground/72">{faq.answer}</p>
                      </CardContent>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
