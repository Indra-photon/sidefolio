// components/ProjectDetailModal.tsx
"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { motion } from "framer-motion";
import { ExternalLink, Eye, Code, Tags, X } from "lucide-react";
import Image from "next/image";
import AnimatedButton from "@/components/AnimatedButton";

type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  src: string;
  liveUrl?: string;
  githubUrl?: string;
};

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!project) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalBody>
        <ModalContent>
          {/* Header with Featured Image */}
          <div className="relative h-56 w-full overflow-hidden rounded-t-xl">
            <Image
              src={project.src}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Project Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-white"
              >
                {project.title}
              </motion.h2>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={() => onClose()}
              className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          
          <div className="p-6">
            {/* Icon Header */}
            <div className="text-center mb-6">
              
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Project Details
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                An overview of the technologies and features
              </p>
            </div>

            {/* Tags Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tags className="w-5 h-5 text-gray-100" />
                <h5 className="font-semibold text-gray-100">Technologies Used</h5>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full transition-all duration-200 border border-gray-200"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
            
            {/* Description Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-gray-100" />
                <h5 className="font-semibold text-gray-100">About This Project</h5>
              </div>
              <div className="text-gray-100 prose prose-sm max-w-none">
                <p>{project.description}</p>
              </div>
            </div>
          </div>
        </ModalContent>
        
        <ModalFooter className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              <span>View Code</span>
            </a>
          )}
          
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <span>Visit Project</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          )}
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}