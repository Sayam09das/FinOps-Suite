import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type PageStat = {
  label: string;
  value: string;
};

type PageCard = {
  title: string;
  description: string;
};

type MarketingPageTemplateProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: PageStat[];
  cards: PageCard[];
  asideTitle: string;
  asideDescription: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction: {
    label: string;
    href: string;
  };
};

export default function MarketingPageTemplate({
  eyebrow,
  title,
  description,
  stats,
  cards,
  asideTitle,
  asideDescription,
  primaryAction,
  secondaryAction,
}: MarketingPageTemplateProps) {
  return (
    <main className="flex-1">
      <section className="page-shell">
        <section className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="space-y-8">
            <div className="soft-chip">
              <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
              Built for consistent performance on every screen
            </div>

            <div className="space-y-5">
              <p className="eyebrow text-foreground/52">{eyebrow}</p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                {title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-foreground/72 sm:text-xl">{description}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={primaryAction.href} className="btn-primary-soft">
                {primaryAction.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={secondaryAction.href} className="btn-secondary-soft">
                {secondaryAction.label}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <article key={stat.label} className="metric-card">
                  <p className="text-sm text-foreground/58">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{stat.value}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="surface-card rounded-[2.2rem] p-6 md:p-7">
            <div className="space-y-5">
              <div className="primary-wash inline-flex rounded-2xl px-4 py-2 text-sm font-medium text-foreground">
                Strategic highlight
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">{asideTitle}</h2>
                <p className="text-base leading-7 text-foreground/72">{asideDescription}</p>
              </div>
              <div className="grid gap-3">
                {cards.map((card, index) => (
                  <article key={card.title} className="rounded-[1.6rem] border border-border/75 bg-white/40 p-5">
                    <div className="flex items-center gap-3">
                      <div className="number-pill">0{index + 1}</div>
                      <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-foreground/68">{card.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
