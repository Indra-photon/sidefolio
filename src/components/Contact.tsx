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
  projectTypes: {
    value: [] as string[],  // Add this
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

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

  const handleProjectTypeToggle = (type: string) => {
  setFormData(prev => {
    const currentTypes = prev.projectTypes.value;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    return {
      ...prev,
      projectTypes: {
        value: newTypes,
        error: "",
      }
    };
  });
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus({ type: null, message: '' });

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name.value,
        email: formData.email.value,
        company: formData.company.value,
        message: formData.message.value,
        budget: formData.budget.value,
        projectTypes: formData.projectTypes.value,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // GTM tracking
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'contact_form_submit',
        form_id: 'contact-form',
        page_location: window.location.href
      });

      setSubmitStatus({
        type: 'success',
        message: data.message
      });

      // Reset form
      setFormData(defaultFormState);
    } else {
      setSubmitStatus({
        type: 'error',
        message: data.message || 'Failed to send message. Please try again.'
      });
    }
  } catch (error) {
    setSubmitStatus({
      type: 'error',
      message: 'An unexpected error occurred. Please try again later.'
    });
  } finally {
    setIsSubmitting(false);
  }
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
              <option value="under-5k"> Under $500</option>
              <option value="5k-15k">$5,00 - $1,000</option>
              <option value="15k-50k">$1,000 - $1,500</option>
              <option value="50k-plus">$1,500+</option>
              <option value="discuss">Not sure yet, Lets discuss</option>
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
                onClick={() => handleProjectTypeToggle(type)}  // Add onClick
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 border ${
                  formData.projectTypes.value.includes(type)  // Add conditional styling
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-100 hover:bg-primary hover:text-white text-gray-700 border-gray-200 hover:border-primary'
                }`}
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
            disabled={isSubmitting}  // Add disabled
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}  // Update
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}  // Update
            className={`px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-neutral-700 hover:shadow-xl text-white'
            }`}
          >
            <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Success/Error Messages */}
        {submitStatus.type && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              submitStatus.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <p className="text-sm font-medium">{submitStatus.message}</p>
          </motion.div>
        )}

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