interface OptionCardProps {
  icon: string;
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}

const ICONS: Record<string, React.ReactNode> = {
  wallet: (
    <>
      <path d="M3 7h18v10H3z" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  home: (
    <>
      <path d="M4 21V11l8-6 8 6v10" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  star: <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />,
  solo: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" />
    </>
  ),
  couple: (
    <>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M3 20c0-3 2.2-5 5-5M21 20c0-3-2.2-5-5-5" />
    </>
  ),
  friends: (
    <>
      <circle cx="7" cy="9" r="2.4" />
      <circle cx="17" cy="9" r="2.4" />
      <circle cx="12" cy="7" r="2.4" />
      <path d="M3 20c0-2.6 1.8-4 4-4M21 20c0-2.6-1.8-4-4-4M8 20c0-2.8 1.8-4.5 4-4.5s4 1.7 4 4.5" />
    </>
  ),
};

function OptionCard({ icon, title, desc, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative overflow-hidden rounded-2xl border bg-surface p-4.5 text-left transition hover:-translate-y-0.5 hover:border-line-strong hover:shadow-soft ${
        selected ? 'border-line ring-2 ring-inset ring-ink' : 'border-line'
      }`}
    >
      {selected && (
        <span
          aria-hidden="true"
          className="absolute right-3.5 top-3.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-[0.7rem] text-white"
        >
          ✓
        </span>
      )}
      <svg
        className="mb-6 h-7 w-7 text-ink"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        {ICONS[icon] ?? ICONS.star}
      </svg>
      <span className="mb-0.75 block text-base font-semibold tracking-[-0.01em]">{title}</span>
      <span className="block text-[0.82rem] leading-normal text-muted2">{desc}</span>
    </button>
  );
}

export default OptionCard;
