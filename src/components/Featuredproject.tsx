

import Link from 'next/link';
import { Paragraph } from './Paragraph';
import { Container } from './Container';
import { products } from '@/constants/products';
import { IconExternalLink } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { IconFolderCode } from '@tabler/icons-react';

export default function FeaturedProject() {
  // Get all featured projects
  const featuredProjects = products.filter(product => product.isFeatured);
  const router = useRouter();

  if (featuredProjects.length === 0) return null;

  return (
      <Container className="py-10 px-0 sm:px-8">
        <div className="flex items-center justify-between mb-4 relative">
          <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-neutral-100 via-neutral-700 to-transparent"></div>
          <div className="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-neutral-100 via-neutral-700 to-transparent"></div>
          <Paragraph className="text-2xl md:text-3xl font-bold text-neutral-50 pb-2">
            <span className="flex items-center">
              
              Projects
            </span>
          </Paragraph>
          <Link href="/projects" className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors">
            (view all)
          </Link>
        </div>

        <div className="space-y-0 py-10">
          {featuredProjects.map((project) => {
            const projectUrl = project.slug ? `/projects/${project.slug}` : project.href;
            
            return (
                <div
                key={project.slug || project.href}
                className="flex items-center justify-between py-4 border-b border-neutral-800 hover:border-neutral-700 transition-colors">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col">
                    <Paragraph className="text-lg sm:text-xl lg:text-2xl font-extralight text-neutral-100 group-hover:text-neutral-300 transition-colors truncate pr-4">
                      {project.title}
                    </Paragraph>
                    <Paragraph className="text-sm text-neutral-400">
                      {project.description}
                    </Paragraph>
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
                      <div className="inline-block mt-6">
                        <button className="text-xs md:text-sm px-2 py-1 text-neutral-200 bg-white/20 transition-colors rounded-lg w-max">
                          Know More...
                        </button>
                      </div>
                    </Link>
                    </div>
                    <div className="hidden md:flex flex-1 mx-4 border-b border-dotted border-neutral-800" />
                  </div>
                  <Link
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer">
                    <span
                    className="text-sm md:text-base text-neutral-500 whitespace-nowrap ml-4">
                      <IconExternalLink className="inline-block ml-1 mb-0.5 w-4 h-4" />
                    </span>
                  </Link>
                </div>
            );
          })}
        </div>
      </Container>
  );
}