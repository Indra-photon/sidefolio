"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

export const Footer = () => {

  const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = "Schedule Call";
    const buttonLink = "https://topmate.io/indranil_dev";
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
    // <div className="p-4 text-center justify-center text-xs text-neutral-500 border-t border-neutral-100">
    //   <span className="font-semibold">{new Date().getFullYear()} </span>
    //   &#8212; Let us build something amazing together!
    // </div>
    <div className=" w-full relative">
      <div
          className="absolute inset-0 z-0"
          style={{
          backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
          maskImage:
              "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
          }}
      />
          <div className='relative z-10 h-full flex flex-col justify-between'>
          <div>
              <h3 className='text-3xl md:text-4xl font-bold text-muted-foreground leading-tight tracking-tight'>
                  You focus <span className='text-foreground'>on</span>
              </h3>
              <h3 className='text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight'>
                  your company.
              </h3>
              <h3 className='text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mt-2'>
                  I make <span className='text-muted-foreground'>it happen.</span>
              </h3>
              <h2 className='text-4xl md:text-5xl font-bold text-foreground tracking-tight mt-4'>
                  Unstoppable Growth.
              </h2>
          </div>

          <button onClick={handleCTAClick} className='mt-8 bg-primary text-primary-foreground rounded-full px-8 py-2 flex items-center justify-between shadow-lg w-full md:w-1/2 hover:bg-primary/90 transition-colors'>
              <span className='font-semibold text-xl mr-4'>Schedule a Meeting</span>
              <div className='bg-primary-foreground/10 rounded-full p-2'>
                  <ArrowRight className='w-8 h-8' />
              </div>
          </button>
      </div>
    </div>
  );
};
