// "use client";
// import { Container } from "@/components/Container";
// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { Highlight } from "@/components/Highlight";
// import { motion } from "framer-motion";
// import { useState, useEffect, useCallback } from "react";
// import Image from "next/image";
// import { Linkedin, Twitter, Users, Youtube, Github, Book } from "lucide-react";
// import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
// import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";

// // Progressive loading hook
// function useProgressiveLoading() {
//   const [isLoaded, setIsLoaded] = useState(false);
  
//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoaded(true), 100);
//     return () => clearTimeout(timer);
//   }, []);
  
//   return isLoaded;
// }

// // Social Media Component
// function SocialMediaGrid() {
//  const socialLinks = [
//   { 
//      name: 'Github', 
//      icon: Github, 
//      url: 'https://github.com/Indra-photon',
//      color: 'text-white-600 hover:text-white-700',
//      bgColor: 'hover:bg-white-50'
//    },
//    { 
//      name: 'LinkedIn', 
//      icon: Linkedin, 
//      url: 'https://www.linkedin.com/in/indranil-maiti-7542941b7/',
//      color: 'text-blue-600 hover:text-blue-700',
//      bgColor: 'hover:bg-blue-50'
//    },
//    { 
//      name: 'Twitter', 
//      icon: Twitter, 
//      url: 'https://x.com/Nil_phy_dreamer',
//      color: 'text-sky-500 hover:text-sky-600',
//      bgColor: 'hover:bg-sky-50'
//    },
//    { 
//      name: 'Peerlist', 
//      icon: Users, 
//      url: 'https://peerlist.io/indranil/resume',
//      color: 'text-green-600 hover:text-green-700',
//      bgColor: 'hover:bg-green-50'
//    },
//    { 
//      name: 'Blog', 
//      icon: Book, 
//      url: 'https://dev.to/indraphoton',
//      color: 'text-sky-600 hover:text-sky-700',
//      bgColor: 'hover:bg-sky-50'
//    },
//    { 
//      name: 'YouTube', 
//      icon: Youtube, 
//      url: 'https://www.youtube.com/@indranilmaiti842',
//      color: 'text-red-600 hover:text-red-700',
//      bgColor: 'hover:bg-red-50'
//    },
//  ];
 
//  return (
//    <div className="w-full">
//      <h3 className="text-center text-xs font-semibold text-secondary mb-3 tracking-wide uppercase">
//        Connect With Me
//      </h3>
     
//      <div className="grid grid-cols-3 gap-3">
//        {socialLinks.map((social, index) => {
//          const IconComponent = social.icon;
//          return (
//            <motion.a
//              key={social.name}
//              href={social.url}
//              target="_blank"
//              rel="noopener noreferrer"
//              initial={{ opacity: 0, scale: 0.8 }}
//              animate={{ opacity: 1, scale: 1 }}
//              transition={{ duration: 0.3, delay: index * 0.08 }}
//              whileHover={{ 
//                scale: 1.1,
//                y: -3,
//                transition: { duration: 0.2 }
//              }}
//              whileTap={{ scale: 0.95 }}
//              className={`relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg p-3 flex flex-col items-center justify-center h-16 transition-all duration-300 hover:shadow-md group cursor-pointer ${social.bgColor}`}
//            >
//              <IconComponent 
//                size={20} 
//                className={`${social.color} transition-colors duration-200 mb-1`}
//              />
//              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200 text-center leading-tight">
//                {social.name}
//              </span>
//            </motion.a>
//          );
//        })}
       
//        <div className="col-span-3 grid grid-cols-2 gap-3">
//        </div>
//      </div>
//    </div>
//  );
// }

// // Project type
// type Project = {
//   title: string;
//   description: string;
//   tags: string[];
//   src: string;
//   liveUrl?: string;
//   githubUrl?: string;
// };

// const Elegant3DProjects = ({
//   projects,
//   autoplay = false,
// }: {
//   projects: Project[];
//   autoplay?: boolean;
// }) => {
//   const [active, setActive] = useState(0);

