import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MedXRay AI - Chest X-Ray Analysis & Reporting",
  description:
    "AI-powered chest X-ray analysis tool for medical professionals, providing instant detection of abnormalities with detailed classification results.",
  metadataBase: new URL("https://medxray-ai.vercel.app"),
  openGraph: {
    title: "MedXRay AI - Chest X-Ray Analysis & Reporting",
    description:
      "AI-powered chest X-ray analysis tool for medical professionals",
    url: "https://medxray-ai.vercel.app",
    siteName: "MedXRay AI",
    images: [
      {
        url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedXRay AI - Chest X-Ray Analysis & Reporting",
    description:
      "AI-powered chest X-ray analysis tool for medical professionals",
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=630&fit=crop",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <TempoInit />
      </body>
    </html>
  );
}
