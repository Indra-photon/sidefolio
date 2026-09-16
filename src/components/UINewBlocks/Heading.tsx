import React from "react";

import { twMerge } from "tailwind-merge";

export const Heading = ({
  className,
  children,
  as: Tag = "h1",
}: {
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}) => {
  return (
    <Tag
      className={twMerge(
        "font-heading text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-normal leading-[1.1] tracking-tight text-balance text-foreground",
        className,
      )}
    >
      {children}
    </Tag>
  );
};