//   const handleNext = useCallback(() => {
//     setActive((prev) => (prev + 1) % projects.length);
//   }, [projects.length]);

//   const handlePrev = () => {
//     setActive((prev) => (prev - 1 + projects.length) % projects.length);
//   };

//   useEffect(() => {
//     if (autoplay) {
//       const interval = setInterval(handleNext, 4000);
//       return () => clearInterval(interval);
//     }
//   }, [autoplay, handleNext]);

//   const getCardStyle = (index: number) => {
//     const position = (index - active + projects.length) % projects.length;
    
//     if (position === 0) {
//       return {
//         transform: 'translateX(0%) scale(1) rotateY(0deg)',
//         zIndex: 30,
//         opacity: 1,
//       };
//     } else if (position === 1 || position === projects.length - 1) {
//       const isLeft = position === projects.length - 1;
//       return {
//         transform: `translateX(${isLeft ? '-60%' : '60%'}) scale(0.85) rotateY(${isLeft ? '15deg' : '-15deg'})`,
//         zIndex: 10,
//         opacity: 0.6,
//       };
//     } else {
//       return {
//         transform: 'translateX(0%) scale(0.7) rotateY(0deg)',
//         zIndex: 1,
//         opacity: 0,
//       };
//     }
//   };

//   return (
//     <div className="relative w-full">
//       <div className="relative h-96 mb-8" style={{ perspective: '1000px' }}>
//         <div className="relative w-full h-full flex items-center justify-center">
//           {projects.map((project, index) => {
//     const cardStyle = getCardStyle(index);
    
//     return (
//       <motion.div
//         key={index}
//         className="absolute w-80 h-96 cursor-pointer"
//         style={{
//           transformStyle: 'preserve-3d',
//         }}
//         animate={cardStyle}
//         transition={{
//           duration: 0.6,
//           ease: [0.25, 0.46, 0.45, 0.94],
//         }}
//         onClick={() => setActive(index)}
//       >
//         <div className="relative w-full h-full bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
//           <div className="relative h-40 overflow-hidden">
//             <Image
//               src={project.src}
//               alt={project.title}
//               width={320}
//               height={160}
//               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//           </div>

//           <div className="p-5">
//             <h4 className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors duration-300 mb-3 line-clamp-1">
//               {project.title}
//             </h4>
            
//             <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
//               {project.description}
//             </p>

//             <div className="flex flex-wrap gap-1 mb-4">
//               {project.tags.slice(0, 3).map((tag) => (
//                 <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
//                   {tag}
//                 </span>
//               ))}
//               {project.tags.length > 3 && (
//                 <span className="text-xs text-gray-500">+{project.tags.length - 3}</span>
//               )}
//             </div>

//             {index === active && (
//               <motion.div 
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="flex gap-2"
//               >
//                 {project.liveUrl && (
//                   <a
//                     href={project.liveUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-xs bg-primary text-white px-3 py-2 rounded hover:bg-primary/90 transition-colors"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     Live Demo
//                   </a>
//                 )}
//                 {project.githubUrl && (
//                   <a
//                     href={project.githubUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-xs border border-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-50 transition-colors"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     View Code
//                   </a>
//                 )}
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </motion.div>
//             );
//           })}
//         </div>
//       </div>

//       <motion.div
//         key={active}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="text-center max-w-2xl mx-auto mb-8"
//       >
//         <h3 className="font-bold text-lg text-gray-900 mb-2">
//           {projects[active].title}
//         </h3>
//         <p className="text-sm text-gray-600 leading-relaxed">
//           {projects[active].description}
//         </p>
//       </motion.div>

//       <div className="flex items-center justify-center gap-4">
//         <motion.button
//           onClick={handlePrev}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//         >
//           <IconArrowLeft className="h-4 w-4 text-gray-600" />
//         </motion.button>

