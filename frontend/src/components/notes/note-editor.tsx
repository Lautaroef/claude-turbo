"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { CategoryDropdown } from "./category-dropdown";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/api";
import type { Category, Note, ApiError } from "@/types";

interface NoteEditorProps {
  noteId: number;
}

const CATEGORY_BG_COLORS: Record<string, string> = {
  "#F5C4A1": "bg-[rgba(239,156,102,0.5)] border-[#ef9c66]",
  "#F5E6A3": "bg-[rgba(245,230,163,0.5)] border-[#e8d87c]",
  "#A8D5D8": "bg-[rgba(168,213,216,0.5)] border-[#7cb8bc]",
};

function getCategoryBgStyle(color: string | null): string {
  if (!color) return "bg-[rgba(239,156,102,0.5)] border-[#ef9c66]";
  return (
    CATEGORY_BG_COLORS[color.toUpperCase()] ||
    "bg-[rgba(239,156,102,0.5)] border-[#ef9c66]"
  );
}

function formatLastEdited(dateString: string): string {
  const date = new Date(dateString);
  return `Last Edited: ${date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })} at ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase()}`;
}

function parseApiError(error: ApiError): string {
  if (error.title) {
    const titleError = Array.isArray(error.title) ? error.title[0] : error.title;
    if (titleError.includes("255 characters")) {
      return "Title is too long (max 255 characters)";
    }
    return `Title: ${titleError}`;
  }
  if (error.content) {
    return `Content: ${Array.isArray(error.content) ? error.content[0] : error.content}`;
  }
  if (error.detail) {
    return error.detail;
  }
  return "Failed to save note";
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [note, setNote] = useState<Note | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]); // Include title/content so handleClose saves latest values

  // Fetch note and categories
  useEffect(() => {
    async function fetchData() {
      try {
        const [noteData, categoriesData] = await Promise.all([
          api.getNote(noteId),
          api.getCategories(),
        ]);
        setNote(noteData);
        setTitle(noteData.title);
        setContent(noteData.content);
        setCategories(categoriesData);
        setLastSaved(noteData.updated_at);
      } catch (error) {
        console.error("Failed to fetch note:", error);
        showToast("Failed to load note", "error");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [noteId, router, showToast]);

  // Auto-save with debounce
  const saveNote = useCallback(
    async (updates: Partial<Pick<Note, "title" | "content" | "category">>) => {
      if (!note) return;

      setIsSaving(true);
      try {
        const updatedNote = await api.updateNote(note.id, updates);
        setNote(updatedNote);
        setLastSaved(updatedNote.updated_at);
      } catch (error) {
        const apiError = error as ApiError;
        const message = parseApiError(apiError);
        showToast(message, "error");
      } finally {
        setIsSaving(false);
      }
    },
    [note, showToast]
  );

  const debouncedSave = useCallback(
    (updates: Partial<Pick<Note, "title" | "content" | "category">>) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveNote(updates);
      }, 500);
    },
    [saveNote]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedSave({ title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    debouncedSave({ content: newContent });
  };

  const handleCategoryChange = (categoryId: number) => {
    const selectedCategory = categories.find((c) => c.id === categoryId);
    if (note && selectedCategory) {
      setNote({
        ...note,
        category: categoryId,
        category_name: selectedCategory.name,
        category_color: selectedCategory.color,
      });
      saveNote({ category: categoryId });
    }
  };

  const handleClose = useCallback(() => {
    // Save any pending changes before closing
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveNote({ title, content });
    }
    router.push("/");
  }, [router, saveNote, title, content]);

  const handleDelete = async () => {
    if (!note) return;
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await api.deleteNote(note.id);
        showToast("Note deleted", "success");
        router.push("/");
      } catch (error) {
        console.error("Failed to delete note:", error);
        showToast("Failed to delete note", "error");
      }
    }
  };

  if (isLoading || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  const bgStyle = getCategoryBgStyle(note.category_color);

  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <CategoryDropdown
          categories={categories}
          selectedCategoryId={note.category}
          onSelect={handleCategoryChange}
        />

        <div className="flex items-center gap-2 md:gap-4">
          {isSaving && (
            <span className="text-xs text-text-secondary hidden sm:inline">Saving...</span>
          )}
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete note"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
          <button
            onClick={handleClose}
            className="p-2 text-text-primary hover:bg-black/5 rounded-lg transition-colors"
            title="Close (Esc)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Note content area */}
      <div
        className={`${bgStyle} border-[3px] rounded-xl p-6 md:p-16 min-h-[calc(100vh-120px)] md:min-h-[700px] shadow-sm`}
      >
        {/* Last edited */}
        {lastSaved && (
          <p className="text-xs text-black text-right mb-6">
            {formatLastEdited(lastSaved)}
          </p>
        )}

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note Title"
          maxLength={255}
          className="w-full bg-transparent text-xl md:text-2xl font-heading font-bold text-black placeholder:text-black/50 mb-6 focus:outline-none"
        />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Pour your heart out..."
          className="w-full h-[calc(100vh-300px)] md:h-[500px] bg-transparent text-base text-black placeholder:text-black/50 resize-none focus:outline-none leading-relaxed"
        />
      </div>
    </div>
  );
}
