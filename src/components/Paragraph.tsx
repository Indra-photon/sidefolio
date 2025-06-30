// import React from "react";

// import localFont from "next/font/local";
// import { twMerge } from "tailwind-merge";

// export const Paragraph = ({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => {
//   return (
//     <p
//       className={twMerge(
//         "text-sm lg:text-base font-normal text-secondary",
//         className
//       )}
//     >
//       {children}
//     </p>
//   );
// };

import React from "react";

import localFont from "next/font/local";
import { twMerge } from "tailwind-merge";

export const Paragraph = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={twMerge(
        // MOBILE-FIRST RESPONSIVE PARAGRAPH SIZES - Much improved readability
        "text-base sm:text-lg md:text-xl lg:text-xl font-normal text-secondary leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
};