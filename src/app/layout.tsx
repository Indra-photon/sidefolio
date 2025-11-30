import { Sidebar } from "@/components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";
import { Footer } from "@/components/Footer";
import { GoogleTagManager } from '@next/third-parties/google'
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.indrabuildswebsites.com/"),
  title: "Indranil Maiti | Full Stack & GenAI Developer",
  description: "I am a Full Stack Developer and Gen AI specialist with expertise in React, Next.js, Node.js, and AI integration for scalable web applications. I build modern, responsive, and fast websites that drive results. I focus on microinteractions, animations , and user-centric design to create engaging digital experiences. I integrate AI technologies, Google Search Console, Google Analytics, Google Tag Manager, and SEO best practices to enhance website performance and user engagement.",
  keywords: [
    "GenAI developer",
    "Full stack web developer",
    "Google Analytics",
    "Google Tag Manager",
    "Google Search Console",
    "SEO specialist",
    "React developer",
    "Next.js developer",
    "Node.js developer",
    "AI integration",
    "Scalable web applications",
    "Modern web technologies",
    "Freelance developer",
    "Responsive web design",
    "Web development services",
    "Digital experiences",
    "User-centric design",
    "Microinteractions",
    "Web animations"
  ],
  openGraph: {
    title: "Indranil Maiti | Full Stack & GenAI Developer",
    description: "I am a Full Stack Developer and Gen AI specialist with expertise in React, Next.js, Node.js, and AI integration for scalable web applications. I build modern, responsive, and fast websites that drive results. I focus on microinteractions, animations , and user-centric design to create engaging digital experiences.",
    images: [
      {
        url: "/images/Indranil_2.jpg",
        width: 1200,
        height: 630,
        alt: "Indranil Maiti - Full Stack Developer and GenAI Specialist"
      }
    ],
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Indranil Maiti | Full Stack & GenAI Developer",
    description: "Building scalable web applications and AI-driven solutions with modern technologies.",
    images: ["/images/Indranil_2.jpg"],
    creator: "@Nil_phy_dreamer"
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
  ],
  verification: {
    google: "nRI3uI23PmnAb9gJVCWJI0_OKTObahkZIlcSwnhmqJo"
  }
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
        <div className="lg:pl-2 lg:pt-2 bg-black flex-1 overflow-y-auto">
          <div className="flex-1 bg-black min-h-screen lg:rounded-tl-xl overflow-y-auto">
            {children}
          </div>
        </div>
        <GoogleTagManager gtmId="GTM-PHTQSD64" />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
