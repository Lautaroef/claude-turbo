"use client";

import { use } from "react";
import { NoteEditor } from "@/components/notes/note-editor";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export default function NotePage({ params }: NotePageProps) {
  const { id } = use(params);
  const noteId = parseInt(id, 10);

  if (isNaN(noteId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-text-primary">Invalid note ID</p>
      </div>
    );
  }

  return <NoteEditor noteId={noteId} />;
}
