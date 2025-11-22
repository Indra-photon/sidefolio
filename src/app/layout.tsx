import { Sidebar } from "@/components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";
import { Footer } from "@/components/Footer";
import { GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.indrabuildswebsites.com/"),
  title: "Indranil Maiti | Full Stack & GenAI Developer",
  description: "Indranil Maiti is a Full Stack Developer and Gen AI specialist with expertise in React, Next.js, Node.js, and AI integration for scalable web applications.",
  keywords: "Indranil Maiti, Full Stack Developer, React Developer, Next.js, GenAI, AI Integration, Web Development Freelance full stack web developer, scalable web applications, modern web technologies. I am based on India and Poland",
  openGraph: {
    title: "Indranil Maiti | Full Stack & GenAI Developer",
    description: "Building scalable web applications and AI-driven solutions with modern technologies.",
    images: [
      {
        url: "/images/Indranil_2.jpg",
        width: 1200,
        height: 630,
        alt: "Indranil Maiti - Full Stack Developer"
      }
    ],
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Indranil Maiti | Full Stack & GenAI Developer",
    description: "Building scalable web applications and AI-driven solutions with modern technologies.",
    images: ["/images/Indranil_2.jpg"]
  },
  robots: {
    index: true,
    follow: true
  },
  authors: [
    {
      name: "Indranil Maiti",
      url: "https://github.com/Indra-photon"
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          inter.className,
          "flex antialiased h-screen overflow-hidden bg-gray-100"
        )}
      >
        <Sidebar />
        <div className="lg:pl-2 lg:pt-2 bg-gray-900 flex-1 overflow-y-auto">
          <div className="flex-1 bg-black min-h-screen lg:rounded-tl-xl overflow-y-auto">
            {children}
          </div>
        </div>
        <GoogleTagManager gtmId="GTM-PHTQSD64" />
      </body>
    </html>
  );
}
