// components/ui/project-card-stack.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedButton from "../AnimatedButton";
import { Briefcase } from "lucide-react";
import Link from 'next/link'


let interval: any;

export type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  src: string;
  liveUrl?: string;
  githubUrl?: string;
};

export const ProjectCardStack = ({
  items,
  offset,
  scaleFactor,
  onKnowMore,
}: {
  items: Project[];
  offset?: number;
  scaleFactor?: number;
  onKnowMore: (project: Project) => void;
}) => {
  const [projects, setProjects] = useState<Project[]>(items);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection hook
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Now we can use isMobile after it's declared
  const CARD_OFFSET = offset || (isMobile ? 8 : 15);
  const SCALE_FACTOR = scaleFactor || (isMobile ? 0.03 : 0.05);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, []);
  
  const startFlipping = () => {
    interval = setInterval(() => {
      setProjects((prevProjects: Project[]) => {
        const newArray = [...prevProjects];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);
  };

  return (
    <div className="relative h-[350px] sm:h-[400px] md:h-[500px] w-full max-w-[320px] sm:max-w-[400px] md:max-w-[600px] mx-auto">
      {projects.map((project, index) => {
        return (
          <motion.div
            key={project.id}
            className="absolute w-full h-[280px] sm:h-[320px] md:h-[400px] cursor-pointer"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: projects.length - index,
            }}
            whileHover={{
              rotateY: 5,
              rotateX: -5,
              scale: (1 - index * SCALE_FACTOR) * 1.05,
              transition: { duration: 0.3 }
            }}
            onHoverStart={() => setActiveIndex(index)}
            onHoverEnd={() => setActiveIndex(-1)}
          >
            {/* Card with gradient border and backdrop filter */}
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl 
                          border border-gray-200/40 dark:border-white/[0.1] 
                          bg-gradient-to-br from-white to-gray-50/50 
                          backdrop-blur-sm
                          flex flex-col
                          transition-all duration-300
                          hover:shadow-2xl">
              
              {/* Stylish gradient background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-white to-blue-100/30 opacity-70"></div>
              
              {/* Card content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Image (80% of card) */}
                <div className="relative h-[75%] sm:h-[80%] w-full flex items-center justify-center">
                  <img
                    src={project.src}
                    alt={project.title}
                    className="w-[90%] h-[85%] sm:h-full sm:w-full"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                </div>
                
                {/* Card Footer with subtle gradient */}
                <div className="p-2 sm:p-4 h-[25%] sm:h-[20%] flex items-center bg-gradient-to-r from-white/80 to-gray-50/80">
                  
                  <div className="ml-auto flex gap-2">
                  <Link href = {project.liveUrl || ""}>
                     <AnimatedButton 
                        text="View Project" 
                        icon={Briefcase} 
                        // onClick={() => onKnowMore(project)}
                        stopPropagation={true}
                        className="bg-black/80 text-primary border border-gray-200 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-lg hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md" 
                      />
                  </Link>
                  </div>
                </div>
              </div>
              
              {/* 3D effect highlight edge */}
              <motion.div 
                className="absolute inset-0 rounded-xl border-2 border-transparent"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: activeIndex === index ? 1 : 0,
                  boxShadow: activeIndex === index ? "0 0 30px 5px rgba(0, 0, 0, 0.05)" : "none" 
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