//         <div className="flex gap-2">
//           {projects.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setActive(index)}
//               className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                 index === active 
//                   ? 'bg-primary w-6' 
//                   : 'bg-gray-300 hover:bg-gray-400'
//               }`}
//             />
//           ))}
//         </div>

//         <motion.button
//           onClick={handleNext}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//         >
//           <IconArrowRight className="h-4 w-4 text-gray-600" />
//         </motion.button>
//       </div>
//     </div>
//   );
// };

// function MiniProjects() {
//   const projects = [
//     {
//       title: "AI Analytics Dashboard",
//       description: "A comprehensive analytics platform with machine learning insights, real-time data processing, and interactive visualizations built with React and Python.",
//       tags: ["React", "Python", "TensorFlow", "AWS"],
//       src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       liveUrl: "https://ai-dashboard-demo.com",
//       githubUrl: "https://github.com/indranil/ai-dashboard"
//     },
//     {
//       title: "E-Commerce Platform",
//       description: "Scalable microservices architecture with containerized deployment, API gateway, and distributed data management for modern e-commerce solutions.",
//       tags: ["Node.js", "MongoDB", "Docker", "Kubernetes"],
//       src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       liveUrl: "https://ecommerce-demo.com",
//       githubUrl: "https://github.com/indranil/ecommerce-platform"
//     },
//     {
//       title: "Real-Time Collaboration Tool",
//       description: "Multi-user collaboration platform with WebSocket connections, operational transforms, and conflict resolution for seamless team productivity.",
//       tags: ["Next.js", "WebSocket", "Redis", "PostgreSQL"],
//       src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       liveUrl: "https://collab-tool-demo.com",
//       githubUrl: "https://github.com/indranil/collaboration-tool"
//     },
//     {
//       title: "AI Content Generator",
//       description: "Advanced AI-powered content creation platform with natural language processing, automated SEO optimization, and multi-language support.",
//       tags: ["Next.js", "OpenAI", "Supabase", "Stripe"],
//       src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       liveUrl: "https://ai-content-demo.com",
//       githubUrl: "https://github.com/indranil/ai-content-generator"
//     }
//   ];
  
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="font-black text-lg">
//           Featured Projects
//         </h3>
//         <motion.button 
//           whileHover={{ scale: 1.05 }}
//           className="text-xs text-primary font-medium hover:underline"
//         >
//           View All →
//         </motion.button>
//       </div>
      
//       <Elegant3DProjects projects={projects} autoplay={true} />
//     </div>
//   );
// }

// // ONLY DEFAULT EXPORT - Main Homepage Component
// export default function HomePage() {
//   const isLoaded = useProgressiveLoading();
  
//   // Typewriter words config
//   const typewriterWords = [
//     {
//       text: "Build",
//     },
//     {
//       text: "with",
//     },
//     {
//       text: "Indranil",
//       className: "text-blue-500 dark:text-blue-500",
//     },
//   ];
  
//   if (!isLoaded) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
//         />
//       </div>
//     );
//   }
  
//   return (
//     <Container>
//       <div className="h-screen flex flex-col py-6 gap-6">
//         <motion.section 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="flex-1 flex items-center"
//         >
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full">
//             <div className="lg:col-span-3 flex flex-col justify-center space-y-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <Heading as="h1" className="font-black text-3xl md:text-4xl lg:text-5xl leading-tight">
                  
//                     <TypewriterEffectSmooth words={typewriterWords} />
                  
