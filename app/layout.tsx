import { LanguageProvider } from "@/context/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Africa Health",
  description: "Free AI-powered symptom assessment for Sub-Saharan Africa — available in English, French, Swahili, Hausa, and Amharic.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Africa Health",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#050A14" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Africa Health" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <ServiceWorkerRegistrar />
        <ErrorBoundary>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
