import React from 'react'
import { motion } from 'framer-motion';
import { Paragraph } from './Paragraph';
import { ProfileSection } from './ProfileSection';
import { Monitor, Server, Database, Cloud, Bot, Briefcase, Mail } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { services } from '@/constants/service';
import { worklists } from '@/constants/worklist';
import localFont from "next/font/local";
import { TechStack } from './TechStack';
import { IconLink } from '@tabler/icons-react';
import Link from 'next/link';
import { BentoGridThirdDemo } from '../components/BentoGrid';
import { sendGTMEvent } from '@next/third-parties/google'

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
                    className="space-y-2"
                    >
                        {/* {services.map((service, index) => (
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
                        ))} */}

                        {worklists.map((work, index) => (
                            <div key={index} className={`flex items-start gap-1`}>
                            <Briefcase className={`text-white mt-1 w-5 h-5 flex-shrink-0`} />
                            <Link href={work.link || '#'} target="_blank" rel="noopener noreferrer">
                            <Paragraph className="flex gap-4 items-center text-base sm:text-lg md:text-xl lg:text-2xl text-transparent bg-clip-text bg-gradient-to-l from-neutral-50 to-neutral-400 leading-relaxed w-full">
                                <span
                                    className={work.content.highlight ? 'font-semibold text-gray-900 italic' : CalSans.className}
                                >
                                    {work.content.text}
                                </span>
                                <IconLink className="text-white mt-1 w-5 h-5 flex-shrink-0" href={work.link} />
                            </Paragraph>
                            </Link>
                            
                            </div>
                        ))}

                    <motion.div className=''>
                      <TechStack />
                    </motion.div>

                    <motion.div className="pt-7 flex space-x-4">
                        <AnimatedButton onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'viewMyWork' })} text="View My Work" icon={Briefcase} href="/projects" className="shadow-[inset_0_0_0_2px_#616467] border border-gray-200/50 text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200 group" />
                        <AnimatedButton onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'contactMe' })} text="Contact Me" icon={Mail} href="/contact" className="shadow-[inset_0_0_0_2px_#616467] border border-gray-200/50 text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200 group" />
                    </motion.div>

                
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="pt-6 w-1/2 hidden sm:inline"
                      >
                      <ProfileSection />

                    </motion.div>

                </motion.div>

                <motion.div className='mt-10'>
                  <BentoGridThirdDemo />
                </motion.div>
            </div>
          </div>
        </motion.section>
    </div>
  )
}

export default HeroHome