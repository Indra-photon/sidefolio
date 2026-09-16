"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { HairlineGrid } from "./HairlineGrid";
import { Heading, Text } from "./Typography";
import { HeroFacts } from "./HeroFacts";
import { socials } from "@/constants/socials";

const CONTACT_HREF = "/contact";
const CALL_HREF = "https://topmate.io/indranil_dev";

function pushEvent(data: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ...data, page_location: window.location.href });
}

/**
 * Homepage hero: status eyebrow, headline, tagline, stack summary,
 * two CTAs and social links — laid out on the hairline grid.
 */
export function HomeHero({ index, total }: { index?: number; total?: number }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <HairlineGrid.Section index={index} total={total} title="Hey, welcome you.." id="hero">
      {/* Headline block */}
      <div className="px-6 pb-12 lg:px-10 lg:pb-16">
        {/* <HairlineGrid.Eyebrow dotClassName="bg-emerald-500">
          Available for work
        </HairlineGrid.Eyebrow> */}

        <Heading variant="h1" className="mt-8">
          Design Engineer
        </Heading>

        <Text variant="body" className="mt-3 max-w-[65ch]">
          I make the web a better place to use focusing on design and
          micro-interactions.
        </Text>

        {/* Facts: role, current project, location, time, contact */}
        <HeroFacts className="mt-12" />
      </div>

      {/* Stack summary */}
      <div className="hairline-t px-6 py-8 lg:px-10">
        <Text variant="label">Stack</Text>
        <Text variant="cardDescription" className="mt-3 max-w-[65ch]">
          <span className="text-foreground">React, Next.js</span> on the front
          end, <span className="text-foreground">Node.js, Express</span> on the
          back end,{" "}
          <span className="text-foreground">MongoDB, PostgreSQL, Supabase</span>{" "}
          for data, and{" "}
          <span className="text-foreground">
            Vercel, AWS, Linode, DigitalOcean
          </span>{" "}
          for deployment with CI/CD, load balancing and scalability.
        </Text>
      </div>

      {/* CTAs + socials */}
      <HairlineGrid.Row cols={2} className="hairline-t">
        <HairlineGrid.Cell>
          <div className="flex h-full flex-col justify-between gap-6 px-6 py-6 lg:px-10">
            <Text variant="label">Get in touch</Text>
            <div className="flex flex-wrap gap-3">
              <Link
                href={CONTACT_HREF}
                onClick={() =>
                  pushEvent({
                    event: "contact_button_click",
                    button_text: "contact me",
                  })
                }
                className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 transition-colors hover:bg-primary/90"
              >
                <Text variant="labelSm" className="text-primary-foreground">
                  Contact me
                </Text>
                <ArrowUpRight className="h-3.5 w-3.5 text-primary-foreground" />
              </Link>
              <Link
                href={CALL_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  pushEvent({
                    event: "contact_button_click",
                    button_text: "book a free call",
                  })
                }
                className="inline-flex items-center gap-2 shadow-border shadow-border-hover px-5 py-2.5 transition-[box-shadow,background-color] duration-150 ease-out hover:bg-accent"
              >
                <Text variant="labelSm" className="text-foreground">
                  Book a free call
                </Text>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </HairlineGrid.Cell>

        <HairlineGrid.Cell>
          <div className="flex h-full flex-col justify-between gap-6 px-6 py-6 lg:px-10">
            <Text variant="label">Find me</Text>
            <div className="-ml-2 flex flex-wrap">
              {socials.map((s, i) => (
                <Link
                  key={s.url}
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel={
                    s.url.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  aria-label={s.label}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() =>
                    pushEvent({
                      event: "social_media_click",
                      social_platform: s.url,
                    })
                  }
                  className="relative p-2.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {hovered === i && (
                    <motion.span
                      layoutId="home-social-hover"
                      className="absolute inset-0 bg-accent"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                  <s.icon className="relative z-10 h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </HairlineGrid.Cell>
      </HairlineGrid.Row>
    </HairlineGrid.Section>
  );
}
