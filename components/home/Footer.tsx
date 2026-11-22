import React from "react";
import Link from "next/link";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";

interface NavLinkItem {
  label: string;
  href: string;
}

const QUICK_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

const POPULAR_CATEGORIES: NavLinkItem[] = [
  { label: "Home Appliances", href: "/services?category=appliances" },
  { label: "Electronics & Gadgets", href: "/services?category=electronics" },
  { label: "Plumbing & Electrical", href: "/services?category=electrical" },
  { label: "AC & Cooling", href: "/services?category=ac-repair" },
];

function XLogoIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubLogoIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
      />
    </svg>
  );
}

function LinkedinLogoIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19ZM8.34 17.34V10.67H6.12V17.34H8.34ZM7.23 9.76C8 9.76 8.48 9.25 8.48 8.61C8.47 7.96 8 7.46 7.24 7.46C6.49 7.46 6 7.96 6 8.61C6 9.25 6.48 9.76 7.21 9.76H7.23ZM18 17.34V13.56C18 11.53 16.92 10.59 15.48 10.59C14.32 10.59 13.8 11.23 13.51 11.68V10.67H11.29C11.32 11.15 11.29 17.34 11.29 17.34H13.51V13.62C13.51 13.42 13.52 13.22 13.58 13.08C13.74 12.68 14.11 12.27 14.73 12.27C15.53 12.27 15.85 12.88 15.85 13.77V17.34H18Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#DCDCD0] border-t-2 border-[#A9A694] text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-10 sm:pb-12 border-b border-[#A9A694]">
          {/* Brand & Tagline */}
          <div className="lg:col-span-4 space-y-3.5">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl bg-[#006E00] text-white border border-[#005200] flex items-center justify-center shadow-xs group-hover:bg-[#005900] transition-colors">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
                Fix<span className="text-[#006E00]">Mate</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#334155] font-medium leading-relaxed max-w-sm">
              Fast, transparent, and reliable repair services connecting you
              with verified technicians—at your doorstep or nearby.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="FixMate on X"
                className="h-9 w-9 rounded-xl border border-[#9E9B88] bg-[#C8C7B7] text-[#1E293B] hover:bg-[#006E00] hover:text-white hover:border-[#005200] flex items-center justify-center transition-colors"
              >
                <XLogoIcon className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="FixMate on GitHub"
                className="h-9 w-9 rounded-xl border border-[#9E9B88] bg-[#C8C7B7] text-[#1E293B] hover:bg-[#006E00] hover:text-white hover:border-[#005200] flex items-center justify-center transition-colors"
              >
                <GithubLogoIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="FixMate on LinkedIn"
                className="h-9 w-9 rounded-xl border border-[#9E9B88] bg-[#C8C7B7] text-[#1E293B] hover:bg-[#006E00] hover:text-white hover:border-[#005200] flex items-center justify-center transition-colors"
              >
                <LinkedinLogoIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3 rounded-2xl border border-[#A9A694] bg-[#CECEBF] p-4 shadow-2xs">
            <h3 className="text-sm font-bold tracking-tight text-[#0F172A] pb-2 border-b border-[#A9A694]">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#334155] font-medium">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#006E00] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="lg:col-span-3 space-y-3 rounded-2xl border border-[#A9A694] bg-[#CECEBF] p-4 shadow-2xs">
            <h3 className="text-sm font-bold tracking-tight text-[#0F172A] pb-2 border-b border-[#A9A694]">
              Popular Categories
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#334155] font-medium">
              {POPULAR_CATEGORIES.map((category) => (
                <li key={category.label}>
                  <Link
                    href={category.href}
                    className="hover:text-[#006E00] transition-colors"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 space-y-3 rounded-2xl border border-[#A9A694] bg-[#CECEBF] p-4 shadow-2xs">
            <h3 className="text-sm font-bold tracking-tight text-[#0F172A] pb-2 border-b border-[#A9A694]">
              Contact Us
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-[#334155] font-medium">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-[#006E00] shrink-0 mt-0.5" />
                <a
                  href="mailto:support@fixmate.app"
                  className="hover:text-[#006E00] transition-colors break-all"
                >
                  support@fixmate.app
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-[#006E00] shrink-0 mt-0.5" />
                <a
                  href="tel:+8801700000000"
                  className="hover:text-[#006E00] transition-colors"
                >
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#006E00] shrink-0 mt-0.5" />
                <span>Ulipur, Kurigram, Rangpur, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-[#334155] font-medium">
          <p>© 2026 FixMate. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/services"
              className="hover:text-[#006E00] transition-colors"
            >
              Browse Services
            </Link>
            <Link
              href="/about"
              className="hover:text-[#006E00] transition-colors"
            >
              About Platform
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}