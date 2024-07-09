import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] });
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"


export const metadata: Metadata = {
  title: "study-hub",
  description: "AI-powered space for enhanced learning",
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: 'https://jvpehndoafryctlriuse.supabase.co/storage/v1/object/public/qwertymno/logoStud.png',
        href: 'https://jvpehndoafryctlriuse.supabase.co/storage/v1/object/public/qwertymno/logoStud.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: 'https://jvpehndoafryctlriuse.supabase.co/storage/v1/object/public/qwertymno/logoStud.png',
        href: 'https://jvpehndoafryctlriuse.supabase.co/storage/v1/object/public/qwertymno/logoStud.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
