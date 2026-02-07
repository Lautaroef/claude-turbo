"use client";

interface NewNoteButtonProps {
  onClick: () => void;
}

export function NewNoteButton({ onClick }: NewNoteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-3 border border-[var(--accent)] rounded-full text-[var(--text-accent)] font-bold hover:bg-[var(--accent)] hover:text-white transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      New Note
    </button>
  );
}
