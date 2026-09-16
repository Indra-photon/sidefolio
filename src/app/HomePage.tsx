// src/app/HomePage.tsx
import {
  HairlineGridRoot as Grid,
  HairlineGridHatch as Hatch,
} from "@/components/UINewBlocks/HairlineGrid";
import { HomeHero } from "@/components/UINewBlocks/HomeHero";
import { HomeProjects } from "@/components/UINewBlocks/HomeProjects";
import { HomeBlog } from "@/components/UINewBlocks/HomeBlog";
import { HomeCTA } from "@/components/UINewBlocks/HomeCTA";

const TOTAL = 4;

export default function HomePage() {
  return (
    <Grid>
      <Hatch height="h-16" />
      <HomeHero index={1} total={TOTAL} />
      <Hatch height="h-16" />
      <HomeProjects index={2} total={TOTAL} />
      <Hatch height="h-16" />
      <HomeBlog index={3} total={TOTAL} />
      <Hatch height="h-16" />
      <HomeCTA index={4} total={TOTAL} />
      <Hatch height="h-16" className="hairline-none" />
    </Grid>
  );
}
