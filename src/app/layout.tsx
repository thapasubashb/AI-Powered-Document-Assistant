import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AmbientBackground } from "@/components/AmbientBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VikSub — AI Document Assistant",
  description:
    "Upload a PDF, ask questions, get grounded answers with page citations. Powered by retrieval-augmented generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <AmbientBackground />
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}