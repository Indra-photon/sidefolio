"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { twMerge } from "tailwind-merge";

gsap.registerPlugin(MorphSVGPlugin);

/**
 * PullCord — a port of Jhey Tompkins' light-toggle cord.
 *
 * Same mechanics as the original:
 *  - a straight "dummy" line follows the pointer while dragging
 *  - on release the line snaps back (0.1s); if the pointer travelled > 50px
 *    the toggle fires and the cord "twangs": the visible cord morphs through
 *    four wobble shapes, each 0.1s with repeat: 1 / yoyo, via MorphSVG
 *  - the cord ends in a round marker
 *
 * Path data is Jhey's, in his coordinate space (cord along x = 98.7255,
 * hanging from y ≈ 227.5 to y ≈ 378); we only scale the viewBox to size it.
 */

// Jhey's cord shapes (already translated by (-24.503, 256.106)).
const T = "translate(-24.503 256.106)";
const CORDS = [
  "M123.228-28.56v150.493",
  "M123.228-28.59s28 8.131 28 19.506-18.667 13.005-28 19.507c-9.333 6.502-28 8.131-28 19.506s28 19.507 28 19.507",
  "M123.228-28.575s-20 16.871-20 28.468c0 11.597 13.333 18.978 20 28.468 6.667 9.489 20 16.87 20 28.467 0 11.597-20 28.468-20 28.468",
  "M123.228-28.569s16 20.623 16 32.782c0 12.16-10.667 21.855-16 32.782-5.333 10.928-16 20.623-16 32.782 0 12.16 16 32.782 16 32.782",
  "M123.228-28.563s-10 24.647-10 37.623c0 12.977 6.667 25.082 10 37.623 3.333 12.541 10 24.647 10 37.623 0 12.977-10 37.623-10 37.623",
];
const X = 98.7255;            // cord x in user units
const Y1 = 227.546;           // top (start of the cords, under the bulb)
const Y2 = 378.039;           // resting end
const CORD_DURATION = 0.1;
const TRAVEL_TO_TRIGGER = 50; // px, like the original

// viewBox around the cord with room for the wobble (±28) and a long drag
const VB = { x: 58, y: Y1, w: 82, h: 230 };
const SCALE = 0.6;            // user unit → px  (150 units of cord ≈ 90px)

export function PullCord({
  onPull,
  label,
  className,
  style,
}: {
  onPull: () => void;
  label: string;
  className?: string;
  style?: CSSProperties;
}) {
  const cordRef = useRef<SVGPathElement>(null);     // the morphing cord
  const dummyRef = useRef<SVGLineElement>(null);    // straight line while dragging
  const shapes = useRef<(SVGPathElement | null)[]>([]);
  const start = useRef<{ x: number; y: number } | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    // Rest state: dummy visible, morph cord hidden (as in the original)
    gsap.set(cordRef.current, { display: "none" });
  }, []);

  const twang = () => {
    const cord = cordRef.current, dummy = dummyRef.current;
    if (!cord || !dummy) return;
    busy.current = true;
    const tl = gsap.timeline({
      onStart: () => {
        onPull();                              // toggle fires at the start, like Jhey's
        gsap.set(dummy, { display: "none" });
        gsap.set(cord, { display: "block" });
      },
      onComplete: () => {
        gsap.set(dummy, { display: "block" });
        gsap.set(cord, { display: "none" });
        busy.current = false;
      },
    });
    for (let i = 1; i < CORDS.length; i++) {
      tl.add(gsap.to(cord, { morphSVG: shapes.current[i]!, duration: CORD_DURATION, repeat: 1, yoyo: true }));
    }
  };

  // Pointer handling (replaces Draggable + proxy; same numbers)
  const onPointerDown = (e: React.PointerEvent<SVGCircleElement>) => {
    if (busy.current) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent<SVGCircleElement>) => {
    if (!start.current || !dummyRef.current) return;
    const dxu = (e.clientX - start.current.x) / SCALE;   // px → user units
    const dyu = (e.clientY - start.current.y) / SCALE;
    gsap.set(dummyRef.current, { attr: { x2: X + dxu, y2: Y2 + dyu } });
  };
  const onPointerUp = (e: React.PointerEvent<SVGCircleElement>) => {
    if (!start.current || !dummyRef.current) return;
    const dx = e.clientX - start.current.x, dy = e.clientY - start.current.y;
    const travelled = Math.hypot(dx, dy);
    start.current = null;
    gsap.to(dummyRef.current, {
      attr: { x2: X, y2: Y2 },
      duration: CORD_DURATION,
      onComplete: () => { if (travelled > TRAVEL_TO_TRIGGER) twang(); },
    });
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (busy.current || !dummyRef.current) return;
    gsap.to(dummyRef.current, {
      attr: { y2: Y2 + 60 }, duration: 0.12, yoyo: true, repeat: 1,
      onComplete: twang,
    });
  };

  return (
    <svg
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      width={VB.w * SCALE}
      height={VB.h * SCALE}
      className={twMerge("overflow-visible", className)}
      style={style}
      aria-hidden={false}
    >
      <defs>
        <marker id="cord-end" orient="auto" overflow="visible" refX="0" refY="0">
          <path fill="var(--lamp-bead)" fillRule="evenodd" strokeWidth=".2666" d="M.98 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </marker>
      </defs>

      {/* hidden morph targets */}
      <g transform={T} style={{ display: "none" }}>
        {CORDS.map((d, i) => (
          <path key={i} ref={(el) => { shapes.current[i] = el; }} d={d} fill="none" />
        ))}
      </g>

      {/* the morphing cord (shown only during the twang) */}
      <path
        ref={cordRef}
        transform={T}
        d={CORDS[0]}
        markerEnd="url(#cord-end)"
        fill="none"
        stroke="var(--lamp-cord)"
        strokeLinecap="square"
        strokeWidth="3"
      />

      {/* the straight line that follows the pointer */}
      <line
        ref={dummyRef}
        x1={X} y1={Y1} x2={X} y2={Y2}
        markerEnd="url(#cord-end)"
        stroke="var(--lamp-cord)"
        strokeLinecap="square"
        strokeWidth="3"
      />

      {/* hit spot — Jhey's transparent r=60 circle at the cord end, made a control */}
      <circle
        cx={X} cy={Y2} r="60" fill="transparent"
        className="cursor-grab touch-none outline-none active:cursor-grabbing focus-visible:stroke-[var(--ring)] focus-visible:stroke-2"
        role="button"
        tabIndex={0}
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      />
    </svg>
  );
}
