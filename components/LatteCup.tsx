// Illustrated latte with latte-art heart and rising steam.
export default function LatteCup({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 300" className={className} role="img" aria-label="A latte with a heart drawn in the foam">
      <g className="steam" fill="none" stroke="#f4e6d4" strokeWidth="7" strokeLinecap="round" opacity="0.9">
        <path d="M120 70c-14-18 14-28 0-46" />
        <path d="M160 64c-14-18 14-28 0-46" />
        <path d="M200 70c-14-18 14-28 0-46" />
      </g>
      <ellipse cx="160" cy="262" rx="140" ry="26" fill="#1b100a" opacity="0.35" />
      <ellipse cx="160" cy="250" rx="132" ry="26" fill="#efe3d3" />
      <ellipse cx="160" cy="246" rx="100" ry="17" fill="#d9c7b1" />
      <path d="M262 132c34-6 48 18 40 42-8 26-36 34-56 30" fill="none" stroke="#f7efe4" strokeWidth="16" strokeLinecap="round" />
      <path d="M58 112h204c0 72-26 132-102 132S58 184 58 112Z" fill="#f7efe4" />
      <path d="M58 112h204c0 10-1 19-2 28H60c-1-9-2-18-2-28Z" fill="#e9dccb" />
      <ellipse cx="160" cy="112" rx="102" ry="28" fill="#f7efe4" />
      <ellipse cx="160" cy="113" rx="90" ry="22" fill="#6b3b22" />
      <ellipse cx="160" cy="113" rx="80" ry="18" fill="#a5643c" />
      <path d="M160 128c-22-12-30-22-22-30 6-6 16-3 22 5 6-8 16-11 22-5 8 8 0 18-22 30Z" fill="#f6e7d2" />
      <path d="M160 122c-12-7-16-12-12-16 3-3 8-1 12 3 4-4 9-6 12-3 4 4 0 9-12 16Z" fill="#c98a55" opacity="0.5" />
    </svg>
  );
}
