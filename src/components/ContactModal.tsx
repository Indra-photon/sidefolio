"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { motion } from "framer-motion"; // Changed to match your page.tsx
import { Send, User, Mail, MessageSquare, Briefcase } from "lucide-react";

interface ContactModalProps {
  triggerText?: string;
  triggerClassName?: string;
  children?: React.ReactNode;
}

export default function ContactModal({ 
  triggerText = "Let's Work Together", 
  triggerClassName = "",
  children 
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    budget: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // You can add your form submission logic here
  };

  return (
    <Modal>
      {children ? (
        children
      ) : (
        <ModalTrigger className={`bg-primary text-white px-8 py-4 text-base font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden group min-w-[200px] ${triggerClassName}`}>
          {/* Text sliding out to the left - Using CSS classes like original */}
          <span className="group-hover:translate-x-[-200px] group-hover:opacity-0 flex items-center justify-center font-medium transition-all duration-300 ease-out">
            {triggerText}
          </span>
          
          {/* Icon sliding in from the right - Using CSS classes like original */}
          <div className="translate-x-[200px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out">
            <Send className="w-6 h-6" />
          </div>
        </ModalTrigger>
      )}
      
      <ModalBody>
        <ModalContent>
          <div className="px-4 md:px-8 pt-5">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Send className="w-8 h-8 text-white" />
            </motion.div>
            
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Let's Work Together
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Ready to bring your project to life? Tell me about your vision.
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>
              
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Company and Budget Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="company"
                  placeholder="Company (Optional)"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              
              <div className="relative">
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Project Budget</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-15k">$5,000 - $15,000</option>
                  <option value="15k-50k">$15,000 - $50,000</option>
                  <option value="50k-plus">$50,000+</option>
                  <option value="discuss">Let's Discuss</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="relative">
              <MessageSquare className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
              <textarea
                name="message"
                placeholder="Tell me about your project. What are your goals and timeline?"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                required
              />
            </div>

            {/* Project Types */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What type of project do you need help with?
              </p>
              <div className="flex flex-wrap gap-2 pb-5">
                {[
                  "Web Development",
                  "Mobile App",
                  "AI Integration",
                  "E-commerce",
                  "API Development",
                  "UI/UX Design",
                  "Database Design",
                  "Other"
                ].map((type) => (
                  <motion.button
                    key={type}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-primary hover:text-white text-gray-700 rounded-full transition-all duration-200 border border-gray-200 hover:border-primary"
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>
          </form>
          </div>
        </ModalContent>
        
        <ModalFooter className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <div className="text-sm text-gray-500">
            I'll respond within 24 hours
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium">
              Cancel
            </button>
            <motion.button
              type="submit"
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <span>Send Message</span>
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}