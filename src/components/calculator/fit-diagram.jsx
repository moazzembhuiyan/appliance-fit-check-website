"use client";
import { motion, useReducedMotion } from "motion/react";
import { STATUS_STYLE } from "@/components/ui/status-badge";
import { formatFraction } from "@/lib/measurements";

const COLORS = { fits: "#2b7a57", tight: "#946100", modify: "#ac4a1c", no: "#ae2a22" };

/**
 * Front-view schematic: the opening (hatched walls) with the appliance drawn to
 * the same scale. Purely illustrative — it is NOT a drawing of the real unit.
 */
export function FitDiagram({ product, space, status = "fits", className }) {
  const reduce = useReducedMotion();
  const W = 320, H = 240, pad = 28;
  const maxW = Math.max(product.width, space.width) || 1;
  const maxH = Math.max(product.height, space.height) || 1;
  const scale = Math.min((W - pad * 2) / maxW, (H - pad * 2) / maxH);
  const sw = space.width * scale, sh = space.height * scale;
  const pw = product.width * scale, ph = product.height * scale;
  const sx = (W - sw) / 2, sy = (H - sh) / 2;
  const px = (W - pw) / 2, py = sy + sh - ph; // appliance sits on the floor of the opening
  const color = COLORS[status];
  const t = reduce ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 22 };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img"
      aria-label={`Diagram comparing a ${formatFraction(product.width)} by ${formatFraction(product.height)} inch product with a ${formatFraction(space.width)} by ${formatFraction(space.height)} inch opening`}>
      <defs>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#251b25" strokeOpacity=".14" strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect x="6" y="6" width={W - 12} height={H - 12} rx="10" fill="url(#hatch)" />
      <motion.rect initial={false} animate={{ x: sx, y: sy, width: sw, height: sh }} transition={t} fill="#fff" stroke="#251b25" strokeWidth="1.5" strokeDasharray="5 4" />
      <motion.rect initial={false} animate={{ x: px, y: py, width: pw, height: ph, fill: color + "22", stroke: color }} transition={t} strokeWidth="2.5" rx="3" />
      <motion.text initial={false} animate={{ x: W / 2, y: sy - 8 }} textAnchor="middle" fontSize="11" fill="#675c68">
        {formatFraction(space.width)} in
      </motion.text>
    </svg>
  );
}

export { STATUS_STYLE };
