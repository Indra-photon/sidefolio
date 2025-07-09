// "use client";
// import { cn } from "@/lib/utils";
// import { AnimatePresence, motion } from "framer-motion"; // Changed to match your imports
// import React, {
//   ReactNode,
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// interface ModalContextType {
//   open: boolean;
//   setOpen: (open: boolean) => void;
// }

// const ModalContext = createContext<ModalContextType | undefined>(undefined);

// export const ModalProvider = ({ children }: { children: ReactNode }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <ModalContext.Provider value={{ open, setOpen }}>
//       {children}
//     </ModalContext.Provider>
//   );
// };

// export const useModal = () => {
//   const context = useContext(ModalContext);
//   if (!context) {
//     throw new Error("useModal must be used within a ModalProvider");
//   }
//   return context;
// };

// export function Modal({ children }: { children: ReactNode }) {
//   return <ModalProvider>{children}</ModalProvider>;
// }

// export const ModalTrigger = ({
//   children,
//   className,
// }: {
//   children: ReactNode;
//   className?: string;
// }) => {
//   const { setOpen } = useModal();
//   return (
//     <button
//       className={cn(
//         "px-4 py-2 rounded-md text-black dark:text-white text-center relative overflow-hidden",
//         className
//       )}
//       onClick={() => setOpen(true)}
//     >
//       {children}
//     </button>
//   );
// };

// export const ModalBody = ({
//   children,
//   className,
// }: {
//   children: ReactNode;
//   className?: string;
// }) => {
//   const { open } = useModal();

//   useEffect(() => {
//     if (open) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//   }, [open]);

//   const modalRef = useRef(null);
//   const { setOpen } = useModal();
//   useOutsideClick(modalRef, () => setOpen(false));

//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           initial={{
//             opacity: 0,
//           }}
//           animate={{
//             opacity: 1,
//             backdropFilter: "blur(10px)",
//           }}
//           exit={{
//             opacity: 0,
//             backdropFilter: "blur(0px)",
//           }}
//           className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50"
//         >
//           <Overlay />

//           <motion.div
//             ref={modalRef}
//             className={cn(
//               "min-h-[50%] max-h-[90%] md:max-w-[40%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-hidden",
//               className
//             )}
//             initial={{
//               opacity: 0,
//               scale: 0.5,
//               rotateX: 40,
//               y: 40,
//             }}
//             animate={{
//               opacity: 1,
//               scale: 1,
//               rotateX: 0,
//               y: 0,
//             }}
//             exit={{
//               opacity: 0,
//               scale: 0.8,
//               rotateX: 10,
//             }}
//             transition={{
//               type: "spring",
//               stiffness: 260,
//               damping: 15,
//             }}
//           >
//             <CloseIcon />
//             {children}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export const ModalContent = ({
//   children,
//   className,
// }: {
//   children: ReactNode;
//   className?: string;
// }) => {
//   return (
//     <div className={cn("flex flex-col flex-1 p-8 md:p-10", className)}>
//       {children}
//     </div>
//   );
// };

// export const ModalFooter = ({
//   children,
//   className,
// }: {
//   children: ReactNode;
//   className?: string;
// }) => {
//   return (
//     <div
//       className={cn(
//         "flex justify-end p-4 bg-gray-100 dark:bg-neutral-900",
//         className
//       )}
//     >
//       {children}
//     </div>
//   );
// };

// const Overlay = ({ className }: { className?: string }) => {
//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//       }}
//       animate={{
//         opacity: 1,
//         backdropFilter: "blur(10px)",
//       }}
//       exit={{
//         opacity: 0,
//         backdropFilter: "blur(0px)",
//       }}
//       className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 ${className}`}
//     ></motion.div>
//   );
// };

// const CloseIcon = () => {
//   const { setOpen } = useModal();
//   return (
//     <button
//       onClick={() => setOpen(false)}
//       className="absolute top-4 right-4 group"
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
//       >
//         <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//         <path d="M18 6l-12 12" />
//         <path d="M6 6l12 12" />
//       </svg>
//     </button>
//   );
// };

// // Hook to detect clicks outside of a component.
// // Add it in a separate file, I've added here for simplicity
// export const useOutsideClick = (
//   ref: React.RefObject<HTMLDivElement>,
//   callback: Function
// ) => {
//   useEffect(() => {
//     const listener = (event: any) => {
//       // DO NOTHING if the element being clicked is the target element or their children
//       if (!ref.current || ref.current.contains(event.target)) {
//         return;
//       }
//       callback(event);
//     };

//     document.addEventListener("mousedown", listener);
//     document.addEventListener("touchstart", listener);

//     return () => {
//       document.removeEventListener("mousedown", listener);
//       document.removeEventListener("touchstart", listener);
//     };
//   }, [ref, callback]);
// };


"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Context for modal state management
const ModalContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export const Modal = ({ 
  children, 
  open: controlledOpen, 
  onOpenChange 
}: { 
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  // Use internal state if not controlled externally
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Determine if using controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const ModalTrigger = ({ 
  children,
  className = ""
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  const { setOpen } = useContext(ModalContext);
  
  return (
    <div 
      onClick={() => setOpen(true)}
      className={className}
    >
      {children}
    </div>
  );
};

export const ModalBody = ({ 
  children 
}: { 
  children: React.ReactNode;
}) => {
  const { open, setOpen } = useContext(ModalContext);
  
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-12 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
            className="relative z-10 w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-t-xl shadow-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const ModalFooter = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`p-4 rounded-b-xl shadow-xl ${className}`}>
      {children}
    </div>
  );
};