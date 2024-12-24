import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { CookieBanner } from "@/components/cookie-banner";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ulocat.com"),
  title: {
    default: "ULOCAT – AI-Powered Natural Language Translation",
    template: "%s | ULOCAT",
  },
  alternates: {
    canonical: 'https://desktop.ulocat.com',
    mobile: 'https://ulocat.com',
  },
  description:
    "Experience seamless, natural language translation powered by advanced AI. ULOCAT helps you communicate effortlessly across languages with high accuracy and cultural context.",
  keywords: [
    "language translation",
    "AI translation",
    "natural language processing",
    "real-time translation",
    "voice translation",
    "cultural context translation",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ulocat.com",
    title: "ULOCAT – AI-Powered Natural Language Translation",
    description:
      "Experience seamless, natural language translation powered by advanced AI. Break language barriers with accurate, context-aware translations.",
    siteName: "ULOCAT",
  },
  twitter: {
    card: "summary_large_image",
    title: "ULOCAT – AI-Powered Natural Language Translation",
    description:
      "Experience seamless, natural language translation powered by advanced AI. Break language barriers with accurate, context-aware translations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7026535539086017"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JPBWCGZ3MK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Default to denied
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied'
            });

            gtag('config', 'G-JPBWCGZ3MK', {
              'anonymize_ip': true
            });
          `}
        </Script>
        <link rel="canonical" href="https://ulocat.com" />
      </head>
      <body className={inter.className}>
        <CookieBanner />
        <div className="fixed inset-x-0 top-0 z-50 bg-zinc-50">
          <Header />
        </div>
        <div className="pt-[65px]">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
