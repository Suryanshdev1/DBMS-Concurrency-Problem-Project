"use client";

interface ToggleProps {
  isSafe: boolean;
  setIsSafe: (val: boolean) => void;
}

export default function ModeToggle({ isSafe, setIsSafe }: ToggleProps) {
  return (
    <div className="panel flex items-center gap-4 px-5 py-3">
      <span className={`text-sm font-semibold ${!isSafe ? 'text-accent' : 'text-muted'}`}>Unsafe</span>
      <button
        type="button" role="switch" aria-checked={isSafe} aria-label="Toggle safe mode"
        onClick={() => setIsSafe(!isSafe)}
        className="relative w-14 h-7 rounded-full transition-colors duration-300"
        style={{ background: 'var(--accent-color)' }}
      >
        <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${isSafe ? 'translate-x-7' : ''}`} />
      </button>
      <span className={`text-sm font-semibold ${isSafe ? 'text-accent' : 'text-muted'}`}>Safe</span>
    </div>
  );
}