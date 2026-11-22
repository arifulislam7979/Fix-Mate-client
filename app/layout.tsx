import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixMate | Repair Service Booking Platform",
  description:
    "Book trusted technicians for TV, AC, and home appliance repairs with transparent pricing and secure Stripe payments.",
  icons: {
    icon: [{ url: "/images/icons.jpg", type: "image/jpg" }],
    shortcut: "/images/icons.jpg",
    apple: "/images/icons.jpg",
  },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" richColors duration={1000} />
      </body>
    </html>
  );
}
