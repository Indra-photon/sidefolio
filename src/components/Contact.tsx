"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, MessageSquare, Briefcase } from "lucide-react";

const defaultFormState = {
  name: {
    value: "",
    error: "",
  },
  email: {
    value: "",
    error: "",
  },
  company: {
    value: "",
    error: "",
  },
  message: {
    value: "",
    error: "",
  },
  budget: {
    value: "",
    error: "",
  },
};

export const Contact = () => {
  const [formData, setFormData] = useState(defaultFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: {
        value,
        error: "",
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'contact_form_submit',
      form_id: 'contact-form',
      page_location: window.location.href
    });
    // Write your submit logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="mx-auto p-6 backdrop-blur-sm shadow-lg rounded-xl relative border border-gradient-to-r from-blue-200/30 to-purple-200/30">
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
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-100 dark:text-white mb-2">
          Let's Work Together
        </h2>
        <p className="text-gray-200 dark:text-gray-500">
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
              value={formData.name.value}
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
              value={formData.email.value}
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
              value={formData.company.value}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
          
          <div className="relative">
            <select
              name="budget"
              value={formData.budget.value}
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
            value={formData.message.value}
            onChange={handleInputChange}
            rows={4}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
            required
          />
        </div>

        {/* Project Types */}
        <div>
          <p className="text-sm font-medium text-gray-200 dark:text-gray-300 mb-3">
            What type of project do you need help with?
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-neutral-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <span>Send Message</span>
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            I'll respond within 24 hours
          </p>
        </div>
      </form>
    </div>
  );
};