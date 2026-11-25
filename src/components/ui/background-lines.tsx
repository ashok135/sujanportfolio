"use client";
import React from "react";

interface BackgroundLinesProps {
  children?: React.ReactNode;
  className?: string;
  svgOptions?: { duration?: number };
}

/**
 * Aceternity-style animated diagonal background lines.
 * Pure SVG + CSS — no external dependency needed.
 */
export const BackgroundLines: React.FC<BackgroundLinesProps> = ({
  children,
  className = "",
  svgOptions,
}) => {
  const duration = svgOptions?.duration ?? 10;

  // Build an array of diagonal line paths across a 1440×900 canvas
  const lines = Array.from({ length: 32 }, (_, i) => {
    const x = -400 + i * 60;
    return `M${x} 0 L${x + 900} 900`;
  });

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated SVG lines layer */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {/* Mask: visible in a central vertical band, faded at edges */}
          <radialGradient id="bgLinesMask" cx="50%" cy="50%" r="55%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="bgLinesVignette">
            <rect width="1440" height="900" fill="url(#bgLinesMask)" />
          </mask>

          {/* Moving shimmer gradient */}
          <linearGradient id="shimmer1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="45%" stopColor="#FACC15" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#FACC15" stopOpacity="0.55" />
            <stop offset="100%" stopColor="transparent" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1440 -900"
              to="1440 900"
              dur={`${duration}s`}
              repeatCount="indefinite"
            />
          </linearGradient>

          <linearGradient id="shimmer2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="45%" stopColor="#FACC15" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#FACC15" stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1440 -900"
              to="1440 900"
              dur={`${duration * 1.4}s`}
              begin={`${duration * 0.3}s`}
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        <g mask="url(#bgLinesVignette)">
          {/* Static dim base lines */}
          {lines.map((d, i) => (
            <path
              key={`base-${i}`}
              d={d}
              stroke="white"
              strokeOpacity="0.04"
              strokeWidth="1"
            />
          ))}

          {/* Primary animated shimmer sweep */}
          {lines.map((d, i) => (
            <path
              key={`shimmer1-${i}`}
              d={d}
              stroke="url(#shimmer1)"
              strokeWidth="1.5"
              strokeOpacity="0.9"
            />
          ))}

          {/* Secondary shimmer sweep (offset) */}
          {lines.map((d, i) => (
            <path
              key={`shimmer2-${i}`}
              d={d}
              stroke="url(#shimmer2)"
              strokeWidth="1"
              strokeOpacity="0.75"
            />
          ))}
        </g>
      </svg>

      {/* Content on top */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
