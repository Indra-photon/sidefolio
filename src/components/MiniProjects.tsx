"use client";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import AnimatedButton from "@/components/AnimatedButton";
import { miniProjects, miniProjectsShowcase } from "@/constants/miniProjects";
import { ExternalLink, Github, Play, Zap, Shield, Users, TrendingUp, Code, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const MiniProjects = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    // VIVID BACKGROUND SECTION - This is the highlighted section
    <div className="relative py-20 my-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000" />
      
      <Container className="relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="text-6xl mb-4">{miniProjectsShowcase.emoji}</div>
            <Heading className="text-4xl font-black text-white mb-4">
              Featured <Highlight className="text-yellow-400">Mini Projects</Highlight>
            </Heading>
            <Paragraph className="text-xl text-blue-100 max-w-2xl mx-auto">
              {miniProjectsShowcase.tagline}
            </Paragraph>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {miniProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className="group"
              >
                {/* Project Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 h-full">
                  {/* Project Image */}
                  <div className="relative mb-6 rounded-xl overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={240}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Live indicator */}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Live
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                      <p className="text-purple-200 text-sm font-medium">{project.subtitle}</p>
                    </div>
                    
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Project Metrics */}
                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/20">
                      {Object.entries(project.metrics).map(([key, value], metricIndex) => (
                        <div key={metricIndex} className="text-center">
                          <div className="text-white font-bold text-sm">{value}</div>
                          <div className="text-blue-200 text-xs capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <AnimatedButton
                        text="View Live"
                        icon={ExternalLink}
                        href={project.liveUrl}
                        target="_blank"
                        variant="primary"
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-none"
                      />
                      {project.githubUrl && (
                        <AnimatedButton
                          text="GitHub"
                          icon={Github}
                          href={project.githubUrl}
                          target="_blank"
                          variant="secondary"
                          size="sm"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Why These Projects Stand Out
              </h3>
              <div className="space-y-4">
                {miniProjectsShowcase.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mt-1">
                      {index === 0 && <Sparkles className="w-4 h-4 text-white" />}
                      {index === 1 && <Code className="w-4 h-4 text-white" />}
                      {index === 2 && <Shield className="w-4 h-4 text-white" />}
                      {index === 3 && <TrendingUp className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{highlight}</h4>
                      <p className="text-blue-100 text-sm mt-1">
                        {index === 0 && "Leveraging cutting-edge AI technologies for innovative solutions"}
                        {index === 1 && "End-to-end development with modern tech stacks"}
                        {index === 2 && "Intuitive interfaces with exceptional user experience"}
                        {index === 3 && "Built for growth with performance optimization"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - CTA Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Build Something Amazing?
                </h3>
                <p className="text-blue-100 mb-6">
                  Let's discuss your next project and create something that makes a difference.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <AnimatedButton
                    text="View All Projects"
                    icon={Play}
                    href="/projects"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-none"
                  />
                  <AnimatedButton
                    text="Get In Touch"
                    icon={Zap}
                    href="/contact"
                    variant="secondary"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};