//                 </Heading>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.1 }}
//               >
//                 <Paragraph className="text-lg md:text-xl text-secondary leading-relaxed">
//                   <span className="font-semibold text-gray-900">Full Stack Developer</span> & <span className="font-semibold text-gray-900"> Gen AI developer </span> specializing in 
//                   building scalable web applications and AI-driven solutions.
//                 </Paragraph>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="space-y-3"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//                   <div className="flex items-start gap-2">
//                     <span className="text-blue-500 mt-0.5">🎨</span>
//                     <div>
//                       <span className="text-gray-700">Clean, polished </span>
//                       <span className="font-semibold text-gray-900">UI/UX designs</span>
//                       <span className="text-gray-700"> using </span>
//                       <span className="font-semibold text-gray-900">React</span>
//                       <span className="text-gray-700"> & </span>
//                       <span className="font-semibold text-gray-900">Next.js</span>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-2">
//                     <span className="text-green-500 mt-0.5">⚙️</span>
//                     <div>
//                       <span className="text-gray-700">Robust backend solutions with </span>
//                       <span className="font-semibold text-gray-900">Express.js</span>
//                       <span className="text-gray-700"> & </span>
//                       <span className="font-semibold text-gray-900">Node.js</span>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-2">
//                     <span className="text-purple-500 mt-0.5">🗄️</span>
//                     <div>
//                       <span className="text-gray-700">Database architecture using </span>
//                       <span className="font-semibold text-gray-900">MongoDB</span>
//                       <span className="text-gray-700"> & </span>
//                       <span className="font-semibold text-gray-900">Supabase</span>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-2">
//                     <span className="text-orange-500 mt-0.5">☁️</span>
//                     <div>
//                       <span className="text-gray-700">Deployment on </span>
//                       <span className="font-semibold text-gray-900">VPS</span>
//                       <span className="text-gray-700"> (Linode, DigitalOcean, Hostinger) & </span>
//                       <span className="font-semibold text-gray-900">AWS</span>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-2 md:col-span-2">
//                     <span className="text-red-500 mt-0.5">🤖</span>
//                     <div>
//                       <span className="text-gray-700">Build and integrate </span>
//                       <span className="font-semibold text-gray-900">AI agents</span>
//                       <span className="text-gray-700"> into existing websites for enhanced functionality</span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//               <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.3 }}
//                 className="flex flex-col sm:flex-row gap-3 pt-4"
//               >
//                 <motion.button 
//                   whileHover={{ scale: 1.02, y: -1 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="bg-primary text-white px-6 py-3 text-base font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
//                 >
//                   Let&apos;s Work Together
//                 </motion.button>
                
//                 <motion.button 
//                   whileHover={{ scale: 1.02, y: -1 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="bg-white text-primary border border-gray-200 px-6 py-3 text-base font-medium rounded-lg hover:bg-gray-50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md group"
//                 >
//                   <span>View My Work</span>
//                   <motion.span
//                     className="ml-2 inline-block"
//                     whileHover={{ x: 3 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     →
//                   </motion.span>
//                 </motion.button>
//               </motion.div>
//             </div>

//             <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-6">
//               <motion.div 
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6, delay: 0.4 }}
//                 className="relative group"
//                 >
//                 <motion.div 
//                   className="w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-500"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <Image
//                     src="/images/Indranil.png"
//                     alt="Indranil - Full Stack Developer"
//                     width={176}
//                     height={176}
//                     className="w-full h-full object-cover"
//                     priority
//                   />
//                 </motion.div>
                
//                 <motion.div 
//                   className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-lg -z-10"
//                   animate={{ 
//                     scale: [1, 1.15, 1],
//                     rotate: [0, 360] 
//                   }}
//                   transition={{ 
//                     duration: 8, 
//                     repeat: Infinity, 
//                     ease: "linear" 
//                   }}
//                 />
//                 </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.5 }}
//                 className="w-full max-w-xs"
//               >
//                 <SocialMediaGrid />
//               </motion.div>
//             </div>
//           </div>
//         </motion.section>

//         <motion.section 
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.6 }}
//           className="flex-none"
//         >
//           <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-600 p-6">
//             <MiniProjects />
//           </div>
//         </motion.section>
//       </div>
//     </Container>
//   );
// }


"use client";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Linkedin, Twitter, Users, Youtube, Github, Book, Briefcase, ExternalLink  } from "lucide-react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { Monitor, Server, Database, Cloud, Bot } from "lucide-react";
import ContactModal from "@/components/ContactModal";
import AnimatedButton from "../components/AnimatedButton";

// Progressive loading hook
function useProgressiveLoading() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return isLoaded;
}

