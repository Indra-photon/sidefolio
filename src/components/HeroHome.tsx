'use client';

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
import FeaturedBlog from './FeaturedBlog';
import FeaturedProject from './Featuredproject';
import { Container } from './Container';
import { ArrowRight } from 'lucide-react';

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

  const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement>, buttontext: string) => {
    const buttonText = buttontext;
    const buttonLink = "/contact";
    e.preventDefault();
    
    const eventData = {
      event: 'contact_button_click',
      button_text: buttonText?.toLowerCase() || 'unknown',
      page_location: window.location.href,
    };
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(eventData);
    }
    window.location.href = buttonLink;
  };


  return (
          <Container className=" w-full">
            <div className="flex flex-col">
                <motion.div className='flex flex-row justify-between gap-6'>
                    <motion.div
                    className="space-y-2 w-full"
                    >
                        <motion.div>
                          
                          <Paragraph className={twMerge(CalSans.className, 'text-neutral-400 text-sm sm:text-md lg:text-[18px] font-extralight')}> 
                            {/* <span className=''>{" "}</span>  */}
                            I use modern technologies like <span className='text-neutral-200'>React, NextJS</span> for frontend development <span className='text-neutral-200'> NodeJS, ExpressJS</span> for backend development,
                            and <span className='text-neutral-200'>MongoDB, PostgreSQL, Supabase</span> for database management, <span className='text-neutral-200'>Vercel, AWS, Linode, DigitalOcean</span> for deployment and hosting with CI/CD pipeline, load balancing, and scalability.
                          </Paragraph>
                          {/* <Paragraph className={twMerge(CalSans.className, 'text-neutral-400 text-sm sm:text-md lg:text-[18px] font-extralight pt-4')}>
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
                          </Paragraph> */}

                          {/* <Paragraph className={twMerge(CalSans.className, 'text-neutral-400 text-sm sm:text-md lg:text-[18px] font-extralight pt-4')}>
                            I share my knowledge on technologies <Link href={"/blog"} className='text-neutral-200 underline underline-offset-2'>here</Link>,
                            publish videos and case studies, projects on my Youtube Channel <Link href={"https://www.youtube.com/@indranilmaiti842"} className='text-neutral-200 underline underline-offset-2'>Indranil's Org.</Link> and 
                            remains active on X (Twitter) <Link href={"https://x.com/Nil_phy_dreamer"} className='text-neutral-200 underline underline-offset-2'>@Nil_phy_dreamer</Link>.
                          </Paragraph> */}
                        </motion.div>

                        <motion.div className='pt-2'>
                            <motion.div className='flex flex-row items-center justify-start gap-6'>
                                {/* <div className={twMerge(CalSans.className, 'text-white text-md sm:text-lg lg:text-xl hidden sm:hidden md:inline-block')}>Find me here :</div> */}
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

                        <div className='pt-4 flex flex-row gap-4'>
                        <div className="relative overflow-hidden inline-flex items-center justify-center rounded-full cursor-default mb-4">
                          <div
                            className="absolute inset-0 z-0 scale-110"
                            style={{
                              background: "linear-gradient(-45deg, #1a1a1a, #ffffff, #6b7280, #d1d5db, #1a1a1a)",
                              backgroundSize: "400% 400%",
                              animation: "gradient 6s ease infinite",
                            }}
                          />
                          <div className="bg-neutral-900 rounded-full flex items-center justify-center m-[1.5px] px-3 sm:px-6 py-2 relative z-10">
                            <button onClick={(e) => handleCTAClick(e, "Contact Me")} className={twMerge(CalSans.className, 'text-gray-300 text-sm md:text-base tracking-widest uppercase')}>
                              CONTACT ME
                            </button>
                          </div>
                        </div>

                        <div className="relative overflow-hidden inline-flex items-center justify-center rounded-full cursor-default mb-4">
                          <Link href="https://topmate.io/indranil_dev" target="_blank" rel="noopener noreferrer">
                          <div
                            className="absolute inset-0 z-0 scale-110"
                            style={{
                              background: "linear-gradient(-45deg, #1a1a1a, #ffffff, #6b7280, #d1d5db, #1a1a1a)",
                              backgroundSize: "400% 400%",
                              animation: "gradient 6s ease infinite",
                            }}
                          />
                          <div className="bg-neutral-600 rounded-full flex items-center justify-center m-[1.5px] px-6 py-2 relative z-10">
                            <div className={twMerge(CalSans.className, 'text-neutral-100 text-sm md:text-base tracking-widest uppercase')}>
                              Book a Free Call
                            </div>
                          </div>
                          </Link>
                        </div>
                        </div>
                
                    </motion.div>

                </motion.div>

                <FeaturedProject />
                
                <FeaturedBlog />
                {/* <div className='hidden md:hidden lg:block mt-10'>
                  <h1 className={twMerge(CalSans.className, 'text-white text-2xl sm:text-3xl lg:text-4xl mb-4')}></h1>
                  <BentoGridThirdDemo />
                </div> */}
            </div>
          </Container>
  )
}

export default HeroHome