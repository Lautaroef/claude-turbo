"use client";

import type { Note } from "@/types";
import { NoteCard } from "./note-card";
import { EmptyState } from "./empty-state";

interface NotesGridProps {
  notes: Note[];
  onNoteClick: (note: Note) => void;
}

export function NotesGrid({ notes, onNoteClick }: NotesGridProps) {
  if (notes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onClick={() => onNoteClick(note)} />
      ))}
    </div>
  );
}
