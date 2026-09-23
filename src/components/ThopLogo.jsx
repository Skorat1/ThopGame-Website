import React from 'react';

/**
 * ThopLogo - Scalable Vector SVG Logo Component for ThopGames
 * Supports both standalone icon mark ('icon') and full horizontal lockup ('full').
 */
export default function ThopLogo({
  variant = 'icon', // 'icon' | 'full'
  size = 38,
  className = '',
  style = {}
}) {
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`thop-vector-logo-icon ${className}`}
        style={{ display: 'inline-block', flexShrink: 0, ...style }}
      >
        <defs>
          <linearGradient id="thopLogoStem" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0051FF" />
            <stop offset="50%" stopColor="#0066FE" />
            <stop offset="100%" stopColor="#00C6FF" />
          </linearGradient>

          <linearGradient id="thopLogoCap" x1="0%" y1="30%" x2="100%" y2="70%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="35%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient id="thopLogoCtrl" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          <filter id="thopLogoGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0051FF" floodOpacity="0.25" />
          </filter>
        </defs>

        <g filter="url(#thopLogoGlow)">
          {/* Top T bar */}
          <path
            d="M 38 74 C 38 52 56 38 78 38 L 122 38 C 144 38 162 52 162 74 C 162 82 156 89 148 89 C 142 89 138 84 136 78 C 131 66 122 58 108 58 L 92 58 C 78 58 69 66 64 78 C 62 84 58 89 52 89 C 44 89 38 82 38 74 Z"
            fill="url(#thopLogoCap)"
          />

          {/* Vertical Stem */}
          <rect x="77" y="82" width="46" height="80" rx="23" fill="url(#thopLogoStem)" />

          {/* Glossy sheen */}
          <path
            d="M 77 105 C 77 92 87 82 100 82 C 104 82 108 83 111 85 C 93 93 83 110 83 130 C 83 145 88 153 93 158 C 83 154 77 143 77 130 Z"
            fill="#ffffff"
            opacity="0.22"
          />

          {/* Gamepad face */}
          <g>
            <path
              d="M 62 60 C 62 50 70 44 80 44 L 120 44 C 130 44 138 50 138 60 C 138 69 133 76 125 76 C 117 76 114 70 108 70 L 92 70 C 86 70 83 76 75 76 C 67 76 62 69 62 60 Z"
              fill="url(#thopLogoCtrl)"
            />
            {/* D-pad */}
            <g fill="#0F172A">
              <rect x="74.5" y="52" width="5" height="15" rx="1.5" />
              <rect x="69.5" y="57" width="15" height="5" rx="1.5" />
            </g>
            {/* Buttons */}
            <g>
              <circle cx="123" cy="54.5" r="2.2" fill="#3B82F6" />
              <circle cx="128.5" cy="59.5" r="2.2" fill="#10B981" />
              <circle cx="117.5" cy="59.5" r="2.2" fill="#F59E0B" />
              <circle cx="123" cy="64.5" r="2.2" fill="#EF4444" />
            </g>
          </g>
        </g>
      </svg>
    );
  }

  // Full Horizontal Brand Logo (Icon + Text)
  return (
    <div
      className={`thop-vector-full-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        userSelect: 'none',
        ...style
      }}
    >
      <ThopLogo variant="icon" size={size} />
      <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            fontSize: `${size * 0.58}px`,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #00d2ff 0%, #0066ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}
        >
          Thop
        </span>
        <span
          style={{
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            fontSize: `${size * 0.58}px`,
            fontWeight: 900,
            color: '#0c1a30',
            letterSpacing: '-0.5px'
          }}
        >
          Games
        </span>
      </div>
    </div>
  );
}
