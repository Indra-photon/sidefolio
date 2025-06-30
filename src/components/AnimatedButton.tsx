import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedButtonProps {
  text: string;
  icon: LucideIcon;
  onClick?: (e?: React.MouseEvent) => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  stopPropagation?: boolean;
}

export default function AnimatedButton({
  text,
  icon: Icon,
  onClick,
  href,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  target = '_self',
  stopPropagation = false
}: AnimatedButtonProps) {
  
  // Variant styles
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    custom: '' // For completely custom styling
  };

  // Size styles
  const sizes = {
    sm: 'px-4 py-2 text-sm min-w-[120px]',
    md: 'px-6 py-3 text-base min-w-[160px]',
    lg: 'px-8 py-4 text-lg min-w-[200px]'
  };

  // Base classes
  const baseClasses = `
    font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg 
    relative overflow-hidden group cursor-pointer inline-block
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  // Handle click
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    if (stopPropagation) e.stopPropagation();
    if (onClick) onClick(e);
  };

  // Handle link click
  const handleLinkClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
  };

  // If href is provided, render as link
  if (href && !disabled) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={baseClasses}
        onClick={handleLinkClick}
      >
        <ButtonContent text={text} Icon={Icon} />
      </a>
    );
  }

  // Otherwise render as button
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={baseClasses}
    >
      <ButtonContent text={text} Icon={Icon} />
    </button>
  );
}

// Separate component for the animation content
function ButtonContent({ text, Icon }: { text: string; Icon: LucideIcon }) {
  return (
    <>
      {/* Text sliding out to the left */}
      <span className="group-hover:translate-x-[-200px] group-hover:opacity-0 flex items-center justify-center font-medium transition-all duration-300 ease-out">
        {text}
      </span>
      
      {/* Icon sliding in from the right */}
      <div className="translate-x-[200px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out">
        <Icon className="w-5 h-5" />
      </div>
    </>
  );
}

// Pre-built common button variations for convenience
export const ViewProjectButton = ({ onClick, href }: { onClick?: () => void; href?: string }) => (
  <AnimatedButton
    text="View Project"
    icon={require('lucide-react').ExternalLink}
    onClick={onClick}
    href={href}
    variant="primary"
    size="md"
  />
);

export const DownloadButton = ({ onClick, href }: { onClick?: () => void; href?: string }) => (
  <AnimatedButton
    text="Download"
    icon={require('lucide-react').Download}
    onClick={onClick}
    href={href}
    variant="success"
    size="md"
  />
);

export const LearnMoreButton = ({ onClick, href }: { onClick?: () => void; href?: string }) => (
  <AnimatedButton
    text="Learn More"
    icon={require('lucide-react').ArrowRight}
    onClick={onClick}
    href={href}
    variant="secondary"
    size="md"
  />
);

export const ShareButton = ({ onClick }: { onClick?: () => void }) => (
  <AnimatedButton
    text="Share"
    icon={require('lucide-react').Share2}
    onClick={onClick}
    variant="primary"
    size="sm"
  />
);