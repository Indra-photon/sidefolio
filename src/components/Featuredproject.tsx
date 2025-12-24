

import Link from 'next/link';
import { Paragraph } from './Paragraph';
import { Container } from './Container';
import { products } from '@/constants/products';
import { IconExternalLink } from '@tabler/icons-react';

export default function FeaturedProject() {
  // Get all featured projects
  const featuredProjects = products.filter(product => product.isFeatured);

  if (featuredProjects.length === 0) return null;

  return (
      <Container className="py-10 px-0 sm:px-8">
        <div className="flex items-center justify-between mb-4">
          <Paragraph className="text-xl md:text-2xl font-bold">Projects</Paragraph>
          <Link href="/projects" className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors">
            (view all)
          </Link>
        </div>

        <div className="space-y-0">
          {featuredProjects.map((project) => {
            const projectUrl = project.slug ? `/projects/${project.slug}` : project.href;
            
            return (
              <Link 
                key={project.slug || project.href}
                href={projectUrl} 
                className="group block"
                onClick={() => {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: 'project_click',
                    project_url: projectUrl,
                    project_name: `${project.title}_from_featured_section`
                  });
                }}
              >
                <div className="flex items-center justify-between py-4 border-b border-neutral-800 hover:border-neutral-700 transition-colors">
                  <div className="flex items-center flex-1 min-w-0">
                    <Paragraph className="text-sm sm:text-md lg:text-[18px] font-extralight text-neutral-400 group-hover:text-neutral-300 transition-colors truncate pr-4">
                      {project.title}
                    </Paragraph>
                    <div className="hidden md:flex flex-1 mx-4 border-b border-dotted border-neutral-800" />
                  </div>
                  <span className="text-sm md:text-base text-neutral-500 whitespace-nowrap ml-4">
                    <IconExternalLink className="inline-block ml-1 mb-0.5 w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
  );
}