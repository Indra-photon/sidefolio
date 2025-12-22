'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconChecks, IconTrash } from '@tabler/icons-react';

interface AnimatedDeleteButtonProps {
  itemName?: string;
  onDelete?: () => void;
}

function AnimatedTrashIcon({ rotation }: { rotation: number }) {
  return (
    <motion.div
      animate={{ rotate: rotation }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <IconTrash size={20} />
    </motion.div>
  );
}

export function AnimatedDeleteButton({ 
  itemName = "item",
  onDelete 
}: AnimatedDeleteButtonProps) {
  const [startDelete, setStartDelete] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const slideVariants = {
    rest: { x: '-100%' },
    hover: { x: 0 }
  };

  const handleAnimatedDelete = async () => {
    if (isDeleted) return;

    if (!startDelete) {
      setStartDelete(true);
      
      setTimeout(() => {
        setIsDeleted(true);
        onDelete?.();
        
        setTimeout(() => {
          setStartDelete(false);
          setIsDeleted(false);
        }, 3000);
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center p-8 my-6">
      <motion.button
        whileHover="hover"
        initial="rest"
        className="relative overflow-hidden bg-red-700 w-[220px] py-3 px-8 rounded-full border-2 border-red-400 shadow-lg cursor-pointer"
      >
        <motion.span
          onClick={handleAnimatedDelete}
          className="pl-4 flex items-center justify-center gap-2 text-white font-semibold"
        >
          <motion.span className="flex">
            {startDelete && !isDeleted ? (
              <>
                {"Delet"}
                {["i", "n", "g"].map((letter, index) => (
                  <motion.span
                    key={`ing-${index}`}
                    className="inline-block"
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
                    className="inline-block"
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
            )}
          </motion.span>
        </motion.span>

        <motion.span
          variants={slideVariants}
          className="absolute inset-0 flex items-center justify-center gap-2 bg-white rounded-full text-red-700 pointer-events-none font-semibold"
        >
          {isDeleted ? (
            <>
              <span>Deleted successfully</span>
              <IconChecks size={20} />
            </>
          ) : (
            <>
              <span>Delete {itemName}</span>
              <AnimatedTrashIcon rotation={startDelete ? 20 : 0} />
            </>
          )}
        </motion.span>
      </motion.button>
    </div>
  );
}