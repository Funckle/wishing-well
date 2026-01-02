'use client'

import type { BackgroundTheme } from '@/lib/themes'

interface BackgroundSceneProps {
  theme: BackgroundTheme
  children: React.ReactNode
}

// City skyline silhouette
function CitySkyline() {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      {/* Buildings silhouette */}
      <path
        fill="url(#cityGrad)"
        d="M0,200 L0,150 L30,150 L30,100 L60,100 L60,150 L80,150 L80,80 L100,80 L100,60 L120,60 L120,80 L140,80 L140,150 L160,150 L160,120 L200,120 L200,70 L220,70 L220,50 L240,50 L240,70 L260,70 L260,120 L280,120 L280,150 L320,150 L320,90 L350,90 L350,40 L370,40 L370,30 L390,30 L390,40 L410,40 L410,90 L440,90 L440,150 L480,150 L480,110 L520,110 L520,60 L550,60 L550,80 L580,80 L580,110 L620,110 L620,150 L660,150 L660,100 L700,100 L700,45 L720,45 L720,25 L750,25 L750,45 L770,45 L770,100 L810,100 L810,150 L850,150 L850,130 L890,130 L890,85 L920,85 L920,130 L960,130 L960,150 L1000,150 L1000,110 L1040,110 L1040,70 L1080,70 L1080,110 L1120,110 L1120,150 L1160,150 L1160,130 L1200,130 L1200,200 Z"
      />
      {/* Windows */}
      {[...Array(30)].map((_, i) => (
        <rect
          key={i}
          fill="#fde68a"
          opacity={Math.random() > 0.3 ? 0.8 : 0.2}
          x={50 + (i % 10) * 110 + Math.random() * 40}
          y={80 + Math.floor(i / 10) * 35 + Math.random() * 20}
          width="4"
          height="6"
        />
      ))}
    </svg>
  )
}

// Beach scene with waves and palm
function BeachScene() {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sand */}
      <ellipse fill="#fde68a" cx="600" cy="250" rx="800" ry="100" />
      {/* Waves */}
      <path
        fill="#0ea5e9"
        opacity="0.6"
        d="M0,160 Q100,140 200,160 T400,160 T600,160 T800,160 T1000,160 T1200,160 L1200,200 L0,200 Z"
      />
      <path
        fill="#38bdf8"
        opacity="0.4"
        d="M0,170 Q100,155 200,170 T400,170 T600,170 T800,170 T1000,170 T1200,170 L1200,200 L0,200 Z"
      />
      {/* Palm tree */}
      <path fill="#78350f" d="M100,200 L90,100 L95,100 L105,200 Z" />
      <ellipse fill="#22c55e" cx="92" cy="90" rx="40" ry="15" transform="rotate(-30 92 90)" />
      <ellipse fill="#16a34a" cx="92" cy="90" rx="35" ry="12" transform="rotate(20 92 90)" />
      <ellipse fill="#22c55e" cx="92" cy="90" rx="45" ry="12" transform="rotate(-60 92 90)" />
      <ellipse fill="#16a34a" cx="92" cy="90" rx="40" ry="10" transform="rotate(50 92 90)" />
    </svg>
  )
}

// Mountain range with layered peaks
function MountainRange() {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Far mountains */}
      <path
        fill="#94a3b8"
        opacity="0.5"
        d="M0,200 L0,150 L100,100 L200,140 L300,80 L400,130 L500,60 L600,120 L700,70 L800,110 L900,50 L1000,100 L1100,70 L1200,130 L1200,200 Z"
      />
      {/* Mid mountains */}
      <path
        fill="#64748b"
        opacity="0.7"
        d="M0,200 L0,160 L150,110 L250,150 L400,90 L500,140 L650,80 L800,130 L950,100 L1100,140 L1200,120 L1200,200 Z"
      />
      {/* Near mountains */}
      <path
        fill="#475569"
        d="M0,200 L0,170 L100,140 L200,170 L350,120 L450,160 L600,110 L750,150 L900,130 L1050,160 L1200,140 L1200,200 Z"
      />
      {/* Snow caps */}
      <path
        fill="#f1f5f9"
        d="M500,60 L520,85 L480,85 Z M900,50 L925,80 L875,80 Z M300,80 L320,105 L280,105 Z"
      />
    </svg>
  )
}