// Social Media Component
function SocialMediaGrid() {
 const socialLinks = [
  { 
     name: 'Github', 
     icon: Github, 
     url: 'https://github.com/Indra-photon',
     color: 'text-white-600 hover:text-white-700',
     bgColor: 'hover:bg-white-50'
   },
   { 
     name: 'LinkedIn', 
     icon: Linkedin, 
     url: 'https://www.linkedin.com/in/indranil-maiti-7542941b7/',
     color: 'text-blue-600 hover:text-blue-700',
     bgColor: 'hover:bg-blue-50'
   },
   { 
     name: 'Twitter', 
     icon: Twitter, 
     url: 'https://x.com/Nil_phy_dreamer',
     color: 'text-sky-500 hover:text-sky-600',
     bgColor: 'hover:bg-sky-50'
   },
   { 
     name: 'Peerlist', 
     icon: Users, 
     url: 'https://peerlist.io/indranil/resume',
     color: 'text-green-600 hover:text-green-700',
     bgColor: 'hover:bg-green-50'
   },
   { 
     name: 'Blog', 
     icon: Book, 
     url: 'https://dev.to/indraphoton',
     color: 'text-sky-600 hover:text-sky-700',
     bgColor: 'hover:bg-sky-50'
   },
   { 
     name: 'YouTube', 
     icon: Youtube, 
     url: 'https://www.youtube.com/@indranilmaiti842',
     color: 'text-red-600 hover:text-red-700',
     bgColor: 'hover:bg-red-50'
   },
 ];
 
 return (
   <div className="w-full">
     <h3 className="text-center text-xs font-semibold text-secondary mb-3 tracking-wide uppercase">
       Connect With Me
     </h3>
     
     <div className="grid grid-cols-3 gap-3">
       {socialLinks.map((social, index) => {
         const IconComponent = social.icon;
         return (
           <motion.a
             key={social.name}
             href={social.url}
             target="_blank"
             rel="noopener noreferrer"
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.3, delay: index * 0.08 }}
             whileHover={{ 
               scale: 1.1,
               y: -3,
               transition: { duration: 0.2 }
             }}
             whileTap={{ scale: 0.95 }}
             className={`relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg p-3 flex flex-col items-center justify-center h-16 transition-all duration-300 hover:shadow-md group cursor-pointer ${social.bgColor}`}
           >
             <IconComponent 
               size={20} 
               className={`${social.color} transition-colors duration-200 mb-1`}
             />
             <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200 text-center leading-tight">
               {social.name}
             </span>
           </motion.a>
         );
       })}
       
       <div className="col-span-3 grid grid-cols-2 gap-3">
       </div>
     </div>
   </div>
 );
}

// Project type
type Project = {
  title: string;
  description: string;
  tags: string[];
  src: string;
  liveUrl?: string;
  githubUrl?: string;
};

