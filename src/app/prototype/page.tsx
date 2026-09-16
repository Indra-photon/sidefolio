import type { Metadata } from "next";
import {
  HairlineGridRoot as Grid,
  HairlineGridHatch as Hatch,
  HairlineGridSection as Section,
} from "@/components/UINewBlocks/HairlineGrid";
import { Heading, Text } from "@/components/UINewBlocks/Typography";
import { FloorLamp } from "@/components/UINewBlocks/prototype/Lamp";
import { PendantLamp } from "@/components/UINewBlocks/PendantLamp";

export const metadata: Metadata = {
  title: "Prototype — lamp",
  robots: { index: false, follow: false },
};

const designs = [
  {
    title: "Pendant (production)",
    note: "Now in the hero. Theme-specific: additive tungsten beam on dark, warm multiply tint + shade shadow on light.",
    C: ({ className }: { className?: string }) => (
      <div className={`w-full max-w-[260px] overflow-hidden ${className ?? ""}`}>
        <PendantLamp className="h-[420px]">
          <Text variant="label" className="text-foreground/80">Get in touch</Text>
        </PendantLamp>
      </div>
    ),
  },
  { title: "Floor lamp", note: "Brass pole on the right, arm reaches in, cone points down-left at the buttons. Same beam physics, warmer fixture.", C: FloorLamp },
];

export default function PrototypePage() {
  return (
    <Grid>
      <Hatch height="h-12" />
      <Section title="Prototype — lamp for the CTA column" rule="bottom">
        <div className="px-6 py-8 lg:px-10">
          <Heading variant="h2">Two lamps, CSS only</Heading>
          <Text variant="body" className="mt-3 max-w-[65ch]">
            Beam = clip-path cone + blur + plus-lighter. Pool = radial gradient. Fixture = inline SVG.
            Move the cursor across each one; reload to see the turn-on flicker.
          </Text>
        </div>
      </Section>

      {designs.map(({ title, note, C }, i) => (
        <Section key={title} index={i + 1} total={designs.length} title={title}>
          <div className="grid grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
            <div className="flex justify-center lg:justify-start">
              <C className="rounded-2xl bezel" />
            </div>
            <Text variant="cardDescription" className="max-w-[36ch] lg:text-right">{note}</Text>
          </div>
        </Section>
      ))}

      <Hatch height="h-12" className="hairline-none" />
    </Grid>
  );
}
