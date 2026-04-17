import Link from "next/link";
import { Sparkles } from "lucide-react";

import { navLinks } from "./nav-config";

const footerLinks = navLinks.flatMap((item) =>
  item.dropdown ? item.dropdown : item.href ? [{ name: item.name, href: item.href }] : [],
);

export default function Footer() {
  return (
    <footer className="px-3 pb-4 pt-2 md:px-4 md:pb-6">
      <div className="panel-frost mx-auto flex w-full max-w-7xl flex-col gap-8 rounded-[2rem] px-5 py-6 md:px-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="primary-wash flex h-11 w-11 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
              <Sparkles className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="eyebrow text-foreground/48">FinOps Suite</p>
              <p className="text-sm font-semibold text-foreground">Professional finance operations for modern teams</p>
            </div>
          </div>
          <p className="max-w-lg text-sm leading-7 text-foreground/68">
            Built with a calmer visual system, smoother navigation, and responsive interactions that stay consistent
            across desktop, tablet, and mobile.
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:items-end">
          <div className="flex flex-wrap gap-2">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="soft-chip">
                {link.name}
              </Link>
            ))}
          </div>
          <p className="text-sm text-foreground/56">© 2026 FinOps Suite. Designed for focused financial teams.</p>
        </div>
      </div>
    </footer>
  );
}
