"use client";
import { Paragraph } from "@/components/Paragraph";
import Image from "next/image";

import { motion } from "framer-motion";

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

      <div className="max-w-7xl">
        <Paragraph className=" mt-4">
          Hey there, I'm Indranil Maiti - a passionate developer who believes 
          that great code is just the beginning of an extraordinary journey. 
          From the early days of my coding adventure, I've been captivated by 
          the art of transforming ideas into digital reality. My goal is to not 
          just write software, but to craft digital experiences that seamlessly 
          blend innovation with elegance.
        </Paragraph>

        <Paragraph className=" mt-4">
          But my curiosity doesn't end with lines of code. With a heart that 
          beats for history's fascinating tales and a mind that dreams of 
          exploring every corner of our beautiful world, I find inspiration in 
          the stories of civilizations past and the adventures that await in 
          distant lands. These passions fuel my creativity and bring unique 
          perspectives to everything I build.
        </Paragraph>

        <Paragraph className=" mt-4">
          What truly sets me apart is my love for the finer things in life. 
          Whether I'm experimenting with new flavors in the kitchen, crafting 
          the perfect dish that brings people together, or getting lost in the 
          strategic brilliance of a cricket match, I believe that passion and 
          attention to detail matter in everything we do. This philosophy flows 
          into my development work, ensuring every project is seasoned with care 
          and precision.
        </Paragraph>

        <Paragraph className=" mt-4">
          Through this website, I aim to share my journey of code, culture, and 
          creativity with you. Whether you're a fellow developer seeking 
          innovative solutions, a history enthusiast ready to dive into 
          captivating narratives, a travel dreamer planning your next adventure, 
          or simply someone who appreciates the art of good food and great 
          cricket, there's something here for you.
        </Paragraph>

        <Paragraph className=" mt-4">
          Join me on this journey of algorithms and adventures, logic and 
          wanderlust, code and culture. Together, we can explore the boundless 
          possibilities of technology and life's beautiful experiences, all while 
          celebrating the passion that drives us to create, discover, and savor 
          every moment.
        </Paragraph>
        <Paragraph className=" mt-4">
          Thank you for being here, and I can&apos;t wait to embark on this
          adventure with you.
        </Paragraph>
      </div>
    </div>
  );
}
