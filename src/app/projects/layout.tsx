import type { Metadata, Viewport } from 'next';
import Script  from 'next/script';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Indranil Maiti | Full Stack & GenAI Developer | Contact Me',
  description: 'Here, I share projects and case studies showcasing my expertise in full stack development and GenAI technologies. Explore how I leverage modern frameworks like React, Next.js, and Node.js to build scalable web applications. Get in touch to discuss how I can help bring your web development projects to life with cutting-edge AI integration and responsive design.',
  keywords: ['GenAI developer',
    'Full stack web developer',
    'React developer',
    'Next.js developer',
    'Node.js developer',
    'AI integration',
    'Scalable web applications',
    'Modern web technologies',
    'Freelance developer',
    'Responsive web design',
    'Web development services',
    'Digital experiences',
    'User-centric design',
    'Microinteractions',
    'Web animations',
    'Google SEO',
    'Website performance optimization',
    'Google Analytics integration',
    'Freelance web development',
    'Custom web solutions',],
  authors: [{ name: 'Indranil Maiti' }],
  creator: 'Indranil Maiti',
  publisher: 'Indranil Maiti',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.indrabuildswebsites.com/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.indrabuildswebsites.com/',
    title: 'Indranil Maiti | Full Stack & GenAI Developer',
    description: 'Here, I share projects and case studies showcasing my expertise in full stack development and GenAI technologies. Explore how I leverage modern frameworks like React, Next.js, and Node.js to build scalable web applications. Get in touch to discuss how I can help bring your web development projects to life with cutting-edge AI integration and responsive design.',
    siteName: 'Indranil Maiti | Full Stack & GenAI Developer',
    images: [
      {
        url: 'https://www.indrabuildswebsites.com/images/Indranil_2.jpg',
        width: 1200,
        height: 630,
        alt: 'Indranil Maiti - Full Stack Developer and GenAI Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indranil Maiti | Full Stack & GenAI Developer',
    description: 'Here, I share projects and case studies showcasing my expertise in full stack development and GenAI technologies. Explore how I leverage modern frameworks like React, Next.js, and Node.js to build scalable web applications. Get in touch to discuss how I can help bring your web development projects to life with cutting-edge AI integration and responsive design.',
    images: ['/images/Indranil_2.jpg'],
    creator: '@Nil_phy_dreamer',
  },
  icons: {
    icon: '/images/Indranil_2.jpg',
    apple: '/images/Indranil_2.jpg',
  },
};
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Indranil Maiti | Full Stack & GenAI Developer',
    description: 'Here, I share projects and case studies showcasing my expertise in full stack development and GenAI technologies. Explore how I leverage modern frameworks like React, Next.js, and Node.js to build scalable web applications. Get in touch to discuss how I can help bring your web development projects to life with cutting-edge AI integration and responsive design.',
    url: 'https://www.indrabuildswebsites.com/',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.indrabuildswebsites.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://www.linkedin.com/in/indranil-maiti-7542941b7/',
      'https://x.com/Nil_phy_dreamer',
      'https://www.youtube.com/@indranilmaiti842',
    ],
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Indranil Maiti | Full Stack & GenAI Developer',
    description: 'Here, I share projects and case studies showcasing my expertise in full stack development and GenAI technologies. Explore how I leverage modern frameworks like React, Next.js, and Node.js to build scalable web applications. Get in touch to discuss how I can help bring your web development projects to life with cutting-edge AI integration and responsive design.',
    url: 'https://www.indrabuildswebsites.com/',
    logo: 'https://www.indrabuildswebsites.com/images/Indranil_2.jpg',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@indrabuildswebsites.com',
      contactType: 'Web Developer',
    },
    sameAs: [
      'https://www.linkedin.com/in/indranil-maiti-7542941b7/',
      'https://x.com/Nil_phy_dreamer',
      'https://www.youtube.com/@indranilmaiti842',
    ],
  };

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className='p-6 sm:p-0'>
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </div>
  );
}
