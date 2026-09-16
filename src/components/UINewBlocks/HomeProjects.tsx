"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { HairlineGrid } from "./HairlineGrid";
import { Heading, Text } from "./Typography";
import { products } from "@/constants/products";

function trackProject(url: string, name: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "project_click",
    project_url: url,
    project_name: `${name}_from_featured_section`,
  });
}

/** Featured projects as hairline cells: index / title + summary / stack + links. */
export function HomeProjects({ index, total }: { index?: number; total?: number }) {
  const featured = products.filter((p) => p.isFeatured);
  if (featured.length === 0) return null;

  return (
    <HairlineGrid.Section index={index} total={total} id="projects">
      <div className="flex items-end justify-between px-6 py-8 lg:px-10">
        <div>
          <HairlineGrid.Eyebrow>Selected work</HairlineGrid.Eyebrow>
          <Heading variant="h2" className="mt-5">
            Projects
          </Heading>
        </div>
        <Link href="/projects" className="group">
          <Text variant="labelSm" className="transition-colors group-hover:text-foreground">
            View all →
          </Text>
        </Link>
      </div>

      <HairlineGrid.Row cols={2} className="hairline-t">
        {featured.map((p, i) => {
          const url = p.slug ? `/projects/${p.slug}` : p.href;
          return (
            <HairlineGrid.Cell key={p.slug ?? p.href}>
              <HairlineGrid.Cell.Row className="flex items-center justify-between py-3">
                <Text variant="label">
                  {String(i + 1).padStart(2, "0")}
                </Text>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${p.title} live site`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </HairlineGrid.Cell.Row>

              <HairlineGrid.Cell.Row className="flex-1 py-8">
                <Link
                  href={url}
                  onClick={() => trackProject(url, p.title)}
                  className="group block"
                >
                  <Text variant="cardHeader" className="flex items-center gap-2">
                    {p.title}
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                  </Text>
                  <Text variant="cardDescription" className="mt-3 max-w-[60ch]">
                    {p.description}
                  </Text>
                </Link>
              </HairlineGrid.Cell.Row>

              {p.stack && (
                <HairlineGrid.Cell.Row className="flex flex-wrap gap-x-4 gap-y-1 py-3">
                  {p.stack.map((s) => (
                    <Text key={s} variant="labelSm">
                      {s}
                    </Text>
                  ))}
                </HairlineGrid.Cell.Row>
              )}
            </HairlineGrid.Cell>
          );
        })}
      </HairlineGrid.Row>
    </HairlineGrid.Section>
  );
}
