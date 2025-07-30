// // src/app/HomePage.tsx
// "use client";
// import { Container } from "@/components/Container";
// import { Heading } from "@/components/Heading";
// import { Paragraph } from "@/components/Paragraph";
// import { Highlight } from "@/components/Highlight";
// import { motion } from "framer-motion";
// import { useState, useEffect, useCallback } from "react";
// import Image from "next/image";
// import { Linkedin, Twitter, Users, Youtube, Github, Book, Briefcase, ExternalLink } from "lucide-react";
// import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
// import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
// import { Monitor, Server, Database, Cloud, Bot } from "lucide-react";
// import ContactModal from "@/components/ContactModal";
// import AnimatedButton from "../components/AnimatedButton";
// import { ProjectCardStack } from "@/components/ui/project-card-stack";
// import ProjectDetailModal from "@/components/ProjectDetailModal";
// import { SaasShowcase } from "@/components/SaasShowcase";

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
//   id: number;
//   title: string;
//   description: string;
//   tags: string[];
//   src: string;
//   liveUrl?: string;
//   githubUrl?: string;
// };

// function MiniProjects() {
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const projects = [
//     {
//       id: 1,
//       title: "Toonytalesworld: AI powered SaaS for Kids",
//       description: "A comprehensive analytics platform with machine learning insights, real-time data processing, and interactive visualizations built with React and Python.",
//       tags: ["React", "Python", "TensorFlow", "AWS"],
//       src: "/../images/toonytalesworld.webp",
//       liveUrl: "https://www.toonytalesworld.com/",
//     },
//     {
//       id: 2,
//       title: "Fraterny: An exclusive Villa for your family",
//       description: "A comprehensive analytics platform with machine learning insights, real-time data processing, and interactive visualizations built with React and Python.",
//       tags: ["React", "Python", "TensorFlow", "AWS"],
//       src: "/../images/fraterny.webp",
//       liveUrl: "https://www.fraterny.in/",
//     },
//     {
//       id: 3,
//       title: "Fitness tracker Dashboard",
//       description: "A comprehensive analytics platform with machine learning insights, real-time data processing, and interactive visualizations built with React and Python.",
//       tags: ["React", "Python", "TensorFlow", "AWS"],
//       src: "/../images/fitness.webp",
//       liveUrl: "https://fitness-tracker-app-eta-six.vercel.app/",
//     }
//   ];
  
//   const handleKnowMore = (project: Project) => {
//     setSelectedProject(project);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };
  
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-8">
//         <Heading as="h2" className="font-black text-lg sm:text-xl md:text-2xl lg:text-3xl pb-5">
//           Featured Projects
//         </Heading>
//       </div>
      
//       {/* Using the ProjectCardStack component with updated onKnowMore handler */}
//       <ProjectCardStack 
//         items={projects} 
//         onKnowMore={handleKnowMore}
//         offset={15}
//         scaleFactor={0.05}
//       />
      
//       {/* Updated Project Detail Modal */}
//       <ProjectDetailModal
//         project={selectedProject}
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//       />
//     </div>
//   );
// }

// export default function HomePage() {
//   const isLoaded = useProgressiveLoading();

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
//       <div className="flex flex-col py-6 gap-6">
//         <motion.section 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="flex-1 flex items-center"
//         >
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full">

//             <div className="lg:col-span-3 flex flex-col justify-center space-y-6">
//               {/* MOBILE-OPTIMIZED BRANDING SECTION */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <Heading as="h1" className="font-black">
//                   <TypewriterEffectSmooth words={typewriterWords} />
//                 </Heading>
//               </motion.div>

//               {/* MAIN DESCRIPTION - Now properly sized relative to branding */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.1 }}
//               >
//                 <Paragraph className="text-gray-600 leading-relaxed">
//                   <span className="font-semibold text-gray-900">Full Stack Developer</span> & <span className="font-semibold text-gray-900">Gen AI developer</span> specializing in 
//                   building scalable web applications and AI-driven solutions.
//                 </Paragraph>
//               </motion.div>

//               {/* FEATURE POINTS - Properly scaled */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="space-y-4"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
//                   <div className="flex items-start gap-3">
//                     <Monitor className="text-blue-500 mt-1 w-5 h-5 flex-shrink-0" />
//                     <div className="leading-relaxed">
//                       <span className="text-gray-700">Clean, polished </span>
//                       <span className="font-semibold text-gray-900">UI/UX designs</span>
//                       <span className="text-gray-700"> using </span>
//                       <span className="font-semibold text-gray-900">React</span>
//                       <span className="text-gray-700"> & </span>
//                       <span className="font-semibold text-gray-900">Next.js</span>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <Server className="text-green-500 mt-1 w-5 h-5 flex-shrink-0" />
//                     <div className="leading-relaxed">
//                       <span className="text-gray-700">Robust backend solutions with </span>
//                       <span className="font-semibold text-gray-900">Express.js</span>
//                       <span className="text-gray-700"> & </span>
//                       <span className="font-semibold text-gray-900">Node.js</span>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <Database className="text-purple-500 mt-1 w-5 h-5 flex-shrink-0" />
//                     <div className="leading-relaxed">
//                       <span className="text-gray-700">Database architecture using </span>
//                       <span className="font-semibold text-gray-900">MongoDB</span>
//                       <span className="text-gray-700"> & </span>
//                       <span className="font-semibold text-gray-900">Supabase</span>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <Cloud className="text-orange-500 mt-1 w-5 h-5 flex-shrink-0" />
//                     <div className="leading-relaxed">
//                       <span className="text-gray-700">Deployment on </span>
//                       <span className="font-semibold text-gray-900">VPS</span>
//                       <span className="text-gray-700"> (Linode, DigitalOcean, Hostinger) & </span>
//                       <span className="font-semibold text-gray-900">AWS</span>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3 md:col-span-2">
//                     <Bot className="text-red-500 mt-1 w-5 h-5 flex-shrink-0" />
//                     <div className="leading-relaxed">
//                       <span className="text-gray-700">Build and integrate </span>
//                       <span className="font-semibold text-gray-900">AI agents</span>
//                       <span className="text-gray-700"> into existing websites for enhanced functionality</span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* BUTTONS - Better spacing and sizing */}
//               <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.3 }}
//                 className="flex flex-col sm:flex-row gap-4 pt-6"
//               >
//                 <ContactModal />
//                 <AnimatedButton text="View My Work" icon={Briefcase} href="/projects" className="bg-black/80 text-primary border border-gray-200 px-8 py-4 text-base font-medium rounded-lg hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md group" />
//               </motion.div>
//             </div>
//             <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center space-y-6">
//               {/* Profile Image - Desktop Only */}
//               <motion.div 
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6, delay: 0.4 }}
//                 className="relative group"
//               >
//                 <motion.div 
//                   className="w-44 h-44 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-500"
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
//               </motion.div>

