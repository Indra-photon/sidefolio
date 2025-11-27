"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface BlogLinkProps {
  href: string;
  articleTitle: string;
  className?: string;
  children: ReactNode;
}

export const BlogLink = ({ href, articleTitle, className, children }: BlogLinkProps) => {
  const handleClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'blog_click',
      article_url: href,
      article_title: articleTitle
    });
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};