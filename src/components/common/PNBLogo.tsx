import React from 'react';

interface PNBLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'white';
  showTagline?: boolean;
}

export const PNBLogo: React.FC<PNBLogoProps> = ({
  className = 'h-10',
  variant = 'full',
  showTagline = true,
}) => {
  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Authentic PNB Crest Representation */}
      <div className="relative flex-shrink-0 w-10 h-10 rounded-lg bg-[#A21D22] flex items-center justify-center shadow-sm border border-[#7B1013]/20">
        <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer circle */}
          <circle cx="50" cy="50" r="45" stroke="#FDB913" strokeWidth="4" />
          {/* Inner ring */}
          <circle cx="50" cy="50" r="38" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" />
          {/* PNB Emblem Monogram */}
          <path
            d="M32 30H56C64 30 68 34 68 42C68 50 62 54 54 54H42V70H32V30Z"
            fill="#FDB913"
          />
          <path
            d="M42 38H53C57 38 60 40 60 43C60 46 57 48 53 48H42V38Z"
            fill="#A21D22"
          />
          {/* Stylized Rupee / Pillar Accent */}
          <path
            d="M58 52L68 70H56L48 54H58Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {variant !== 'compact' && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span
              className={`font-extrabold tracking-tight text-xl ${
                isWhite ? 'text-white' : 'text-[#7B1013]'
              }`}
            >
              पंजाब नेशनल बैंक
            </span>
            <span
              className={`font-bold text-xs uppercase tracking-wider ${
                isWhite ? 'text-[#FDB913]' : 'text-[#A21D22]'
              }`}
            >
              PNB
            </span>
          </div>
          <span
            className={`text-[11px] font-semibold tracking-wide uppercase ${
              isWhite ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            punjab national bank
          </span>
          {showTagline && (
            <span
              className={`text-[9.5px] italic font-medium mt-0.5 ${
                isWhite ? 'text-[#FDB913]' : 'text-[#A21D22]'
              }`}
            >
              ...the name you can BANK upon!
            </span>
          )}
        </div>
      )}
    </div>
  );
};
