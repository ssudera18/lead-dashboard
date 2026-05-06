import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@fontsource/inter";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lead Intelligence Dashboard",
  description: "Premium Lead Analytics Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen overflow-hidden bg-[#0B1120] text-white">

        {/* MAIN LAYOUT */}
        <div className="flex h-screen overflow-hidden">

          {/* SIDEBAR */}
          <Sidebar />

          {/* CONTENT */}
          <div className="flex flex-1 flex-col overflow-hidden">

            {/* HEADER */}
            <Header />

            {/* PAGE CONTENT */}
            <main className="flex-1 overflow-y-auto">

              {/* BACKGROUND GLOW */}
              <div className="relative min-h-full">

                <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-3xl" />

                {/* PAGE */}
                <div className="relative z-10 p-6">
                  {children}
                </div>

              </div>

            </main>

            {/* FOOTER */}
            <Footer />

          </div>

        </div>

      </body>
    </html>
  );
}