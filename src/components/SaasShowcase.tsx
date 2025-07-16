
"use client";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import AnimatedButton from "@/components/AnimatedButton";
import { saasProduct } from "@/constants/saas";
import { ExternalLink, Github, Play, Zap, Shield, Users, TrendingUp } from "lucide-react";
import Image from "next/image";

export const SaasShowcase = () => {
  return (
    // VIVID BACKGROUND SECTION - This is the highlighted section
    <section className="relative py-10 my-10 bg-gradient-to-br rounded-3xl border border-gradient-to-r from-blue-200/30 to-purple-200/30">
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)] rounded-3xl"></div>
      
      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* <span className="text-6xl mb-4 block">{saasProduct.emoji}</span> */}
          <Heading as="h1" className="font-black mb-6">
            Launched <span className="text-blue-950 font-extralight">{saasProduct.name}</span>
          </Heading>
          <Paragraph className="text-lg text-gray-500 max-w-2xl mx-auto">
            {saasProduct.tagline}
          </Paragraph>
        </motion.div>

        {/* Main Content Grid */}
        <div className="space-y-12">
          {/* Top - Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
              <Image
                src={saasProduct.images.hero}
                alt={saasProduct.name}
                width={800}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>

          {/* Bottom - Features and Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left - Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col gap-4"
              >
                <AnimatedButton
                  text="Live Demo"
                  icon={ExternalLink}
                  href={saasProduct.urls.live}
                  target="_blank"
                  className="bg-primary text-white border border-gray-200 px-8 py-4 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};