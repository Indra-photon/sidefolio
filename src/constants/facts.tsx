import type { IconSvgElement } from "@hugeicons/react";
import {
  Call02Icon,
  Idea01Icon,
  Link04Icon,
  Location01Icon,
  Mail01Icon,
  SourceCodeIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";

/**
 * Facts shown under the hero. Edit values here — the component is data-driven.
 * `href` makes the value a link. `meta` is muted trailing text (e.g. "@Company").
 */
export type Fact = {
  icon: IconSvgElement;
  label: string; // accessible name for the icon
  value: string;
  href?: string;
  meta?: string;
  metaHref?: string;
};

/** Zones for the split-flap clock. First entry is the default (home). */
export const CLOCK_ZONES = [
  { city: "Kolkata", timeZone: "Asia/Kolkata" }, // TODO: confirm home zone
  { city: "London", timeZone: "Europe/London" },
  { city: "New York", timeZone: "America/New_York" },
  { city: "Tokyo", timeZone: "Asia/Tokyo" },
];

export const factsLeft: Fact[] = [
  {
    icon: Idea01Icon,
    label: "Currently building",
    value: "Currently Building",
    meta: "@craftui.space",
    metaHref: "https://craftui.space",
  },
  {
    icon: Call02Icon,
    label: "Phone",
    value: "+48 794231051", // TODO: your number
    href: "tel:+48794231051",
  },
  {
    icon: Link04Icon,
    label: "Website",
    value: "indrabuildswebsites.com",
    href: "https://www.indrabuildswebsites.com/",
  },
];

export const factsRight: Fact[] = [
  {
    icon: Mail01Icon,
    label: "Email",
    value: "indranilmaiti16@gmail.com", // TODO: confirm
    href: "mailto:indranilmaiti16@gmail.com",
  },
  {
    icon: UserCircleIcon,
    label: "Pronouns",
    value: "he/him", // TODO: set
  },
];
