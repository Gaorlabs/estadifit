import React from 'react';

interface EstadoFitLogoProps {
  className?: string;
  size?: number | string;
  withGlow?: boolean;
  withTextUnder?: boolean;
}

export const EstadoFitLogo: React.FC<EstadoFitLogoProps> = ({
  className = '',
  size = 64,
  withGlow = false,
  withTextUnder = false,
}) => {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center shrink-0 ${className}`}>
      {withGlow && (
        <div className="absolute inset-0 rounded-full bg-[#5b874b]/30 blur-xl -z-10 animate-glow-pulse" />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm select-none"
      >
        <circle cx="100" cy="100" r="98" fill="#5b874b" />
        
        {/* Outer Circular Ring with bottom gap for text */}
        <path
          d="M 48 152 A 76 76 0 1 1 152 152"
          stroke="#FAF7EF"
          strokeWidth="4.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner Top Arch */}
        <path
          d="M 64 74 C 74 52, 126 52, 136 74"
          stroke="#FAF7EF"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Central Left Leaf/Wing */}
        <path
          d="M 94 138 C 94 110, 52 82, 50 82 C 48 82, 48 120, 94 138 Z"
          stroke="#FAF7EF"
          strokeWidth="4.2"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Central Right Leaf/Wing */}
        <path
          d="M 106 138 C 106 110, 148 82, 150 82 C 152 82, 152 120, 106 138 Z"
          stroke="#FAF7EF"
          strokeWidth="4.2"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Small Central Sprout Line */}
        <path
          d="M 100 137 L 100 106"
          stroke="#FAF7EF"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Text Along Path or curved rendered "Estado Fit" */}
        <defs>
          <path
            id="textPathArc"
            d="M 44 148 A 76 76 0 0 0 156 148"
            fill="none"
          />
        </defs>
        <text fill="#FAF7EF" fontSize="21.5" fontWeight="700" letterSpacing="0.8px" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
          <textPath href="#textPathArc" startOffset="50%" textAnchor="middle">
            Estado Fit
          </textPath>
        </text>
      </svg>

      {withTextUnder && (
        <span className="mt-2 text-xs font-semibold tracking-wider uppercase text-emerald-800 dark:text-emerald-400">
          Repostería & Platos Fit
        </span>
      )}
    </div>
  );
};
