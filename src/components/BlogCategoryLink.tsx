"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface BlogCategoryLinkProps {
  href: string;
  categoryName: string;
  className?: string;
  children: ReactNode;
}

export const BlogCategoryLink = ({ href, categoryName, className, children }: BlogCategoryLinkProps) => {
  const handleClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'blog_category_click',
      category_name: categoryName,
      category_url: href,
      page_location: window.location.href
    });
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};