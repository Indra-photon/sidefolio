'use client'

import React, {useState} from 'react'
import Image from 'next/image'
import { IconStar, IconCoin, IconBriefcase, IconX, IconBrandGithub, IconBrandLinkedin, IconBrandTwitter } from '@tabler/icons-react';
import {AnimatePresence, motion} from 'framer-motion'
import Link from 'next/link';
import { socials as  SocialLinks} from '@/constants/socials'
import { useRouter } from 'next/navigation';

interface Detail {
  label: string
  value: string
  Icon: React.ReactNode
}
interface Reviews {
  reviewer: string
  comment: string
  rating: number
  imgsrc?: string
}

interface SocialLink {
  name: string
  Icon: React.ComponentType<{ className?: string; size?: number }>
  url: string
  label: string

}

const Details: Detail[] = [
  { label: 'Rating', value: '4.8/5', Icon: <IconStar size={24} className='text-white' /> },
  { label: 'Clients', value: '10+', Icon: <IconBriefcase size={24} className='text-white'/> },
  { label: 'Price', value: '$20/hr', Icon: <IconCoin size={24} className='text-white'/> },
]

const ReviewsData: Reviews[] = [
  { 
    reviewer: 'Alice', 
    comment: 'Great to work with! Indranil demonstrated excellent communication skills and delivered high-quality work consistently.', 
    rating: 5 
  },
  { 
    reviewer: 'Bob', 
    comment: 'Delivered on time and exceeded expectations. His attention to detail and problem-solving abilities are impressive.', 
    rating: 4.5 
  },
  { 
    reviewer: 'Charlie', 
    comment: 'Highly recommend! Outstanding technical expertise and professional approach. Made our complex project look easy.', 
    rating: 4.8 
  },
]

const getRandomPosition = () => {
  const positions = [
    { top: '10%', left: '10%' },
    { top: '15%', right: '15%' },
    { bottom: '10%', left: '15%' },
    { bottom: '15%', right: '10%' },
    { top: '30%', left: '5%' },
    { top: '50%', right: '5%' },
  ]
  return positions[Math.floor(Math.random() * positions.length)]
}

const ReviewCard = ({ review, onClose }: { review: Reviews, onClose: () => void }) => {
  const position = React.useMemo(() => getRandomPosition(), [])
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      style={position}
      className='absolute w-72 p-4 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-lg shadow-2xl'
    >
      <button 
        onClick={onClose}
        className='absolute top-2 right-2 text-white/70 hover:text-white transition-colors'
      >
        <IconX size={20} />
      </button>
      <h3 className='text-2xl font-bold text-white mb-2'>{review.reviewer}</h3>
      <p className='text-white/80 mb-3'>{review.comment}</p>
      <div className='flex items-center gap-1'>
        <span className='text-yellow-400 text-lg font-semibold'>{review.rating}</span>
        <IconStar size={20} className='text-yellow-400 fill-yellow-400' />
      </div>
    </motion.div>
  )
}

const ProfileSection = () => {
  const [isContactFormVisible, setIsContactFormVisible] = useState(false)
  const [isReviewsVisible, setIsReviewsVisible] = useState(false)
  const [ishovered, setIsHovered] = useState<number | null>(null)
  const router = useRouter();


  const handleHireMeClick = () => {
    router.push('/contact');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'contact_button_click',
      button_text: 'hire Me',
      page_location: window.location.href
    });
  }

  return (
    <div className=''>

      <AnimatePresence>
        {isReviewsVisible && ReviewsData.map((review, idx) => (
          <ReviewCard 
            key={`review-${idx}`} 
            review={review} 
            onClose={() => setIsReviewsVisible(false)}
          />
        ))}
      </AnimatePresence>

    <motion.div className='flex w-full justify-end items-end'>
        <AnimatePresence>
        {!isContactFormVisible && (
            <motion.div
            key='profile-card'
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='w-96 h-[520px] bg-white/10 border border-white/20 rounded-4xl shadow-2xl backdrop-blur-lg p-6 box-border'>
                <div className='flex flex-col'>
                <div className='flex flex-col items-start justify-end pb-4'>
                  <img
                      src='/images/Indranil.png'
                      alt='Profile Picture'
                      className='h-24 w-24 rounded-full border-4 border-white/20'
                  />
                </div>
                <h1 className='text-5xl tracking-wide font-bold bg-transparent bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400'>Indranil Maiti</h1>
                <div className='w-full flex justify-between items-center mb-8 mt-2'>
                    <p className='text-2xl text-neutral-400 tracking-wider'>Web Developer</p>
                    <motion.button onClick={() => setIsReviewsVisible(!isReviewsVisible)} className=' bg-white/10 backdrop-blur-sm rounded-xl shadow-md text-white font-medium tracking-widest text-xs px-2 py-1 cursor-pointer'>
                    REVIEWS
                    </motion.button>
                </div>

                <div className='bg-white/10 rounded-xl w-full flex justify-between border border-neutral-200 p-2'>
                    {Details.map((details, idx) => {
                    return (
                        <div key={idx} className='flex flex-col items-center justify-center p-1'>
                            {details.Icon}
                            <span className='text-xl text-neutral-300'>{details.label}</span>
                            <span className='text-md text-neutral-400'>{details.value}</span>
                        </div>
                    )
                    })}
                </div>

                <div>
                    <motion.button onClick={handleHireMeClick} className='mt-6 w-full bg-white backdrop-blur-sm p-3 rounded-xl shadow-md text-black font-medium tracking-widest text-xl cursor-pointer'>
                    HIRE ME
                    </motion.button>
                </div>

                <div className='flex justify-center gap-4 mt-6'>
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

                

                </div>

            </motion.div>
        )}
        </AnimatePresence>
    </motion.div>
    </div>
  )
}

export default ProfileSection;