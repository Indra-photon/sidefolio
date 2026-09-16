import React from "react";

import { twMerge } from "tailwind-merge";

export const Paragraph = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p className={twMerge("text-xl font-normal text-foreground", className)}>
      {children}
    </p>
  );
};