//               {/* Social Media Grid - Desktop Only */}
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

//         <SaasShowcase />

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


// src/app/HomePage.tsx
"use client";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Linkedin, Twitter, Users, Youtube, Github, Book, Briefcase, ExternalLink, Mail } from "lucide-react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Monitor, Server, Database, Cloud, Bot } from "lucide-react";
import ContactModal from "@/components/ContactModal";
import AnimatedButton from "../components/AnimatedButton";
import { ProjectCardStack } from "@/components/ui/project-card-stack";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import { SaasShowcase } from "@/components/SaasShowcase";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
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
  id: number;
  title: string;
  description: string;
  tags: string[];
  src: string;
  liveUrl?: string;
  githubUrl?: string;
};

function MiniProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = [
    {
      id: 1,
      title: "Toonytalesworld: AI powered SaaS for Kids",
      description: "A comprehensive analytics platform with machine learning insights, real-time data processing, and interactive visualizations built with React and Python.",
      tags: ["React", "Python", "TensorFlow", "AWS"],
      src: "/../images/toonytalesworld.webp",
      liveUrl: "https://www.toonytalesworld.com/",
    },
    {
      id: 2,
      title: "Fraterny: An exclusive Villa for your family",
      description: "A comprehensive analytics platform with machine learning insights, real-time data processing, and interactive visualizations built with React and Python.",
      tags: ["React", "Python", "TensorFlow", "AWS"],
      src: "/../images/fraterny.webp",
      liveUrl: "https://www.fraterny.in/",
    },
    {
      id: 3,
      title: "Fitness tracker Dashboard",
      description: "A comprehensive analytics platform with machine learning insights, real-time data processing, and interactive visualizations built with React and Python.",
      tags: ["React", "Python", "TensorFlow", "AWS"],
      src: "/../images/fitness.webp",
      liveUrl: "https://fitness-tracker-app-eta-six.vercel.app/",
    }
  ];
  
  const handleKnowMore = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="py-2 sm:py-6 md:py-6 backdrop-blur-sm shadow-lg rounded-xl relative border border-gradient-to-r from-blue-200/30 to-purple-200/30 ">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl "></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)] rounded-xl"></div>
      
      <div className="flex-col items-center justify-center text-center mb-10">
        <Heading as="h1" className="font-black text-3xl sm:text-xl md:text-2xl lg:text-3xl pb-1">
          Featured <span className="text-blue-950 font-extralight">Projects</span>
        </Heading>
        <Paragraph className="text-lg text-gray-500 max-w-2xl mx-auto text-center">
          I love to build things that make a difference
        </Paragraph>
      </div>
      
      {/* Mobile-optimized wrapper for ProjectCardStack */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-8">
        <ProjectCardStack 
          items={projects} 
          onKnowMore={handleKnowMore}
          offset={15}
          scaleFactor={0.05}
        />
      </div>
      <div>
        
      </div>
      
      {/* Updated Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
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
      <div className="flex flex-col py-4 sm:py-6 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className=""
        >
          <Heading as="h1" className="font-black">
            {/* <TypewriterEffectSmooth words={typewriterWords} /> */}
              Build <ContainerTextFlip
              className="mx-2"
                words={["FAST", "MODERN", "STYLISH"]}
              />
              websites
          </Heading>
        </motion.div>
        
        {/* INTRO SECTION */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex items-center"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full">

            <div className="lg:col-span-3 flex flex-col justify-center space-y-6">
              {/* MOBILE-OPTIMIZED BRANDING SECTION */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-red-400"
              >
                <Heading as="h1" className="font-black">
                   Build <ContainerTextFlip
                      words={["FAST", "MODERN", "STYLISH", "AWESOME"]}
                    />
                    websites
                </Heading>
              </motion.div> */}

              {/* MAIN DESCRIPTION - Now properly sized relative to branding */}
              <div className="bg-gradient-to-br rounded-3xl border border-gradient-to-r from-blue-200/30 to-purple-200/30 p-6 backdrop-blur-sm shadow-lg">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Paragraph className="text-gray-600 leading-relaxed mb-5">
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
                  {/* <ContactModal /> */}
                  <AnimatedButton text="View My Work" icon={Briefcase} href="/projects" className="bg-black/80 text-primary border border-gray-200 px-8 py-4 text-base font-medium rounded-lg hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md group" />
                  <AnimatedButton text="Contact Me" icon={Mail} href="/contact" className="bg-black/80 text-primary border border-gray-200 px-8 py-4 text-base font-medium rounded-lg hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md group" />
                </motion.div>
              </div>
            </div>
            
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

        {/* SAAS SHOWCASE SECTION */}
        <SaasShowcase />

        {/* FEATURED PROJECTS SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-4 sm:py-8 md:py-12"
        >
          <MiniProjects />
        </motion.section>
        
      </div>
    </Container>
  );
}