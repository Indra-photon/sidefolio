import React from 'react'
import { socials } from '@/constants/socials'
import { motion } from 'framer-motion';
import Image from 'next/image';

export const ProfileSection = () => {
  return (
    <div className='group/paaji'>

    {/* <div className='w-60 flex items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-800 bg-[radial-gradient(theme(colors.neutral.700)_1px,transparent_1px)] bg-[length:10px_10px] shadow-2xl relative [perspective:1000px] group/paaji'>
        <Image 
            src='/images/Indranil_2.jpg' 
            alt='Profile Picture' 
            width={240} 
            height={240} 
            className='h-full w-full object-cover rounded-2xl
            [transform:rotateX(30deg)_rotateY(-30deg)_rotateZ(20deg)]
            [transform-style:preserve-3d]
            transition-all duration-200
            group-hover/paaji:[transform:rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)]'
        />
    </div> */}
        

    {/* </div> */}

    {/* <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative group"
        >
        
        <motion.div 
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-lg -z-10"
        animate={{ 
        scale: [1, 1.15, 1],
        rotate: [0, 360] 
        }}
        transition={{ 
        duration: 8, 
        repeat: Infinity, 
        ease: "linear" 
        }}
        />
        </motion.div> */}


        <div className="w-full flex flex-col items-center justify-center space-y-4">
            <div className='w-60 flex items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-800 bg-[radial-gradient(theme(colors.neutral.700)_1px,transparent_1px)] bg-[length:10px_10px] shadow-2xl relative [perspective:1000px] group/paaji'>
                <Image 
                    src='/images/Indranil_2.jpg' 
                    alt='Profile Picture' 
                    width={240} 
                    height={240} 
                    className='h-full w-full object-cover rounded-2xl
                    [transform:rotateX(30deg)_rotateY(-30deg)_rotateZ(20deg)]
                    [transform-style:preserve-3d]
                    transition-all duration-200
                    group-hover/paaji:[transform:rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)]'
                />
            </div>

            <h3 className="text-center text-neutral-200 text-xs font-semibold text-secondary mb-3 tracking-wide uppercase">
                Connect With Me
            </h3>
            
            <div className="grid grid-cols-3 gap-3 w-full">
            {socials.map((social, index) => {
                const IconComponent = social.icon;
                return (
                <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    // initial={{ opacity: 0, scale: 0.8 }}
                    // animate={{ opacity: 1, scale: 1 }}
                    // transition={{ duration: 0.3, delay: index * 0.08 }}
                    // whileHover={{ 
                    // scale: 1.1,
                    // y: -3,
                    // transition: { duration: 0.2 }
                    // }}
                    // whileTap={{ scale: 0.95 }}
                    className={`relative bg-black backdrop-blur-sm border border-gray-200/50 rounded-lg p-3 flex flex-col items-center justify-center h-16 transition-all duration-300 shadow-lg hover:shadow-2xl hover:bg-gradient-to-b hover:from-neutral-700 hover:to-neutral-900 group cursor-pointer`}
                >
                    <IconComponent 
                    size={20} 
                    className={`text-white transition-colors duration-200 mb-1 group-hover:text-zinc-50`}
                    />
                    <span className="text-xs uppercase leading-relaxed font-medium text-white group-hover:text-zinc-50 transition-colors duration-200 text-center">
                    {social.name}
                    </span>
                </motion.a>
                );
            })}
            
            <div className="col-span-3 grid grid-cols-2 gap-3">
            </div>
            </div>
        </div>
    </div>
  )
}
