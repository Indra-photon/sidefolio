'use client'

import React, { useState } from 'react'
import { IconChecks, IconRestore } from '@tabler/icons-react';
import {motion} from 'motion/react'

function VariantDeleteButton() {
    const [startDelete, setStartDelete] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleAnimatedDeletebutton1 = () => {
        setStartDelete(true);
        setTimeout(() => {
            setIsDeleted(true);
            setStartDelete(false);
        }, 5000);
        
        // Add this new timeout
        setTimeout(() => {
            // setIsDeleted(false);
            setIsHovered(false);
        }, 7000); // Waits 2 more seconds after showing "Deleted successfully"
    }

    const slideVariants = {
        rest: {
            x: '0%',
            justifyContent: 'center',
            gap: '0rem',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            transition: {
                type: "spring" as const,
                stiffness: 300,      // Higher = faster spring
                damping: 20,         // Lower = more bounce (try 15-25)
                mass: 2,             // Higher = slower, heavier feel
            }
        },
        hover: {
            x: '-80%',
            justifyContent: 'space-between',
            gap: '0rem',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            paddingBottom: '0.1rem',
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20,
                mass: 1,
            }
        }
    };
  return (
    <div className='flex items-center justify-center h-16 min-w-5xl bg-red-400 relative overflow-hidden'>
        <motion.button
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => { if (!startDelete && !isDeleted) setIsHovered(false) }}
            animate={isHovered || startDelete ? "hover" : "rest"}
            onClick={handleAnimatedDeletebutton1}
            className="relative overflow-hidden bg-red-700 w-[200px] py-1 px-8 rounded-full border-2 border-red-400"
            >
            <motion.span
            className="pl-4 flex items-center justify-center gap-2 text-white">
                <motion.span className='flex'>
                    {startDelete && !isDeleted ? 
                        (
                            <>
                                {"Delet"}
                                {["i", "n", "g"].map((letter, index) => (
                                    <motion.span
                                        key={`ing-${index}`}
                                        className='inline-block'
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ 
                                            type: "spring", 
                                            damping: 20, 
                                            stiffness: 350, 
                                            delay: index * 0.1 
                                        }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </>
                        ) : !isDeleted ? (
                            "Are you sure?"
                        ) : (
                            <>
                                {"Delet"}
                                {["e", "d"].map((letter, index) => (
                                    <motion.span
                                        key={`ed-${index}`}
                                        className='inline-block'
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ 
                                            type: "spring", 
                                            damping: 20, 
                                            stiffness: 350, 
                                            delay: index * 0.1 
                                        }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))} 
                            </>
                        )
                    }
                </motion.span>
            </motion.span>

            <motion.span
                variants={slideVariants}
                className="absolute inset-0 flex items-center bg-white rounded-full text-red-700 pointer-events-none"
            >
                {
                    isDeleted ? (
                        <motion.span> Deleted successfully </motion.span>
                    ) : (
                        <motion.span> Delete </motion.span>
                    )
                }

                <motion.div>
                    {isDeleted ? (
                        <IconChecks size={20} />
                    ) : (
                        <AnimatedTrashIcon rotation={startDelete ? 20 : 0} />
                    )}
                </motion.div>
            </motion.span>
        </motion.button>

        <button 
            onClick={() => {
                setIsDeleted(false);
                setIsHovered(false);
                setStartDelete(false);
            }}
            className='text-sm absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-1 py-1 rounded-lg border border-white/30 transition-colors'
        >
            <IconRestore size={16} />
        </button>
    </div>
  )
}

export default VariantDeleteButton


const AnimatedTrashIcon: React.FC<{ rotation: number }> = ({ rotation }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -6 28 32" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className="icon icon-tabler icons-tabler-outline icon-tabler-trash">
        <g
        style = {{
            overflow: 'visible',
            transformOrigin: 'right bottom',
            transformBox: 'fill-box',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease-out'
        }}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            <path d="M4 7l16 0" />
        </g>
        <path d="M10 11l0 6" />
        <path d="M14 11l0 6" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    </svg>
)