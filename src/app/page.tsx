// src/app/page.tsx
import { Metadata } from "next";
import HomePage from "./HomePage";

// export const metadata: Metadata = {
//   metadataBase: new URL("https://www.indrabuildswebsites.com/"),
//   title: "Indranil Maiti | Full Stack & GenAI Developer",
//   description: "Indranil Maiti is a Full Stack Developer and Gen AI specialist with expertise in React, Next.js, Node.js, and AI integration for scalable web applications.",
//   keywords: "Indranil Maiti, Full Stack Developer, React Developer, Next.js, GenAI, AI Integration, Web Development Freelance full stack web developer, scalable web applications, modern web technologies. I am based on India and Poland",
//   openGraph: {
//     title: "Indranil Maiti | Full Stack & GenAI Developer",
//     description: "Building scalable web applications and AI-driven solutions with modern technologies.",
//     images: [
//       {
//         url: "/images/Indranil_2.jpg",
//         width: 1200,
//         height: 630,
//         alt: "Indranil Maiti - Full Stack Developer"
//       }
//     ],
//     type: "website",
//     locale: "en_US"
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Indranil Maiti | Full Stack & GenAI Developer",
//     description: "Building scalable web applications and AI-driven solutions with modern technologies.",
//     images: ["/images/Indranil_2.jpg"]
//   },
//   robots: {
//     index: true,
//     follow: true
//   },
//   authors: [
//     {
//       name: "Indranil Maiti",
//       url: "https://github.com/Indra-photon"
//     }
//   ]
// };

export default function Page() {
  return <HomePage />;
}