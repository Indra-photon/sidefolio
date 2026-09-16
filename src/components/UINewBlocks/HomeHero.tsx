"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HairlineGrid } from "./HairlineGrid";
import { Heading, Text } from "./Typography";
import { HeroFacts } from "./HeroFacts";
import { ContributionsWidget } from "./ContributionsWidget";
import { PendantLamp } from "./PendantLamp";
import { LocationWidget } from "./LocationWidget";

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
  return (
    <HairlineGrid.Section
      index={index}
      total={total}
      title="Hey, welcome you.."
      id="hero"
    >
      {/* Headline block */}
      <div className="px-6 pb-12 lg:px-10 lg:pb-16">
        {/* <HairlineGrid.Eyebrow dotClassName="bg-emerald-500">
          Available for work
        </HairlineGrid.Eyebrow> */}

        <Heading variant="h1" className="mt-8">
          Design Engineer
        </Heading>
        <Text variant="body" className="mt-3 max-w-[45ch]">
          I make the web a better place to use focusing on design and
          micro-interactions.
        </Text>

        {/* Facts (one column) on the left, split-flap world clock on the right */}
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:items-end">
          <HeroFacts />
          <LocationWidget defaultView="map" className="sm:justify-self-end" />
        </div>
      </div>

      {/* GitHub activity (3/4) · lamp-lit CTAs (1/4) */}
      <div className="grid grid-cols-1 hairline-t lg:grid-cols-4 lg:hairline-divide-x">
        <div className="px-6 py-6 lg:col-span-3 lg:px-10">
          <ContributionsWidget />
        </div>

        <PendantLamp className="hairline-t lg:hairline-t-none">
          <div className="mb-3 flex min-h-7 items-center"></div>
          <div className="flex flex-col gap-3">
            <Link
              href={CONTACT_HREF}
              onClick={() =>
                pushEvent({
                  event: "contact_button_click",
                  button_text: "contact me",
                })
              }
              className="inline-flex w-full items-center justify-between gap-2 bg-primary px-4 py-2.5 transition-colors hover:bg-primary/90"
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
              className="inline-flex w-full items-center justify-between gap-2 shadow-border shadow-border-hover px-4 py-2.5 transition-[box-shadow,background-color] duration-150 ease-out hover:bg-accent"
            >
              <Text variant="labelSm" className="text-foreground">
                Book a Call
              </Text>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </PendantLamp>
      </div>
    </HairlineGrid.Section>
  );
}
