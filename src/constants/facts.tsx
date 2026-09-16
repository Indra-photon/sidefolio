import type { IconSvgElement } from "@hugeicons/react";
import {
  Call02Icon,
  Clock01Icon,
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
 * `kind: "clock"` renders a live local time.
 */
export type Fact = {
  icon: IconSvgElement;
  label: string; // accessible name for the icon
  value: string;
  href?: string;
  meta?: string;
  metaHref?: string;
  kind?: "clock";
};

export const TIMEZONE = "Asia/Kolkata"; // TODO: confirm

export const factsLeft: Fact[] = [
  {
    icon: Idea01Icon,
    label: "Currently building",
    value: "Currently Building",
    meta: "@craftui.space",
    metaHref: "https://craftui.space",
  },
  {
    icon: Location01Icon,
    label: "Location",
    value: "Kolkata, India", // TODO: confirm
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
    icon: Clock01Icon,
    label: "Local time",
    value: "", // filled live
    kind: "clock",
  },
  {
    icon: Mail01Icon,
    label: "Email",
    value: "hello@indrabuildswebsites.com", // TODO: confirm
    href: "mailto:hello@indrabuildswebsites.com",
  },
  {
    icon: UserCircleIcon,
    label: "Pronouns",
    value: "your/pronouns", // TODO: set
  },
];
