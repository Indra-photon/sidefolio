import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { Paragraph } from './Paragraph';
import ProfileSection from './ProfileSection';
import { Monitor, Server, Database, Cloud, Bot, Briefcase, Mail } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { servicesData } from '@/constants/service';
import { socials as  SocialLinks} from '@/constants/socials'
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
  const [ishovered, setIsHovered] = useState<number | null>(null)
  

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
                        <motion.div>
                          
                          <Paragraph className={twMerge(CalSans.className, 'text-neutral-400 text-sm sm:text-md lg:text-[18px] font-extralight')}> 
                            <span className='hidden sm:hidden md:block'>I am a freelance full stack web developer. I build <span>modern, responsive, and dynamic websites</span> that bring your ideas to life. {" "}</span> I use modern technologies like <span className='text-neutral-200'>React, NextJS</span> for frontend development <span className='text-neutral-200'> NodeJS, ExpressJS</span> for backend development,
                            and <span className='text-neutral-200'>MongoDB, PostgreSQL, Supabase</span> for database management, <span className='text-neutral-200'>Vercel, AWS, Linode, DigitalOcean</span> for deployment and hosting with CI/CD pipeline, load balancing, and scalability.
                          </Paragraph>
                          <Paragraph className={twMerge(CalSans.className, 'text-neutral-400 text-sm sm:text-md lg:text-[18px] font-extralight pt-4')}>
                            I built
                             <Link href="https://www.toonytalesworld.com/" onClick={() => {
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                              event: 'project_click',
                              project_url: "/projects/toonytalesworld-create-storybooks-for-kids-using-ai",
                              project_name: 'ToonyTalesWorld_from hero_section'
                            });
                          }} className='text-neutral-200 underline underline-offset-2'>ToonyTalesWorld </Link> and

                          <Link href="https://www.fraterny.com/quest/quest-mode" onClick={() => {
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                              event: 'project_click',
                              project_url: "/projects/avoron",
                              project_name: '`Avoron_from` hero_section'
                            });
                          }} className='text-neutral-200 underline underline-offset-2'> Avoron. </Link>

                           I am currently working on <Link href="https://www.fraterny.com/" onClick={() => {
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                              event: 'project_click',
                              project_url: "/projects/fraterny",
                              project_name: 'Fraterny_from hero_section'
                            });
                          }} className='text-neutral-200 underline underline-offset-2'>Fraterny</Link>, <Link href="https://www.fraterny.com/quest/quest-mode" onClick={() => {
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                              event: 'project_click',
                              project_url: "/projects/quest",
                              project_name: 'Quest_from hero_section'
                            });
                          }} className='text-neutral-200 underline underline-offset-2'>Quest</Link>.
                          </Paragraph>

                          <Paragraph className={twMerge(CalSans.className, 'text-neutral-400 text-sm sm:text-md lg:text-[18px] font-extralight pt-4')}>
                            I share my knowledge on technologies <Link href={"/blog"} className='text-neutral-200 underline underline-offset-2'>here</Link>,
                            publish videos and case studies, projects on my Youtube Channel <Link href={"https://www.youtube.com/@indranilmaiti842"} className='text-neutral-200 underline underline-offset-2'>Indranil's Org.</Link> and 
                            remains active on X (Twitter) <Link href={"https://x.com/Nil_phy_dreamer"} className='text-neutral-200 underline underline-offset-2'>@Nil_phy_dreamer</Link>.
                          </Paragraph>
                        </motion.div>

                        <motion.div className='pt-2'>
                            <motion.div className='flex flex-row items-center justify-center gap-6'>
                                <div className={twMerge(CalSans.className, 'text-white text-md sm:text-lg lg:text-xl hidden sm:hidden md:inline-block')}>Find me here :</div>
                                <div className='flex justify-start items-start gap-4'>
                                  {SocialLinks.map((social, idx) => (
                                  <Link
                                      key={idx}
                                      href={social.url} 
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label={social.label}
                                      className='p-3 rounded-full relative cursor-pointer'
                                      onMouseEnter={() => setIsHovered(idx)}
                                      onMouseLeave={() => setIsHovered(null)}
                                      onClick={() => {
                                        window.dataLayer = window.dataLayer || [];
                                        window.dataLayer.push({
                                          event: 'social_media_click',
                                          social_platform: social.url,
                                          page_location: window.location.href
                                        });
                                      }}
                                  >
                                      {ishovered === idx && (
                                      <motion.div 
                                          layoutId='social-hover'
                                          className='absolute inset-0 rounded-full bg-black/80 border-2 border-white/20 z-0'
                                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                      />
                                      )}
                                      <social.icon className='text-white relative z-10' size={24} />
                                  </Link>
                                  ))}
                              </div>
                            </motion.div>
                        </motion.div>

                        <motion.div className='pt-10 pr-2'>
                            <motion.div>
                                <p className={twMerge(CalSans.className, 'text-white text-2xl sm:text-3xl lg:text-4xl')}>What I can do</p>
                            </motion.div>

                            <motion.div>
                              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
                                {servicesData.map((service) => (
                                  <div
                                    key={service.id}
                                    className="border bg-neutral-800 backdrop-blur-3xl shadow-2xl rounded-lg p-4 border-neutral-400 hover:shadow-md transition-shadow"
                                  >
                                    
                                    <div className="flex items-start justify-between mb-4">
                                      <div className="flex flex-col items-left gap-3">
                                        <h3 className={twMerge(CalSans.className, "text-xl font-semibold px-4 py-2 bg-white/90 rounded-3xl")}>{service.title}</h3>
                                        <motion.div
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.3 }}
                                        >
                                        <Paragraph className={twMerge(CalSans.className, "text-neutral-400 text-sm sm:text-md lg:text-[18px] px-4")}>{service.description}</Paragraph>
                                        </motion.div>
                                      </div>
                                      
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            </motion.div>
                        </motion.div>
                
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