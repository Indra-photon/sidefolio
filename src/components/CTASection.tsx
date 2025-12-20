"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import localFont from "next/font/local";
import { twMerge } from "tailwind-merge";
import { Paragraph } from "./Paragraph";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  testimonialText?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
}

const CalSans = localFont({
  src: [{ path: "../../fonts/CalSans-SemiBold.woff2" }],
  display: "swap",
});


 const CTASection: React.FC<CTASectionProps> = ({
  title = "Ready to bring your vision to life?",
  description = "I've partnered with innovative startups and established brands to create digital experiences that convert visitors into customers.",
  buttonText = "Get In Touch",
  buttonLink = "/contact",
  testimonialText = "Working with Indranil was a game-changer for our business. The attention to detail and technical expertise exceeded all expectations, and our conversion rates have never been higher.",
  testimonialAuthor = "Sarah Mitchell",
  testimonialRole = "CEO - TechVision Solutions",
}) => {
//   const handleCTAClick = () => {
//     // GTM tracking for CTA button click
//     if (typeof window !== 'undefined') {
//     window.dataLayer = window.dataLayer || [];
//     window.dataLayer.push({
//       event: 'contact_button_click',
//       button_text: buttonText.toLowerCase(), // Dynamic button text
//       page_location: window.location.href,
//     });
//   }
    
//     // Navigate to the link
//     window.location.href = buttonLink;
//   };
const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  
  const eventData = {
    event: 'contact_button_click',
    button_text: buttonText?.toLowerCase() || 'unknown',
    page_location: window.location.href,
  };
  
  // Detailed log
  console.log('=== CTA CLICK EVENT ===');
  console.log('Button Text:', buttonText);
  console.log('Event Data:', eventData);
  console.log('DataLayer Before:', window.dataLayer);
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventData);
  
  console.log('DataLayer After:', window.dataLayer);
  console.log('Last Event:', window.dataLayer[window.dataLayer.length - 1]);
  console.log('======================');
  
//   setTimeout(() => {
//     window.location.href = buttonLink;
//   }, 300);
};

  return (
    <section className={twMerge(CalSans.className,"w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 px-6 sm:px-8 lg:px-12 rounded-2xl border border-double border-gray-100 shadow-2xl overflow-hidden relative")}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        {/* Left side - CTA Content */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Paragraph className="text-3xl sm:text-4xl lg:text-5xl text-white">
                {title}
            </Paragraph>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className=" text-gray-600 leading-relaxed"
          >
            <Paragraph className="text-gray-300">{description}</Paragraph>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <button
              onClick={handleCTAClick}
              className="group relative inline-flex items-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-base sm:text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden"
            >
              {/* Animated background */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              
              <span className="relative">{buttonText}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>

        {/* Right side - Testimonial */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-dashed border-gray-600 rounded-2xl p-8 lg:p-10 shadow-xl"
        >
          <div className="space-y-6">
            {/* Quote icon */}
            <div className="text-blue-400/20">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
            </div>

            {/* Testimonial text */}
            <p className={twMerge(CalSans.className,"text-gray-200 text-base sm:text-lg leading-relaxed italic")}>
              "{testimonialText}"
            </p>

            {/* Author info */}
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-white font-semibold text-lg">{testimonialAuthor}</p>
              <p className="text-gray-400 text-sm mt-1">{testimonialRole}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;