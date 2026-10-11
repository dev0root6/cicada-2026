/**
 * The entity's mark: a cicada killer wasp, seen from above. Drawn as inline
 * SVG so it needs no asset and can be tinted with CSS.
 */
export function WaspMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 240 260" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id="wasp-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff6c2" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffd23f" stopOpacity=".12" />
        </linearGradient>
        <clipPath id="wasp-abdomen">
          <path d="M120 120 C 146 124 156 156 152 186 C 148 214 132 236 120 248 C 108 236 92 214 88 186 C 84 156 94 124 120 120 Z" />
        </clipPath>
      </defs>

      {/* wings: long forewings swept back over shorter hindwings */}
      <g fill="url(#wasp-wing)" stroke="#ffd23f" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M108 86 C 70 70 26 78 12 104 C 30 118 76 112 110 98 Z" />
        <path d="M132 86 C 170 70 214 78 228 104 C 210 118 164 112 130 98 Z" />
        <path d="M108 100 C 80 104 50 124 46 146 C 66 148 94 130 112 108 Z" opacity=".85" />
        <path d="M132 100 C 160 104 190 124 194 146 C 174 148 146 130 128 108 Z" opacity=".85" />
      </g>
      <g stroke="#ffd23f" strokeWidth=".9" opacity=".5" fill="none">
        <path d="M104 90 C 76 86 44 90 24 102" />
        <path d="M136 90 C 164 86 196 90 216 102" />
      </g>

      {/* legs */}
      <g stroke="#1b1404" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M106 84 L 80 70 L 66 50" />
        <path d="M134 84 L 160 70 L 174 50" />
        <path d="M104 96 L 74 104 L 58 126" />
        <path d="M136 96 L 166 104 L 182 126" />
        <path d="M106 106 L 82 132 L 76 160" />
        <path d="M134 106 L 158 132 L 164 160" />
      </g>
      <g stroke="#ffd23f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".9">
        <path d="M106 84 L 80 70 L 66 50" />
        <path d="M134 84 L 160 70 L 174 50" />
        <path d="M104 96 L 74 104 L 58 126" />
        <path d="M136 96 L 166 104 L 182 126" />
        <path d="M106 106 L 82 132 L 76 160" />
        <path d="M134 106 L 158 132 L 164 160" />
      </g>

      {/* antennae */}
      <g stroke="#ffd23f" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M112 34 C 104 18 92 10 78 8" />
        <path d="M128 34 C 136 18 148 10 162 8" />
      </g>

      {/* abdomen: yellow with black bands, ending in the stinger */}
      <path d="M120 248 L 120 258" stroke="#1b1404" strokeWidth="3" strokeLinecap="round" />
      <path d="M120 120 C 146 124 156 156 152 186 C 148 214 132 236 120 248 C 108 236 92 214 88 186 C 84 156 94 124 120 120 Z" fill="#ffd23f" />
      <g clipPath="url(#wasp-abdomen)" fill="#1b1404">
        <path d="M80 136 C 100 146 140 146 160 136 L 160 148 C 140 158 100 158 80 148 Z" />
        <path d="M80 168 C 100 178 140 178 160 168 L 160 182 C 140 192 100 192 80 182 Z" />
        <path d="M80 202 C 100 212 140 212 160 202 L 160 216 C 140 226 100 226 80 216 Z" />
        <path d="M80 232 C 100 240 140 240 160 232 L 160 260 L 80 260 Z" />
      </g>
      <path d="M120 120 C 146 124 156 156 152 186 C 148 214 132 236 120 248 C 108 236 92 214 88 186 C 84 156 94 124 120 120 Z" fill="none" stroke="#1b1404" strokeWidth="2.5" />
      <path d="M104 150 C 100 170 102 196 110 220" stroke="#fff6c2" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".45" />

      {/* waist, thorax, head */}
      <ellipse cx="120" cy="116" rx="7" ry="6" fill="#1b1404" />
      <ellipse cx="120" cy="88" rx="22" ry="25" fill="#1b1404" />
      <path d="M104 78 C 112 70 128 70 136 78 C 130 84 110 84 104 78 Z" fill="#ffd23f" />
      <path d="M108 96 L 120 104 L 132 96" stroke="#ffd23f" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="120" cy="44" rx="20" ry="16" fill="#ffd23f" stroke="#1b1404" strokeWidth="2.5" />
      <path d="M96 32 C 104 30 114 38 114 48 C 108 52 98 48 96 32 Z" fill="#1b1404" />
      <path d="M144 32 C 136 30 126 38 126 48 C 132 52 142 48 144 32 Z" fill="#1b1404" />
      <path d="M100 35 L 108 41" stroke="#ff3b4f" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
      <path d="M140 35 L 132 41" stroke="#ff3b4f" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
      <path d="M110 54 L 116 64 M130 54 L 124 64" stroke="#1b1404" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
