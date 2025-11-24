import React from "react";

export const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <main className={`w-full mx-auto md:px-10 relative ${className}`}>
      {/* <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-neutral-50 via-neutral-300 to-neutral-50"></div>
      <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-neutral-50 via-neutral-300 to-neutral-50"></div> */}
      {/* <div className="absolute right-0 top-36 h-px w-full bg-gradient-to-r from-neutral-50 via-neutral-300 to-neutral-50"></div> */}
      {children}
    </main>
  );
};
