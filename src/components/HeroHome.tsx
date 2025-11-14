import React from 'react'
import { motion } from 'framer-motion';
import { Paragraph } from './Paragraph';
import { ProfileSection } from './ProfileSection';
import { Monitor, Server, Database, Cloud, Bot, Briefcase, Mail } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { services } from '@/constants/service';
import localFont from "next/font/local";

const CalSans = localFont({
  src: [{ path: "../../fonts/CalSans-SemiBold.woff2" }],
  display: "swap",
});

function HeroHome() {
  return (
    <div>
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex items-center group/paaji"
        >
          <div className=" w-full">
            <div className="flex flex-col justify-center">
                <motion.div className='flex'>
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4 pt-4"
                    >
                        {services.map((service, index) => (
                            <div key={index} className={`flex items-start gap-3 ${service.colSpan || ''}`}>
                            <service.icon className={`${service.iconColor} mt-1 w-5 h-5 flex-shrink-0`} />
                            <Paragraph className="text-base sm:text-lg md:text-xl lg:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-700 leading-relaxed w-full">
                                {service.content.map((part, i) => (
                                <span
                                    key={i}
                                    className={part.highlight ? 'font-semibold text-gray-900 italic' : CalSans.className}
                                >
                                    {part.text}
                                </span>
                                ))}
                            </Paragraph>
                            </div>
                        ))}

                    <motion.div className="pt-14 flex space-x-4">
                        <AnimatedButton text="View My Work" icon={Briefcase} href="/projects" className="shadow-[inset_0_0_0_2px_#616467] border border-gray-200/50 text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200 group" />
                        <AnimatedButton text="Contact Me" icon={Mail} href="/contact" className="shadow-[inset_0_0_0_2px_#616467] border border-gray-200/50 text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200group" />
                    </motion.div>
                    </motion.div>

                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="pt-6 w-1/2"
                    >
                    <ProfileSection />

                    </motion.div>

                </motion.div>
            </div>
            
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center space-y-6">         
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="w-full max-w-xs"
              >
                <ProfileSection />
              </motion.div> */}
            </div>
          </div>
        </motion.section>
    </div>
  )
}

export default HeroHome