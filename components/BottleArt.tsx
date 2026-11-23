// Elegant inline SVG serum bottle. Colours come from the active theme's
// CSS variables, so the bottle re-skins with the rest of the page.
export default function BottleArt() {
  return (
    <svg
      className="bottle-float"
      width="240"
      height="340"
      viewBox="0 0 240 340"
      role="img"
      aria-label="Lumière Glow Serum bottle illustration"
    >
      {/* soft sparkle accents */}
      <g fill="var(--accent-2)" opacity="0.9">
        <path d="M28 74 l2.6 6.4 6.4 2.6 -6.4 2.6 -2.6 6.4 -2.6 -6.4 -6.4 -2.6 6.4 -2.6 Z" />
        <path d="M204 118 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" />
        <circle cx="196" cy="52" r="3" />
        <circle cx="40" cy="150" r="2.5" />
      </g>

      {/* dropper cap */}
      <rect x="104" y="18" width="32" height="16" rx="8" fill="var(--accent-2)" />
      <rect x="98" y="34" width="44" height="52" rx="7" fill="var(--deep-2)" />
      <rect x="98" y="44" width="44" height="5" fill="var(--accent-2)" opacity="0.55" />
      <rect x="98" y="56" width="44" height="5" fill="var(--accent-2)" opacity="0.55" />
      <rect x="98" y="68" width="44" height="5" fill="var(--accent-2)" opacity="0.55" />
      {/* collar */}
      <rect x="92" y="86" width="56" height="14" rx="4" fill="var(--accent)" />

      {/* glass bottle */}
      <path
        d="M100 100 C84 108 74 122 74 142 L74 292 C74 312 90 322 120 322 C150 322 166 312 166 292 L166 142 C166 122 156 108 140 100 Z"
        fill="color-mix(in srgb, var(--on-deep) 92%, var(--accent))"
        stroke="var(--accent-2)"
        strokeWidth="2"
      />
      {/* serum inside */}
      <path
        d="M80 176 C100 166 140 186 160 174 L160 290 C160 306 148 314 120 314 C92 314 80 306 80 290 Z"
        fill="var(--accent)"
        opacity="0.75"
      />
      {/* glass highlight */}
      <rect x="88" y="130" width="9" height="150" rx="4.5" fill="#ffffff" opacity="0.5" />

      {/* label */}
      <rect x="90" y="196" width="60" height="86" rx="6" fill="var(--card)" />
      <text
        x="120"
        y="226"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="14"
        fill="var(--deep)"
      >
        Lumière
      </text>
      <text
        x="120"
        y="243"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="7.5"
        letterSpacing="2.5"
        fill="var(--muted)"
      >
        GLOW SERUM
      </text>
      <line x1="104" y1="254" x2="136" y2="254" stroke="var(--accent)" strokeWidth="1.4" />
      <text
        x="120"
        y="269"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="7"
        fill="var(--muted)"
      >
        30 ml
      </text>

      {/* leaf sprig */}
      <g stroke="var(--accent-2)" strokeWidth="2.4" fill="var(--accent)" opacity="0.9">
        <path d="M168 300 C186 288 194 272 194 254" fill="none" />
        <path d="M186 276 C196 276 202 270 204 260 C194 260 188 266 186 276 Z" />
        <path d="M178 290 C188 292 196 288 200 279 C190 277 182 281 178 290 Z" />
      </g>
    </svg>
  );
}
