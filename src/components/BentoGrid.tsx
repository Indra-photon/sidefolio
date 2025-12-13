"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { Paragraph } from "./Paragraph";
import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { TrashSvg, DownloadSvg, CartSvg, CartIconSvg, ResetSvg } from "@/constants/icons";
import { title } from "process";


export function BentoGridThirdDemo() {
  return (
    <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const SkeletonOne = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);
  const [deleteState, setDeleteState] = useState<'idle' | 'deleting' | 'deleted'>('idle');
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'downloaded'>('idle');
  const [cartState, setCartState] = useState<'idle' | 'adding' | 'added'>('idle');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>("idle")

      const handleReset = () => {
      setDeleteState('idle');
      setDownloadState('idle');
      setCartState('idle');
      setIsHovered(false);
      setIsDownloadHovered(false);
    };

    const handleDelete = () => {
        setDeleteState('deleting');
        setIsHovered(false);
        
        setTimeout(() => {
            setDeleteState('deleted');
            setTimeout(() => {
            // setDeleteState('idle');
            }, 1000); // Shows "Deleted" for 1 second
        }, 2000); // Shows "Deleting..." for 1 second
    }

    const handleDownload = () => {
        setDownloadState('downloading');
        setIsDownloadHovered(false);
        setTimeout(() => {
            setDownloadState('downloaded');
            setTimeout(() => {
            // setDownloadState('idle');
            }, 1000); // Shows "Downloaded" for 1 second
        }, 3000); // Shows "Downloading..." for 2 seconds
    };

    const handleCartClick = () => {
        setCartState('adding');
        setTimeout(() => {
            setCartState('added');
            setTimeout(() => {
            // setCartState('idle');
            }, 1000); // Shows "Added" for 1 second
        }, 2000); // Shows "Adding..." for 2 seconds
    };

    const handleClick = () => {
      if (saveState !== "idle") return

      setSaveState("saving")

      setTimeout(() => {
        setSaveState("saved")

        setTimeout(() => {
          setSaveState("idle")
        }, 1000)
      }, 1000)
    }

    const buttonText = {
      idle: "Save",
      saving: "Saving",
      saved: "Saved",
    }

  return (
    <motion.div
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 relative"
    >
      <motion.button
          onClick={handleDelete}
          initial={{ width: '140px', scale: 1 }}
          whileHover={deleteState === 'idle' ? { width: '260px', scale: 1, transition: { duration: 0.2 } } : {}}
          animate={{ 
          width: deleteState === 'deleting' ? '260px' : deleteState === 'deleted' ? '260px' : '140px'
          }}
          onHoverStart={() => deleteState === 'idle' ? setIsHovered(true) : null}
          onHoverEnd={() => deleteState === 'idle' ? setIsHovered(!isHovered) : null}
          className={`flex items-center justify-center gap-4 bg-red-900 rounded-3xl cursor-pointer ${deleteState !== 'idle' ? 'pointer-events-none' : ''}`}
      >
          <AnimatePresence mode="wait">
              <motion.span 
                  key={deleteState !== 'idle' ? deleteState : (isHovered ? 'hovered' : 'not-hovered')}
                  className='text-white tracking-tighter flex items-center justify-center gap-2 px-3 py-2'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  
              >
                  {deleteState === 'deleting' ? 'Deleting...' : 
                  deleteState === 'deleted' ? 'Deleted successfully' : 
                  (isHovered ? 'Are you sure?' : 'Delete')}
                  <motion.span
                      key={deleteState}
                      initial={{ rotate: 0 }}
                      animate={{ rotate: deleteState === 'deleting' ? 360 : 0 }}
                      transition={{ duration: deleteState === 'deleting' ? 1 : 0 }} 
                  >
                      <TrashSvg deleteState={deleteState} />
                  </motion.span>
              </motion.span>
          </AnimatePresence>
      </motion.button>

      <div className="flex items-center justify-end">
        <motion.button
          onClick={handleDownload}
          onHoverStart={() => downloadState === 'idle' ? setIsDownloadHovered(true) : null}
          onHoverEnd={() => downloadState === 'idle' ? setIsDownloadHovered(false) : null}
          className={`flex items-center justify-center gap-4 w-[240px] bg-green-900 rounded-3xl cursor-pointer ${deleteState !== 'idle' ? 'pointer-events-none' : ''}`}>
          <motion.span
          key={isDownloadHovered ? 'hovered' : 'not-hovered'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className='text-white tracking-tighter flex items-center justify-center gap-2 px-3 py-2'>

            <AnimatePresence mode="wait">
              { downloadState === 'idle' && 
                <motion.span 
                  key={isDownloadHovered ? 'hovered' : 'not-hovered'}
                  layoutId="download-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  {isDownloadHovered ? 'Ready to Download?' : 'Download'}
                </motion.span>
              }
              { downloadState === 'downloading' && 
                <motion.span 
                  key="downloading"
                  layoutId="download-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  Downloading...
                </motion.span>
              }
              { downloadState === 'downloaded' && 
                <motion.span 
                  key="downloaded"
                  layoutId="download-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  Downloaded successfully
                </motion.span>
              }

              <motion.span
              layout
              key='download-icon'
              layoutId="download-text-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <DownloadSvg downloadState={downloadState} />
            </motion.span>
            </AnimatePresence>

          </motion.span>

        </motion.button>
      </div>

      <motion.div>
        <motion.div onClick={handleCartClick} className="relative overflow-hidden flex items-center justify-center gap-4 w-3/4 rounded-3xl cursor-pointer mt-2">
          <div className="absolute top-0 left-0 w-full h-full animate-gradient rounded-3xl z-0"
          style={{
            background: "linear-gradient(-45deg, #1a1a1a, #ffffff, #6b7280, #d1d5db, #1a1a1a)",
            backgroundSize: "400% 400%",
          }}></div>
          <motion.div className=" bg-neutral-800 rounded-3xl flex items-center justify-center gap-4 m-1 w-full relative z-10">

            <motion.span
              initial={{ x: 0 }}
              animate={{ 
                x: cartState === 'idle' ? 0 : (cartState === 'adding' ? 100 : 240) 
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-white h-8 w-8 relative"
            >
              {/* Cart icon - always visible */}
              <CartSvg cartState={cartState} />
            </motion.span>

            <AnimatePresence>
              {cartState === 'added' && (
                <motion.div
                  key="cart-icon-added"
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 10, opacity: 1 }}
                  exit={{ x: 40, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute left-5 h-8 w-8"
                >
                  <CartIconSvg />
                </motion.div>
              )}
            </AnimatePresence>



            <motion.span className="text-white text-xl h-10 tracking-tighter flex items-center justify-center w-40">
              <AnimatePresence mode="wait">
                { cartState === 'idle' && 
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center"
                  >
                    <p className="text-md">Add to Cart</p>
                  </motion.span>
                }
                { cartState === 'added' && 
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center"
                  >
                    <p className="text-md">Great Shopping!</p>
                  </motion.span>
                }
              </AnimatePresence>
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* <motion.div>
        <div className={cn("relative inline-flex items-center")}>

        <button
            onClick={handleClick}
            disabled={saveState !== "idle"}
            className="flex items-center justify-center bg-[#2d2d2d] text-white font-medium text-lg px-8 py-4 rounded-full transition-colors duration-300 hover:bg-[#3d3d3d] disabled:cursor-default disabled:hover:bg-[#2d2d2d]"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={saveState}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {buttonText[saveState]}
              </motion.span>
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {(saveState === "saving" || saveState === "saved") && (
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ x: -20, y: 20, opacity: 0, scale: 0.5 }}
                animate={
                  saveState === "saving" ? { x: 0, y: 0, opacity: 1, scale: 1 } : { x: 0, y: 0, opacity: 0, scale: 0.5 }
                }
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="relative w-10 h-10">
                  <svg className="w-full h-full" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="#3d3d3d" stroke="#4a4a4a" strokeWidth="4" />
                  </svg>
                  <motion.svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 40 40"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="25 75"
                      strokeDashoffset="0"
                    />
                  </motion.svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div> */}

      <motion.button onClick={handleReset} className="text-black dark:text-white mt-4 underline text-sm absolute bottom-0 right-0 h-3 w-3">
        <ResetSvg />
      </motion.button>

    </motion.div>
  );
};
const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      {arr.map((_, i) => (
        <motion.div
          key={"skelenton-two" + i}
          variants={variants}
          style={{
            maxWidth: Math.random() * (100 - 40) + 40 + "%",
          }}
          className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-neutral-100 dark:bg-black w-full h-4"
        ></motion.div>
      ))}
    </motion.div>
  );
};
const SkeletonThree = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
      style={{
        background:
          "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  );
};
const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <img
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Just code in Vanilla Javascript
        </p>
        <p className="border border-red-500 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Delusional
        </p>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <img
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Tailwind CSS is cool, you know
        </p>
        <p className="border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Sensible
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <img
          src="https://pbs.twimg.com/profile_images/1417752099488636931/cs2R59eW_400x400.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          I love angular, RSC, and Redux.
        </p>
        <p className="border border-orange-500 bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Helpless
        </p>
      </motion.div>
    </motion.div>
  );
};
const SkeletonFive = () => {

  const Testimonials = [
  {
    imgLink: "https://i.pravatar.cc/150?img=11",
    text: "Working with this developer completely transformed our website. The new UI is clean, fast, and customers love it. Our conversions increased immediately."
  },
  {
    imgLink: "https://i.pravatar.cc/150?img=32",
    text: "We needed a full redesign plus backend improvements. He delivered a scalable system, optimized database, and flawless deployment. Highly recommended."
  },
  {
    imgLink: "https://i.pravatar.cc/150?img=45",
    text: "Amazing attention to detail. He handled our UI/UX, performance, and SEO setup — including GSC, Analytics, and Tag Manager — all in one smooth workflow."
  },
  {
    imgLink: "https://i.pravatar.cc/150?img=18",
    text: "Our old site kept crashing. He rebuilt the backend architecture, fixed the database issues, and now everything runs lightning fast and stable."
  },
  {
    imgLink: "https://i.pravatar.cc/150?img=29",
    text: "Professional, fast, and communicative. Delivered a modern frontend and a well-structured API that scales with our growing traffic."
  },
  {
    imgLink: "https://i.pravatar.cc/150?img=7",
    text: "He integrated Analytics and Tag Manager perfectly. Now we can actually track user behavior and optimize our marketing. Great work!"
  },
  {
    imgLink: "https://i.pravatar.cc/150?img=64",
    text: "From design to deployment, everything was handled with expertise. The UI feels premium and the backend is rock solid."
  },
  {
    imgLink: "https://i.pravatar.cc/150?img=53",
    text: "Our business site loads 3× faster now. He optimized everything — code, images, caching, database — and it shows in our SEO results."
  },
  {
    imgLink: "https://i.pravatar.cc/150?img=24",
    text: "Fantastic full-stack developer. Clear communication, beautiful UI, and a backend architecture that will last us years. Worth every dollar."
  }
];


  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        className="relative overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)] h-full flex flex-col rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  items-start space-x-2 bg-neutral-300 dark:bg-black"
      >
      <motion.div
      initial={{ y: 0 }}
        animate={{ y: ["0%", '-50%'] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }} 
        className="flex flex-col p-1 space-y-4">
        {/* {...Testimonials.map((item, index) => (
          <div key={"testimonial"+index} className={`flex-shrink-0 flex flex-row items-start space-x-4 ${index%2 === 0 ? 'bg-neutral-200 ml-7 dark:bg-white/[0.05] p-2 rounded-lg' : ''}`}>
            <img
              src={item.imgLink}
              alt="avatar"
              height="100"
              width="100"
              className="rounded-full h-10 w-10"
            />
            <p className="text-xs text-neutral-500 max-w-xs">
              {item.text}
            </p>
          </div>
        ))} */}
        {[...new Array(2)].fill(0).map((_, arrayIndex) => (
            <React.Fragment key={`array-${arrayIndex}`}>
              {Testimonials.map((item, index) => (
                <div
                  key={`testimonial-${arrayIndex}-${index}`}
                  className={`flex-shrink-0 flex flex-row items-start space-x-4 ${
                    index % 2 === 0
                      ? "bg-neutral-50 ml-7 dark:bg-white/[0.05] p-2 rounded-lg"
                      : ""
                  }`}
                >
                  <img
                    src={item.imgLink}
                    alt="avatar"
                    height="100"
                    width="100"
                    className="rounded-full h-10 w-10"
                  />
                  <p className="text-xs text-neutral-500 max-w-xs">
                    {item.text}
                  </p>
                </div>
              ))}
            </React.Fragment>
          ))}
      </motion.div>
      </motion.div>
    </motion.div>
  );
};
const items = [
  {
    title: <Paragraph className="text-lg text-neutral-600 dark:text-neutral-200">Microinteractions on Buttons make your UI come alive</Paragraph>,
    description: (
      <Paragraph className="text-sm text-neutral-400 dark:text-neutral-200">
          Experience microinteractions on clicking the buttons.
        </Paragraph>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <></>,
  },
  {
    title: "Automated Proofreading",
    description: (
      <span className="text-sm">
        Let AI handle the proofreading of your documents.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Contextual Suggestions",
    description: (
      <span className="text-sm">
        Get AI-powered suggestions based on your writing context.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Sentiment Analysis",
    description: (
      <span className="text-sm">
        Understand the sentiment of your text with AI analysis.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: <Paragraph className="text-lg text-neutral-600 dark:text-neutral-200">Infinite Scroll Testimonials</Paragraph>,
    description: (
        <Paragraph className="text-sm text-neutral-400 dark:text-neutral-200">
          People love what I build! 
        </Paragraph>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <></>,
  },
];
