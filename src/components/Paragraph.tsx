import React from "react";

import localFont from "next/font/local";
import { twMerge } from "tailwind-merge";

const CalSans = localFont({
  src: [{ path: "../../fonts/CalSans-SemiBold.woff2" }],
  display: "swap",
});

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
        "text-xl font-normal text-blog",
        CalSans.className,
        className
      )}
    >
      {children}
    </p>
  );
};