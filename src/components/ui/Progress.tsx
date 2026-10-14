export function SkillMeter({ name, percent }: { name: string; percent: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4 font-bold">
        <span>{name}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full border-2 border-ink bg-white" aria-hidden="true">
        <div className="h-full bg-coral" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function CompassBadge({ earned }: { earned: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <svg
        viewBox="0 0 160 160"
        className="h-36 w-36"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="80" cy="80" r="68" fill="#ffffff" stroke="#1c1a17" strokeWidth="4" />
        <circle cx="80" cy="80" r="48" fill="none" stroke="#176b68" strokeWidth="3" />
        <path
          className="pathway"
          d="M80 112 C 80 112, 58 96, 58 74 C 58 56, 70 46, 80 46 C 96 46, 108 60, 100 76 C 94 88, 80 90, 80 90"
          fill="none"
          stroke={earned ? "#f08069" : "#176b68"}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="80" cy="46" r="5" fill={earned ? "#f08069" : "#176b68"} />
      </svg>
      <p className="text-2xl font-bold tracking-wide">
        {earned ? "AI Explorer" : "AI Explorer badge locked"}
      </p>
    </div>
  );
}
