import React from "react";
import Link from "next/link";
import { Wrench, MapPin, Mail, Phone, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/70 bg-[#EBECE4] text-zinc-900 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-zinc-300/80">
          {/* Brand Info */}
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900"
            >
              <span className="h-9 w-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <Wrench className="h-4 w-4" />
              </span>
              <span>FixFlow</span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Trusted home and appliance repair booking platform connecting
              customers with verified technicians for fast, transparent service.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-500/15 border border-emerald-600/20 px-2.5 py-1 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Verified Technicians & Clear Pricing</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-600">
              <li>
                <Link
                  href="/"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Browse Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-zinc-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Roles & Access */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900">
              Get Started
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-600">
              <li>
                <Link
                  href="/sign-up"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Create an Account
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/customer/bookings"
                  className="hover:text-zinc-900 transition-colors"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/technician"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Technician Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-900">Contact</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Home Visit & Local Service Coverage</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="break-all">support@repairservice.local</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+880 1700-000000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>© 2026 FixFlow. All rights reserved.</p>
          <p>Reliable repair bookings & live status tracking.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;