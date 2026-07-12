import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "SourceBouncer — Paid Verification Agent for the CROO Economy",
  description: "A callable verification agent that other agents can hire through CAP to verify claims, inspect source quality, and return trust-scored evidence packages.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f] text-[#e8e8ed]">
        <nav className="border-b border-[#1e293b] bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-lg font-bold">SourceBouncer</span>
              </a>
              <div className="hidden md:flex items-center gap-6">
                <a href="/demo" className="text-sm text-[#a0a0b0] hover:text-white transition-colors">Demo</a>
                <a href="/pricing" className="text-sm text-[#a0a0b0] hover:text-white transition-colors">Pricing</a>
                <a href="/audit" className="text-sm text-[#a0a0b0] hover:text-white transition-colors">Audit</a>
                <a href="/ask" className="text-sm text-[#a0a0b0] hover:text-white transition-colors">Ask</a>
                <a href="/architecture" className="text-sm text-[#a0a0b0] hover:text-white transition-colors">Architecture</a>
              </div>
              <a href="/demo" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Try Demo
              </a>
            </div>
          </div>
        </nav>
        <ErrorBoundary>
          <main>{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
