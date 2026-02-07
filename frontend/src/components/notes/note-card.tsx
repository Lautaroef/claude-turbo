"use client";

import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "#F5C4A1": "bg-[#F5C4A1]",
  "#F5E6A3": "bg-[#F5E6A3]",
  "#A8D5D8": "bg-[#A8D5D8]",
};

function getCategoryBgColor(color: string | null): string {
  if (!color) return "bg-[#F5C4A1]";
  return CATEGORY_COLORS[color.toUpperCase()] || "bg-[#F5C4A1]";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "today";
  } else if (diffDays === 1) {
    return "yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  const bgColor = getCategoryBgColor(note.category_color);

  return (
    <button
      onClick={onClick}
      className={`${bgColor} rounded-2xl p-5 text-left w-full h-[246px] flex flex-col transition-transform hover:scale-[1.02] hover:shadow-lg`}
    >
      {/* Header: Date + Category */}
      <div className="flex items-center gap-2 text-xs text-black/70 mb-2">
        <span className="font-medium">{formatDate(note.updated_at)}</span>
        {note.category_name && (
          <span className="text-black/50">{note.category_name}</span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-heading font-bold text-xl text-black mb-2 line-clamp-2">
        {note.title || "Untitled"}
      </h3>

      {/* Content preview */}
      <p className="text-sm text-black/80 line-clamp-6 flex-1 overflow-hidden whitespace-pre-wrap">
        {note.content || "No content yet..."}
      </p>
    </button>
  );
}
