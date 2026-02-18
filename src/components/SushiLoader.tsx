export const SushiLoader = () => {
  return (
    <div className="grid place-items-center min-h-[200px]">
      <div className="relative w-[320px] h-[120px] overflow-hidden">
        {/* シャリ（中央基準） */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[2px] animate-sushi-shari z-0">
          <ShariSVG />
        </div>

        {/* ネタ（中央基準・上に重ねる） */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[16px] animate-sushi-neta z-10">
          <NetaSVG />
        </div>
      </div>
    </div>
  );
};

const ShariSVG = () => (
  <svg width="120" height="48" viewBox="0 0 120 48" fill="none" aria-label="shari">
    <ellipse cx="60" cy="42" rx="46" ry="5" fill="rgba(0,0,0,0.08)" />
    <rect x="16" y="8" width="88" height="28" rx="14" fill="#FFFFFF" stroke="#E5E7EB" />
    {[...Array(18)].map((_, i) => {
      const x = 24 + (i % 9) * 8;
      const y = 14 + Math.floor(i / 9) * 8;
      return <circle key={i} cx={x} cy={y} r="1.5" fill="#E5E7EB" />;
    })}
  </svg>
);

const NetaSVG = () => (
  <svg width="140" height="54" viewBox="0 0 140 54" fill="none" aria-label="neta">
    <path
      d="M10 22 C40 0, 100 0, 130 22 C134 26,134 34,130 38 C100 60,40 60,10 38 C6 34,6 26,10 22Z"
      fill="#dc2626"
    />
    <path
      d="M22 22 C46 8, 96 8, 118 22"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);
