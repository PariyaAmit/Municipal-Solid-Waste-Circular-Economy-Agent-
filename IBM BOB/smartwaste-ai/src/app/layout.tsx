import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartWaste AI — Municipal Waste Management Platform",
  description:
    "AI-powered municipal waste management platform for collection optimization, citizen grievances, segregation compliance, and ward-level intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>{children}</body>
    </html>
  );
}
