import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { Paragraph } from './Paragraph';
import ProfileSection from './ProfileSection';
import { Monitor, Server, Database, Cloud, Bot, Briefcase, Mail } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { servicesData } from '@/constants/service';
import { worklists } from '@/constants/worklist';
import localFont from "next/font/local";
import { TechStack } from './TechStack';
import { IconLink } from '@tabler/icons-react';
import Link from 'next/link';
import { BentoGridThirdDemo } from '../components/BentoGrid';
import { sendGTMEvent } from '@next/third-parties/google'
import { twMerge } from "tailwind-merge";

const CalSans = localFont({
  src: [{ path: "../../fonts/CalSans-SemiBold.woff2" }],
  display: "swap",
});

function HeroHome() {

  const [openId, setOpenId] = useState<number | null>(null);

  const toggleDescription = (id: number) => {
    setOpenId(openId === id ? null : id);
  };
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
                <motion.div className='flex flex-row justify-between gap-6'>
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-2 w-full"
                    >

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

                        <motion.div className='pt-10 pr-2'>
                            <motion.div>
                                <p className={twMerge(CalSans.className, 'text-white text-2xl sm:text-3xl lg:text-4xl')}>What I can do</p>
                            </motion.div>

                            <motion.div>
                              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
                                {servicesData.map((service) => (
                                  <div
                                    key={service.id}
                                    className="border bg-white/90 backdrop-blur-md rounded-lg p-4 border-neutral-400 shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    {/* Header and Icon */}
                                    <div className="flex items-start justify-between mb-4">
                                      <div className="flex flex-col items-left gap-3">
                                        <h3 className={twMerge(CalSans.className, "text-xl font-semibold px-4 py-2 bg-white/50 rounded-3xl")}>{service.title}</h3>
                                        <Paragraph className={twMerge(CalSans.className, "text-gray-600 text-sm leading-relaxed px-4")}>{service.description}</Paragraph>
                                      </div>
                                      
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            </motion.div>
                        </motion.div>

                    {/* <motion.div className=''>
                      <TechStack />
                    </motion.div> */}

                    {/* <motion.div className="pt-7 flex space-x-4">
                        <AnimatedButton onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'viewMyWork' })} text="View My Work" icon={Briefcase} href="/projects" className="shadow-[inset_0_0_0_2px_#616467] border border-gray-200/50 text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200 group" />
                        <AnimatedButton onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'contactMe' })} text="Contact Me" icon={Mail} href="/contact" className="shadow-[inset_0_0_0_2px_#616467] border border-gray-200/50 text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200 group" />
                    </motion.div> */}

                
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

                {/* <motion.div className='mt-10'>
                  <BentoGridThirdDemo />
                </motion.div> */}
            </div>
          </div>
        </motion.section>
    </div>
  )
}

export default HeroHome