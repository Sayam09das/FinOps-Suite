import Link from "next/link";

// ─── Social icons ─────────────────────────────────────────────────────────────

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SlackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z" />
  </svg>
);

const LogoMark = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M9 2L14.5 5.25V11.75L9 15L3.5 11.75V5.25L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 6.5V11.5M6.5 8L9 6.5L11.5 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckCircle = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="5.5" stroke="#1D9E75" strokeWidth="1.2" />
    <path d="M4.5 7l1.8 1.8L9.5 5" stroke="#1D9E75" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const socialLinks = [
  { name: "Twitter / X", href: "https://twitter.com/finopssuite", icon: TwitterIcon },
  { name: "LinkedIn", href: "https://linkedin.com/company/finopssuite", icon: LinkedInIcon },
  { name: "GitHub", href: "https://github.com/finopssuite", icon: GitHubIcon },
  { name: "YouTube", href: "https://youtube.com/@finopssuite", icon: YouTubeIcon },
  { name: "Slack community", href: "https://slack.finopssuite.com", icon: SlackIcon },
];

const legalLinks = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "Security", href: "/security" },
  { name: "Cookies", href: "/cookies" },
  { name: "DPA", href: "/dpa" },
];

const navGroups = [
  {
    label: "Product",
    links: [
      { name: "Overview", href: "/product" },
      { name: "Reconciliation", href: "/product/reconciliation" },
      { name: "Forecasting", href: "/product/forecasting", badge: "New" },
      { name: "Close Management", href: "/product/close" },
      { name: "Reporting", href: "/product/reporting" },
      // { name: "Integrations", href: "/integrations" },
      { name: "Pricing", href: "/pricing" }, // moved here
    ],
  },
  {
    label: "Company",
    links: [
      { name: "About us", href: "/about" },
      { name: "Blog", href: "/blog" },
      // { name: "Careers", href: "/careers", badge: "Hiring" },
      // { name: "Customers", href: "/customers" },
      // { name: "Press kit", href: "/press" },
    ],
  },
  {
    label: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "API reference", href: "/docs/api" },
      // { name: "Community", href: "/community" },
      // { name: "Changelog", href: "/changelog" }, // moved here
      { name: "Status page", href: "https://status.finopssuite.com" },
      // { name: "Support", href: "/support" },
    ],
  },
];
// ─── Sub-components ───────────────────────────────────────────────────────────

function SocialButton({
  name,
  href,
  icon: Icon,
}: {
  name: string;
  href: string;
  icon: React.FC;
}) {
  return (
    <a
      href={href}
      title={name}
      aria-label={name}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex h-8 w-8 items-center justify-center
        rounded-lg border border-border/30
        bg-muted/50 text-muted-foreground
        transition-all duration-150
        hover:-translate-y-px hover:border-border/60 hover:bg-background hover:text-foreground
      "
    >
      <Icon />
    </a>
  );
}

function NavBadge({ label }: { label: string }) {
  return (
    <span className="rounded px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
      {label}
    </span>
  );
}

function NavGroup({
  label,
  links,
}: {
  label: string;
  links: { name: string; href: string; badge?: string }[];
}) {
  return (
    <div>
      <p className="mb-3.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {label}
      </p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-center gap-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
              {link.name}
              {link.badge && <NavBadge label={link.badge} />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusPill() {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      All systems operational
    </div>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function Newsletter() {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-foreground">Get the monthly FinOps digest</p>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="you@company.com"
          aria-label="Email address for newsletter"
          className="
            min-w-0 flex-1 rounded-lg border border-border/40 bg-muted/50
            px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60
            outline-none transition
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15
          "
        />
        <button
          type="button"
          className="
            rounded-lg bg-emerald-700 px-3.5 py-2 text-sm font-medium
            text-white transition-all duration-150
            hover:-translate-y-px hover:bg-emerald-800
            active:translate-y-0
          "
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}

// ─── Main footer ──────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="px-4 pb-4 pt-2" aria-label="Site footer">
      <div className="mx-auto max-w-7xl rounded-3xl border border-border/30 bg-background px-10 pb-7 pt-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div>
            {/* Logo */}
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 shadow-sm">
                <LogoMark />
              </div>
              <div>
                <p className="text-[15px] font-semibold leading-none tracking-tight text-foreground">
                  FinOps Suite
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-600">
                  backed by Y Combinator
                </p>
              </div>
            </div>

            {/* Social proof bar */}
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-border/30 bg-muted/50 px-3 py-2.5">
              <CheckCircle />
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">2,400+ teams</span> closed their books on time last quarter
              </p>
              <span className="ml-auto rounded font-mono text-[9px] font-medium uppercase tracking-wide bg-amber-50 px-1.5 py-0.5 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                W24
              </span>
            </div>

            <p className="mb-5 max-w-[240px] text-[13px] leading-7 text-muted-foreground">
              Professional finance operations built for speed. Reconcile, forecast, and report without the spreadsheet chaos.
            </p>

            <Newsletter />

            {/* Socials */}
            <div className="mt-4 flex gap-1.5">
              {socialLinks.map((s) => (
                <SocialButton key={s.href} {...s} />
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navGroups.map((group) => (
            <NavGroup key={group.label} {...group} />
          ))}
        </div>

        {/* Divider */}
        <div className="my-7 border-t border-border/30" />

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2026 FinOps Suite, Inc.</p>
            <StatusPill />
          </div>
          <nav aria-label="Legal links" className="flex flex-wrap items-center gap-1">
            {legalLinks.map((link, i) => (
              <span key={link.href} className="flex items-center">
                {i > 0 && (
                  <span className="mx-1 text-xs text-border" aria-hidden="true">·</span>
                )}
                <Link
                  href={link.href}
                  className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.name}
                </Link>
              </span>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}
