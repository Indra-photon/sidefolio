"use client";

import { ArrowRight } from "lucide-react";
import { HairlineGrid } from "./HairlineGrid";
import { Heading, Text } from "./Typography";

const CALL_HREF = "https://topmate.io/indranil_dev";

/** Closing CTA — the old Footer headline, on the grid. */
export function HomeCTA({ index, total }: { index?: number; total?: number }) {
  const handleClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "contact_button_click",
      button_text: "schedule a meeting",
      page_location: window.location.href,
    });
  };

  return (
    <HairlineGrid.Section index={index} total={total} id="cta">
      <div className="px-6 py-14 lg:px-10 lg:py-20">
        <Heading variant="h2" className="text-muted-foreground">
          You focus on <span className="text-foreground">your company.</span>
          <br />
          <span className="text-foreground">I make</span> it happen.
        </Heading>
        <Heading variant="h2" as="p" className="mt-4">
          Unstoppable growth.
        </Heading>
      </div>

      <a
        href={CALL_HREF}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group flex items-center justify-between hairline-t px-6 py-6 transition-colors hover:bg-accent/40 lg:px-10"
      >
        <Text variant="label" as="span" className="text-foreground">
          Schedule a meeting
        </Text>
        <span className="flex h-10 w-10 items-center justify-center bg-primary text-primary-foreground transition-transform group-hover:translate-x-1">
          <ArrowRight className="h-5 w-5" />
        </span>
      </a>
    </HairlineGrid.Section>
  );
}
