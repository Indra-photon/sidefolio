// // components/ui/project-card-stack.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import Image from "next/image";

// let interval: any;

// export type Project = {
//   id: number;
//   title: string;
//   description: string;
//   tags: string[];
//   src: string;
//   liveUrl?: string;
//   githubUrl?: string;
// };

// export const ProjectCardStack = ({
//   items,
//   offset,
//   scaleFactor,
//   onKnowMore,
// }: {
//   items: Project[];
//   offset?: number;
//   scaleFactor?: number;
//   onKnowMore: (project: Project) => void;
// }) => {
//   const CARD_OFFSET = offset || 15;
//   const SCALE_FACTOR = scaleFactor || 0.05;
//   const [projects, setProjects] = useState<Project[]>(items);

//   useEffect(() => {
//     startFlipping();
//     return () => clearInterval(interval);
//   }, []);
  
//   const startFlipping = () => {
//     interval = setInterval(() => {
//       setProjects((prevProjects: Project[]) => {
//         const newArray = [...prevProjects];
//         newArray.unshift(newArray.pop()!);
//         return newArray;
//       });
//     }, 5000);
//   };

//   return (
//     <div className="relative h-[500px] w-full max-w-[600px] mx-auto">
//       {projects.map((project, index) => {
//         return (
//           <motion.div
//             key={project.id}
//             className="absolute bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-white/[0.1] w-full h-[400px] flex flex-col"
//             style={{
//               transformOrigin: "top center",
//             }}
//             animate={{
//               top: index * -CARD_OFFSET,
//               scale: 1 - index * SCALE_FACTOR,
//               zIndex: projects.length - index,
//             }}
//           >
//             {/* Image (80% of card) */}
//             <div className="relative h-[80%] w-full">
//               <Image
//                 src={project.src}
//                 alt={project.title}
//                 fill
//                 className="object-cover"
//               />
              
//               {/* Know More Button */}
//               <div className="absolute bottom-4 right-4">
//                 <button 
//                   onClick={() => onKnowMore(project)}
//                   className="bg-white/90 backdrop-blur-sm hover:bg-white text-primary px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm font-medium"
//                 >
//                   Know More
//                 </button>
//               </div>
//             </div>
            
//             {/* Card Footer */}
//             <div className="p-4 h-[20%] flex items-center">
//               <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
              
//               <div className="ml-auto flex gap-2">
//                 {project.tags.slice(0, 2).map((tag) => (
//                   <span 
//                     key={tag} 
//                     className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//                 {project.tags.length > 2 && (
//                   <span className="text-xs text-gray-500">+{project.tags.length - 2}</span>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// };


// components/ui/project-card-stack.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedButton from "../AnimatedButton";
import { Briefcase } from "lucide-react";

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
  const CARD_OFFSET = offset || 15;
  const SCALE_FACTOR = scaleFactor || 0.05;
  const [projects, setProjects] = useState<Project[]>(items);
  const [activeIndex, setActiveIndex] = useState(-1);

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
    <div className="relative h-[500px] w-full max-w-[600px] mx-auto">
      {projects.map((project, index) => {
        return (
          <motion.div
            key={project.id}
            className="absolute w-full h-[400px] cursor-pointer"
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
                <div className="relative h-[80%] w-full">
                  <Image
                    src={project.src}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                </div>
                
                {/* Card Footer with subtle gradient */}
                <div className="p-4 h-[20%] flex items-center bg-gradient-to-r from-white/80 to-gray-50/80">
                  <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
                  
                  <div className="ml-auto flex gap-2">
                     <AnimatedButton 
                        text="View Project" 
                        icon={Briefcase} 
                        onClick={() => onKnowMore(project)}
                        stopPropagation={true}
                        className="bg-black/80 text-primary border border-gray-200 px-4 py-2 text-sm font-medium rounded-lg hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md" 
                      />
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