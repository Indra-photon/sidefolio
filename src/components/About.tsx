"use client";
import { Paragraph } from "@/components/Paragraph";
import Image from "next/image";

import { motion } from "framer-motion";
import { Footer } from "./Footer";

export default function About() {
  const images = [
    "https://images.unsplash.com/photo-1692544350322-ac70cfd63614?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1692374227159-2d3592f274c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1692005561659-cdba32d1e4a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1692445381633-7999ebc03730?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
  ];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 my-10">
        {images.map((image, index) => (
          <motion.div
            key={image}
            initial={{
              opacity: 0,
              y: -50,
              rotate: 0,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: index % 2 === 0 ? 3 : -3,
            }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <Image
              src={image}
              width={200}
              height={400}
              alt="about"
              className="rounded-md object-cover transform rotate-3 shadow-xl block w-full h-40 md:h-60 hover:rotate-0 transition duration-200"
            />
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        <Paragraph className=" mt-4 text-neutral-400 text-sm sm:text-md lg:text-[18px]">
          Hey there, I'm Indranil Maiti - a passionate developer who believes 
          that great code is just the beginning of an extraordinary journey. 
          From the early days of my coding adventure, I've been captivated by 
          the art of transforming ideas into digital reality. My goal is to not 
          just write software, but to craft digital experiences that seamlessly 
          blend innovation with elegance.
        </Paragraph>

        <Paragraph className=" mt-4 text-neutral-400 text-sm sm:text-md lg:text-[18px]">
          Whenever I build a website for someone , I see it as more than just a screen with some content but an opportunity to tell a <span className="font-semibold text-neutral-200">
            story, evoke emotions, and create lasting
          connections</span>. I pour my heart into every pixel and line of code,ensuring <span className="font-semibold text-neutral-200"> every user remembers the experience long after they've left.
          Every microinteraction, every animation, and every detail is meticulously designed to leave a lasting impression.</span>
        </Paragraph>

        <Paragraph className=" mt-4 text-neutral-200 text-sm sm:text-md lg:text-[18px]">
          My expertise spans a wide range of technologies, from crafting sleek 
          front-end interfaces with React and Next.js to building robust 
          back-end systems using Node.js and Express. I integrate databases, 
          APIs, and cloud services to create full-stack solutions that are not 
          only functional but also scalable and secure.I thrive on solving 
          complex problems and turning challenges into opportunities for growth 
          and innovation.
        </Paragraph>

        <Paragraph className=" mt-4 text-neutral-400 text-sm sm:text-md lg:text-[18px]">
          Your website needs to be integrated with services like <span className="font-semibold text-neutral-200">Google Analytics, Search Console, and Google Tag Manager</span> to ensure optimal performance and visibility.
          I specialize in seamlessly integrating these essential tools to help
          you monitor traffic, analyze user behavior, and optimize your online 
          presence. By leveraging these powerful platforms, I ensure that your 
          website not only looks great but also performs at its best, driving 
          growth and success for your business.
        </Paragraph>

        <Paragraph className=" mt-4 text-neutral-400 text-sm sm:text-md lg:text-[18px]">
          But my curiosity doesn't end with lines of code. With a heart that 
          beats for history's fascinating tales and a mind that dreams of 
          exploring every corner of our beautiful world, I find inspiration in 
          the stories of civilizations past and the adventures that await in 
          distant lands. These passions fuel my creativity and bring unique 
          perspectives to everything I build.
        </Paragraph>

        <Paragraph className=" mt-4 text-neutral-400 text-sm sm:text-md lg:text-[18px] mb-24">
          What truly sets me apart is my love for the finer things in life. 
          Whether I'm experimenting with new flavors in the kitchen, crafting 
          the perfect dish that brings people together, or getting lost in the 
          strategic brilliance of a cricket match, I believe that passion and 
          attention to detail matter in everything we do. This philosophy flows 
          into my development work, ensuring every project is seasoned with care 
          and precision.
        </Paragraph>

        <Footer />

        {/* <Paragraph className=" mt-4 text-neutral-400 text-sm sm:text-md lg:text-[18px]">
          Join me on this journey of algorithms and adventures, logic and 
          wanderlust, code and culture. Together, we can explore the boundless 
          possibilities of technology and life's beautiful experiences, all while 
          celebrating the passion that drives us to create, discover, and savor 
          every moment.
        </Paragraph>
        <Paragraph className=" mt-4 text-neutral-400 text-sm sm:text-md lg:text-[18px]">
          Thank you for being here, and I can&apos;t wait to embark on this
          adventure with you.
        </Paragraph> */}
      </div>
    </div>
  );
}