// Forest with tree silhouettes
function ForestTrees() {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ground */}
      <rect fill="#166534" x="0" y="180" width="1200" height="20" />
      {/* Far trees */}
      {[...Array(15)].map((_, i) => (
        <path
          key={`far-${i}`}
          fill="#14532d"
          opacity="0.6"
          d={`M${i * 80 + 20},200 L${i * 80 + 20},160 L${i * 80 - 10},200 L${i * 80 + 50},200 L${i * 80 + 20},160 L${i * 80 + 20},130 L${i * 80 - 5},165 M${i * 80 + 20},130 L${i * 80 + 45},165`}
        />
      ))}
      {/* Near trees */}
      {[...Array(10)].map((_, i) => (
        <g key={`near-${i}`}>
          <rect fill="#422006" x={i * 120 + 55} y="150" width="10" height="50" />
          <path
            fill="#166534"
            d={`M${i * 120 + 60},150 L${i * 120 + 30},180 L${i * 120 + 60},155 L${i * 120 + 90},180 Z`}
          />
          <path
            fill="#166534"
            d={`M${i * 120 + 60},125 L${i * 120 + 35},160 L${i * 120 + 60},130 L${i * 120 + 85},160 Z`}
          />
          <path
            fill="#15803d"
            d={`M${i * 120 + 60},100 L${i * 120 + 40},140 L${i * 120 + 60},105 L${i * 120 + 80},140 Z`}
          />
        </g>
      ))}
    </svg>
  )
}

// Night sky with stars and moon
function NightSkyStars() {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stars */}
      {[...Array(50)].map((_, i) => (
        <circle
          key={i}
          fill="#fff"
          cx={Math.random() * 1200}
          cy={Math.random() * 180}
          r={Math.random() * 1.5 + 0.5}
          opacity={Math.random() * 0.5 + 0.5}
        />
      ))}
      {/* Moon */}
      <circle fill="#fef3c7" cx="1050" cy="50" r="35" />
      <circle fill="#312e81" cx="1060" cy="45" r="30" />
      {/* Hills silhouette */}
      <path
        fill="#1e1b4b"
        d="M0,200 L0,180 Q150,150 300,175 T600,165 T900,175 T1200,160 L1200,200 Z"
      />
    </svg>
  )
}

// Meadow with rolling hills and flowers
function MeadowFlowers() {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rolling hills */}
      <ellipse fill="#86efac" cx="200" cy="250" rx="400" ry="100" />
      <ellipse fill="#4ade80" cx="700" cy="260" rx="500" ry="120" />
      <ellipse fill="#22c55e" cx="1100" cy="240" rx="300" ry="80" />
      {/* Flowers */}
      {[...Array(20)].map((_, i) => (
        <g key={i} transform={`translate(${i * 60 + Math.random() * 30}, ${170 + Math.random() * 20})`}>
          <line stroke="#16a34a" strokeWidth="2" x1="0" y1="0" x2="0" y2="15" />
          <circle fill={['#f472b6', '#fbbf24', '#c084fc', '#fb7185'][i % 4]} cx="0" cy="-3" r="5" />
        </g>
      ))}
      {/* Butterflies */}
      <g transform="translate(300, 100)">
        <ellipse fill="#f472b6" cx="-5" cy="0" rx="6" ry="4" transform="rotate(-20)" />
        <ellipse fill="#f472b6" cx="5" cy="0" rx="6" ry="4" transform="rotate(20)" />
        <ellipse fill="#1e293b" cx="0" cy="0" rx="1" ry="4" />
      </g>
      <g transform="translate(800, 80)">
        <ellipse fill="#c084fc" cx="-5" cy="0" rx="5" ry="3" transform="rotate(-15)" />
        <ellipse fill="#c084fc" cx="5" cy="0" rx="5" ry="3" transform="rotate(15)" />
        <ellipse fill="#1e293b" cx="0" cy="0" rx="1" ry="3" />
      </g>
    </svg>
  )
}

// Map landscape type to component
const LANDSCAPE_COMPONENTS: Record<string, React.ComponentType> = {
  city: CitySkyline,
  beach: BeachScene,
  mountains: MountainRange,
  forest: ForestTrees,
  nightsky: NightSkyStars,
  meadow: MeadowFlowers,
}

export function BackgroundScene({ theme, children }: BackgroundSceneProps) {
  const LandscapeComponent = LANDSCAPE_COMPONENTS[theme.landscape]

  const gradientStyle = {
    background: theme.gradient.via
      ? `linear-gradient(to bottom, ${theme.gradient.from}, ${theme.gradient.via}, ${theme.gradient.to})`
      : `linear-gradient(to bottom, ${theme.gradient.from}, ${theme.gradient.to})`,
  }

  return (
    <div className="relative min-h-screen" style={gradientStyle}>
      {/* Landscape at bottom */}
      {LandscapeComponent && (
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none overflow-hidden">
          <LandscapeComponent />
        </div>
      )}
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
