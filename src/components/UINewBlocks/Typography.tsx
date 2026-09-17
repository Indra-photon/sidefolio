import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

/**
 * Typography primitives for the design system.
 *
 * Rules:
 *  - `variant` is required. It is the ONLY place typography lives.
 *  - `as` sets the semantic element independently of the visual variant.
 *  - `className` is for layout only (margins, max-width, alignment).
 *    Never pass text-*, font-*, leading-* or tracking-* from a call site;
 *    change the variant here instead.
 *
 * Sizes come from the `--text-*` tokens in globals.css (@theme inline), so
 * `text-h1` sets size + line-height + letter-spacing together.
 */

type Tag = keyof Pick<
  JSX.IntrinsicElements,
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label"
  | "time"
  | "li"
>;

/* ------------------------------------------------------------------ */
/* Heading                                                              */

const headingVariants = cva("text-balance font-heading text-foreground", {
  variants: {
    variant: {
      h1: "text-h1 font-normal lg:text-h1-lg",
      h2: "text-h2 font-normal lg:text-h2-lg",
    },
  },
});

type HeadingVariant = NonNullable<
  VariantProps<typeof headingVariants>["variant"]
>;

const headingDefaultTag: Record<HeadingVariant, Tag> = {
  h1: "h1",
  h2: "h2",
};

export type HeadingProps = {
  variant: HeadingVariant;
  as?: Tag;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

export function Heading({
  variant,
  as,
  className,
  children,
  ...rest
}: HeadingProps) {
  const Comp = (as ?? headingDefaultTag[variant]) as React.ElementType;
  return (
    <Comp
      className={twMerge(headingVariants({ variant }), className)}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* Text                                                                 */

const textVariants = cva("", {
  variants: {
    variant: {
      /** Long-form reading copy. */
      body: "text-body text-pretty font-normal text-muted-foreground lg:text-body-lg",
      /** Title inside a card / cell. */
      cardHeader: "text-card-header text-balance font-medium text-foreground",
      /** Supporting copy inside a card / cell. */
      cardDescription:
        "text-card-description text-pretty font-normal text-muted-foreground lg:text-card-description-lg",
      /** Mono uppercase label (section names, stack tags, indices). */
      label: "text-label font-mono uppercase text-muted-foreground",
      /** Smaller mono label (eyebrows, meta, dates). */
      labelSm: "text-label-sm font-mono uppercase text-muted-foreground",
      /** Mono, normal case — facts, meta, inline code-like values. */
      mono: "text-mono font-mono text-foreground",
      /** Navbar wordmark. */
      brand: "text-brand font-medium text-foreground",
      /** Navbar links: 12px on mobile, 11px from md up. */
      nav: "text-nav font-mono uppercase text-muted-foreground md:text-nav-md",
    },
  },
});

type TextVariant = NonNullable<VariantProps<typeof textVariants>["variant"]>;

const textDefaultTag: Record<TextVariant, Tag> = {
  body: "p",
  cardHeader: "h3",
  cardDescription: "p",
  label: "p",
  labelSm: "span",
  brand: "span",
  nav: "span",
  mono: "span",
};

export type TextProps = {
  variant: TextVariant;
  as?: Tag;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children" | "style">;

export function Text({ variant, as, className, style, children, ...rest }: TextProps) {
  const Comp = (as ?? textDefaultTag[variant]) as React.ElementType;
  return (
    <Comp className={twMerge(textVariants({ variant }), className)} style={style} {...rest}>
      {children}
    </Comp>
  );
}

/* Exported for the rare case a non-React surface needs the same classes. */
export { headingVariants, textVariants };