const Elegant3DProjects = ({
  projects,
  autoplay = false,
}: {
  projects: Project[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + projects.length) % projects.length);
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 4000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext]);

  const getCardStyle = (index: number) => {
    const position = (index - active + projects.length) % projects.length;
    
    if (position === 0) {
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
      };
    } else if (position === 1 || position === projects.length - 1) {
      const isLeft = position === projects.length - 1;
      return {
        transform: `translateX(${isLeft ? '-60%' : '60%'}) scale(0.85) rotateY(${isLeft ? '15deg' : '-15deg'})`,
        zIndex: 10,
        opacity: 0.6,
      };
    } else {
      return {
        transform: 'translateX(0%) scale(0.7) rotateY(0deg)',
        zIndex: 1,
        opacity: 0,
      };
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative h-[28rem] mb-8" style={{ perspective: '1000px' }}>
        <div className="relative w-full h-full flex items-center justify-center">
          {projects.map((project, index) => {
            const cardStyle = getCardStyle(index);
            
            return (
              <motion.div
                key={index}
                className="absolute w-80 h-[28rem] cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={cardStyle}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                onClick={() => setActive(index)}
              >
                {/* PREMIUM CARD DESIGN */}
                <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group backdrop-blur-sm">
                  {/* ENHANCED IMAGE SECTION */}
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={project.src}
                      alt={project.title}
                      width={320}
                      height={160}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* PREMIUM OVERLAY INDICATOR */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* PREMIUM CARD CONTENT */}
                  <div className="p-6 relative">
                    {/* SUBTLE BACKGROUND PATTERN */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <h4 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 group-hover:text-primary transition-all duration-300 mb-3 line-clamp-1 group-hover:scale-[1.02] origin-left">
                        {project.title}
                      </h4>

                      {/* PREMIUM TAGS */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span 
                            key={tag} 
                            className="text-xs sm:text-sm bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-3 py-1.5 rounded-full font-medium border border-gray-200/50 hover:shadow-sm transition-all duration-200 hover:scale-105"
                            style={{
                              animationDelay: `${tagIndex * 100}ms`
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs sm:text-sm text-gray-500 font-medium px-2 py-1.5">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* PREMIUM BUTTONS - NOW ALWAYS VISIBLE */}
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                        className="flex gap-3"
                      >
                          {/* {project.liveUrl && (
                            <motion.a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] hover:from-blue-700 hover:to-blue-800"
                              onClick={(e) => e.stopPropagation()}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="flex items-center justify-center gap-2">
                                Live Demo
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </span>
                            </motion.a>
                          )} */}
                          {project.liveUrl && (
                            <AnimatedButton
                              text="Live Demo"
                              icon={ExternalLink}
                              href={project.liveUrl}
                              target="_blank"
                              variant="custom"
                              size="sm"
                              stopPropagation={true}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl rounded-xl text-sm sm:text-base px-4 py-2.5 font-semibold"
                            />
                          )}
                        </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* UPDATED PROJECT DESCRIPTION WITH CONSISTENT TEXT SIZING */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-2xl mx-auto mb-8"
      >
        <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 mb-3">
          {projects[active].title}
        </h3>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
          {projects[active].description}
        </p>
      </motion.div>

      {/* NAVIGATION CONTROLS */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          onClick={handlePrev}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <IconArrowLeft className="h-4 w-4 text-gray-600" />
        </motion.button>

        <div className="flex gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === active 
                  ? 'bg-primary w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <IconArrowRight className="h-4 w-4 text-gray-600" />
        </motion.button>
      </div>
    </div>
  );
};

function MiniProjects() {
  const projects = [
    {
      title: "AI Analytics Dashboard",
      description: "A comprehensive analytics platform with machine learning insights, real-time data processing, and interactive visualizations built with React and Python.",
      tags: ["React", "Python", "TensorFlow", "AWS"],
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      liveUrl: "https://ai-dashboard-demo.com",
      githubUrl: "https://github.com/indranil/ai-dashboard"
    },
    {
      title: "E-Commerce Platform",
      description: "Scalable microservices architecture with containerized deployment, API gateway, and distributed data management for modern e-commerce solutions.",
      tags: ["Node.js", "MongoDB", "Docker", "Kubernetes"],
      src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      liveUrl: "https://ecommerce-demo.com",
      githubUrl: "https://github.com/indranil/ecommerce-platform"
    },
    {
      title: "Real-Time Collaboration Tool",
      description: "Multi-user collaboration platform with WebSocket connections, operational transforms, and conflict resolution for seamless team productivity.",
      tags: ["Next.js", "WebSocket", "Redis", "PostgreSQL"],
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      liveUrl: "https://collab-tool-demo.com",
      githubUrl: "https://github.com/indranil/collaboration-tool"
    },
    {
      title: "AI Content Generator",
      description: "Advanced AI-powered content creation platform with natural language processing, automated SEO optimization, and multi-language support.",
      tags: ["Next.js", "OpenAI", "Supabase", "Stripe"],
      src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      liveUrl: "https://ai-content-demo.com",
      githubUrl: "https://github.com/indranil/ai-content-generator"
    }
  ];
  
  return (
    <div>
      {/* SECTION HEADER - Now uses consistent Heading component */}
      <div className="flex items-center justify-between mb-8">
        <Heading as="h2" className="font-black text-lg sm:text-xl md:text-2xl lg:text-3xl">
          Featured Projects
        </Heading>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          className="text-sm sm:text-base text-primary font-medium hover:underline"
        >
          View All →
        </motion.button>
      </div>
      
      <Elegant3DProjects projects={projects} autoplay={true} />
    </div>
  );
}

// ONLY DEFAULT EXPORT - Main Homepage Component
export default function HomePage() {
  const isLoaded = useProgressiveLoading();
  
  // Typewriter words config
  const typewriterWords = [
    {
      text: "Build",
    },
    {
      text: "with",
    },
    {
      text: "Indranil",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  
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
    <Container>
      <div className=" flex flex-col py-6 gap-6">
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex items-center"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full">
            {/* <div className="lg:col-span-3 flex flex-col justify-center space-y-4">
             
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Heading as="h1" className="font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
                  <TypewriterEffectSmooth words={typewriterWords} />
                </Heading>
                <p>Let us do some amazing work together f0r ypur brand</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Paragraph className="text-lg md:text-xl text-secondary leading-relaxed">
                  <span className="font-semibold text-gray-900">Full Stack Developer</span> & <span className="font-semibold text-gray-900"> Gen AI developer </span> specializing in 
                  building scalable web applications and AI-driven solutions.
                </Paragraph>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Monitor className="text-blue-500 mt-0.5 w-4 h-4 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700">Clean, polished </span>
                      <span className="font-semibold text-gray-900">UI/UX designs</span>
                      <span className="text-gray-700"> using </span>
                      <span className="font-semibold text-gray-900">React</span>
                      <span className="text-gray-700"> & </span>
                      <span className="font-semibold text-gray-900">Next.js</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Server className="text-green-500 mt-0.5 w-4 h-4 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700">Robust backend solutions with </span>
                      <span className="font-semibold text-gray-900">Express.js</span>
                      <span className="text-gray-700"> & </span>
                      <span className="font-semibold text-gray-900">Node.js</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Database className="text-purple-500 mt-0.5 w-4 h-4 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700">Database architecture using </span>
                      <span className="font-semibold text-gray-900">MongoDB</span>
                      <span className="text-gray-700"> & </span>
                      <span className="font-semibold text-gray-900">Supabase</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Cloud className="text-orange-500 mt-0.5 w-4 h-4 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700">Deployment on </span>
                      <span className="font-semibold text-gray-900">VPS</span>
                      <span className="text-gray-700"> (Linode, DigitalOcean, Hostinger) & </span>
                      <span className="font-semibold text-gray-900">AWS</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 md:col-span-2">
                    <Bot className="text-red-500 mt-0.5 w-4 h-4 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700">Build and integrate </span>
                      <span className="font-semibold text-gray-900">AI agents</span>
                      <span className="text-gray-700"> into existing websites for enhanced functionality</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 pt-4"
              >
                <motion.button 
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary text-white px-6 py-3 text-base font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Let&apos;s Work Together
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-primary border border-gray-200 px-6 py-3 text-base font-medium rounded-lg hover:bg-gray-50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <span>View My Work</span>
                  <motion.span
                    className="ml-2 inline-block"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.div>
            </div> */}

            <div className="lg:col-span-3 flex flex-col justify-center space-y-6">
              {/* MOBILE-OPTIMIZED BRANDING SECTION */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Heading as="h1" className="font-black">
                  <TypewriterEffectSmooth words={typewriterWords} />
                </Heading>
              </motion.div>

              {/* MAIN DESCRIPTION - Now properly sized relative to branding */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Paragraph className="text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-900">Full Stack Developer</span> & <span className="font-semibold text-gray-900">Gen AI developer</span> specializing in 
                  building scalable web applications and AI-driven solutions.
                </Paragraph>
              </motion.div>

              {/* FEATURE POINTS - Properly scaled */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
                  <div className="flex items-start gap-3">
                    <Monitor className="text-blue-500 mt-1 w-5 h-5 flex-shrink-0" />
                    <div className="leading-relaxed">
                      <span className="text-gray-700">Clean, polished </span>
                      <span className="font-semibold text-gray-900">UI/UX designs</span>
                      <span className="text-gray-700"> using </span>
                      <span className="font-semibold text-gray-900">React</span>
                      <span className="text-gray-700"> & </span>
                      <span className="font-semibold text-gray-900">Next.js</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Server className="text-green-500 mt-1 w-5 h-5 flex-shrink-0" />
                    <div className="leading-relaxed">
                      <span className="text-gray-700">Robust backend solutions with </span>
                      <span className="font-semibold text-gray-900">Express.js</span>
                      <span className="text-gray-700"> & </span>
                      <span className="font-semibold text-gray-900">Node.js</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Database className="text-purple-500 mt-1 w-5 h-5 flex-shrink-0" />
                    <div className="leading-relaxed">
                      <span className="text-gray-700">Database architecture using </span>
                      <span className="font-semibold text-gray-900">MongoDB</span>
                      <span className="text-gray-700"> & </span>
                      <span className="font-semibold text-gray-900">Supabase</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Cloud className="text-orange-500 mt-1 w-5 h-5 flex-shrink-0" />
                    <div className="leading-relaxed">
                      <span className="text-gray-700">Deployment on </span>
                      <span className="font-semibold text-gray-900">VPS</span>
                      <span className="text-gray-700"> (Linode, DigitalOcean, Hostinger) & </span>
                      <span className="font-semibold text-gray-900">AWS</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:col-span-2">
                    <Bot className="text-red-500 mt-1 w-5 h-5 flex-shrink-0" />
                    <div className="leading-relaxed">
                      <span className="text-gray-700">Build and integrate </span>
                      <span className="font-semibold text-gray-900">AI agents</span>
                      <span className="text-gray-700"> into existing websites for enhanced functionality</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* BUTTONS - Better spacing and sizing */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-6"
              >
                {/* <ContactModal 
                  triggerText="Get In Touch" 
                  triggerClassName="your-custom-classes" 
                /> */}
                <ContactModal />
                {/* <motion.button 
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-primary border border-gray-200 px-8 py-4 text-base font-medium rounded-lg hover:bg-gray-50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <span>View My Work</span>
                  <motion.span
                    className="ml-2 inline-block"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </motion.button> */}
                <AnimatedButton text = 'View My Work' icon= {Briefcase} href = '/projects' className = 'bg-black/80 text-primary border border-gray-200 px-8 py-4 text-base font-medium rounded-lg hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md group' />
              </motion.div>
            </div>

            {/* <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative group"
                >
                <motion.div 
                  className="w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-500"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/Indranil.png"
                    alt="Indranil - Full Stack Developer"
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                    priority
                  />
                </motion.div>
                
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-lg -z-10"
                  animate={{ 
                    scale: [1, 1.15, 1],
                    rotate: [0, 360] 
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
                </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="w-full max-w-xs"
              >
                <SocialMediaGrid />
              </motion.div>
            </div> */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center space-y-6">
              {/* Profile Image - Desktop Only */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative group"
              >
                <motion.div 
                  className="w-44 h-44 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-500"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/Indranil.png"
                    alt="Indranil - Full Stack Developer"
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                    priority
                  />
                </motion.div>
                
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-lg -z-10"
                  animate={{ 
                    scale: [1, 1.15, 1],
                    rotate: [0, 360] 
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
              </motion.div>

              {/* Social Media Grid - Desktop Only */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="w-full max-w-xs"
              >
                <SocialMediaGrid />
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex-none"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-600 p-6">
            <MiniProjects />
          </div>
        </motion.section>
      </div>
    </Container>
  );
}