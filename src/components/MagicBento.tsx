import React from 'react';
import { servicesData } from '@/constants/service';
import { Paragraph } from './Paragraph';
import { Heading } from './Heading';
import { twMerge } from 'tailwind-merge';
import localFont from 'next/font/local';

const CalSans = localFont({
  src: [{ path: "../../fonts/CalSans-SemiBold.woff2" }],
  display: "swap",
});

const MagicBento = () => {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          
          {/* Card 1 - Large Top Left */}
          <div className="md:col-span-2 md:row-span-2 bg-neutral-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
            {/* <div className="absolute inset-0 opacity-10">
              <img src={servicesData[0].imgSrc} alt="" className="w-full h-full object-cover" />
            </div> */}
            <div className="relative z-10">
              <div className="text-neutral-600 mb-2">{servicesData[0].svg}</div>
              <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Featured</span>
            </div>
            <div className="relative z-10">
              <Heading className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                {servicesData[0].title}
              </Heading>
              <Paragraph className="text-neutral-600 text-sm md:text-base">
                {servicesData[0].description}
              </Paragraph>
            </div>
          </div>

          {/* Card 2 - Top Right */}
          <div className="md:col-span-2 bg-teal-800 rounded-3xl p-2 md:p-4 flex flex-col justify-between overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
            <div className="relative z-10">
              <h3 className={twMerge(CalSans.className, "text-2xl md:text-3xl font-bold text-white mb-2")}>
                {servicesData[1].title}
              </h3>
              <Paragraph className="text-teal-100 text-sm">
                {servicesData[1].description}
              </Paragraph>
            </div>
          </div>

          {/* Card 3 - Middle Left */}
          <div className="bg-red-600 rounded-3xl p-2 md:p-4 flex flex-col justify-between overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
            <div className="relative z-10">
              <div className="text-red-100 mb-2">{servicesData[2].svg}</div>
              <span className="text-xs font-medium text-red-200 uppercase tracking-wider">Premium</span>
            </div>
            <div className="relative z-10">
              <h3 className={twMerge(CalSans.className, "text-2xl md:text-3xl font-bold text-white mb-3")}>
                {servicesData[2].title}
              </h3>
            </div>
          </div>

          {/* Card 4 - Middle Center */}
          <div className="bg-neutral-100 rounded-3xl p-2 md:p-4 flex flex-col justify-between overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
            <div className="relative z-10">
              <div className="text-neutral-800 mb-2">{servicesData[3].svg}</div>
              <span className="text-xs font-medium text-neutral-800 uppercase tracking-wider">Premium</span>
            </div>
            <div className="relative z-10">
              <h3 className={twMerge(CalSans.className, "text-2xl md:text-3xl font-bold text-neutral-800 mb-3")}>
                {servicesData[3].title}
              </h3>
            </div>
          </div>

          {/* Card 5 - Tall Right (spans 2 rows) */}
          {/* <div className="md:row-span-2 bg-neutral-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute inset-0 opacity-10">
              <img src={servicesData[4].imgSrc} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10">
              <div className="text-neutral-600 mb-2">{servicesData[4].svg}</div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
                {servicesData[4].title}
              </h3>
              <p className="text-neutral-600 text-sm">
                {servicesData[4].description}
              </p>
            </div>
          </div> */}

          {/* Card 6 - Bottom Left */}
          {/* <div className="md:col-span-2 bg-teal-900 rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute inset-0 opacity-20">
              <img src={servicesData[5].imgSrc} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 text-center">
              <div className="text-teal-200 mb-3 flex justify-center">{servicesData[5].svg}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {servicesData[5].title}
              </h3>
              <p className="text-teal-100 text-sm max-w-md">
                {servicesData[5].description}
              </p>
            </div>
          </div> */}

        </div>
      </div>
    </div>
  );
};

export default MagicBento;