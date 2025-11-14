// src/app/HomePage.tsx
"use client";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ProjectCardStack } from "@/components/ui/project-card-stack";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import { SaasShowcase } from "@/components/SaasShowcase";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { ProfileSection } from "@/components/ProfileSection";
import HeroHome from "@/components/HeroHome";
import Head from "next/head";
// import { MiniProjects } from "@/components/MiniProjects";

// Progressive loading hook
function useProgressiveLoading() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return isLoaded;
}


export default function HomePage() {
  const isLoaded = useProgressiveLoading();
  
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }
  
  return (
    <Container className="">
      <div className="flex flex-col py-4 px-4 sm:py-6 gap-4 sm:gap-6 bg-black rounded-lg relative max-w-7xl mx-auto">
        {/* <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-neutral-700 via-neutral-50 to-neutral-700"></div>
      <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-neutral-700 via-neutral-50 to-neutral-700"></div> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className=" relative"
        >
          <Heading as="h1" className="text-white">
              Full Stack & Gen AI <span className="">Developer</span>
          </Heading>
          <Paragraph className="text-lg text-gray-200 mx-auto text-left">
            I love to build things that make a difference
          </Paragraph>
          <div className="flex mt-4 space-x-2 mb-2">
            <button className="btn rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-400 px-3 py-1">Working as a freelance developer</button>
          </div>

          <div className="absolute right-0 bottom-0 h-px w-full bg-gradient-to-r from-neutral-700 via-neutral-50 to-neutral-700"></div>
        </motion.div>

        {/* Hero section */}
        <HeroHome />
        
      </div>
    </Container>
  );
}