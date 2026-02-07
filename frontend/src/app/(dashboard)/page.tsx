"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategorySidebar } from "@/components/notes/category-sidebar";
import { NotesGrid } from "@/components/notes/notes-grid";
import { NewNoteButton } from "@/components/notes/new-note-button";
import { ShortcutsModal } from "@/components/ui/shortcuts-modal";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/api";
import type { Category, Note } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // Seed default categories if needed
      await api.seedDefaultCategories();

      // Fetch categories and notes
      const [categoriesData, notesData] = await Promise.all([
        api.getCategories(),
        api.getNotes(selectedCategoryId ?? undefined),
      ]);

      setCategories(categoriesData);
      setNotes(notesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showToast("Failed to load notes", "error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleNewNote = async () => {
    try {
      // Create a new note with the selected category
      const newNote = await api.createNote({
        title: "",
        content: "",
        category: selectedCategoryId ?? categories[0]?.id ?? null,
      });

      // Navigate to the note editor
      router.push(`/notes/${newNote.id}`);
    } catch (error) {
      console.error("Failed to create note:", error);
      showToast("Failed to create note", "error");
    }
  };

  const handleNoteClick = (note: Note) => {
    router.push(`/notes/${note.id}`);
  };

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-bg-primary z-20 px-4 py-3 flex items-center justify-between border-b border-black/10">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-black/5 rounded-lg transition-colors"
          aria-label="Toggle menu"
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <NewNoteButton onClick={handleNewNote} />
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 h-screen bg-bg-primary z-40 transition-transform duration-300 lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:z-10 w-72 lg:w-64 pt-6 lg:pt-24 pl-6 pr-4 flex flex-col`}
        >
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
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

          <div className="flex-1">
            <CategorySidebar
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleCategorySelect}
            />
          </div>

          {/* Shortcuts & Logout */}
          <div className="pb-6 pt-4 border-t border-black/10 mt-auto space-y-1">
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-black/5 rounded-lg transition-colors w-full"
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
                  d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              Shortcuts
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-black/5 rounded-lg transition-colors w-full"
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
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 lg:ml-72 p-4 lg:p-6 pt-20 lg:pt-24">
          {/* Desktop header with New Note button */}
          <div className="hidden lg:block fixed top-0 right-0 p-6 z-10">
            <NewNoteButton onClick={handleNewNote} />
          </div>

          {/* Notes grid */}
          <NotesGrid notes={notes} onNoteClick={handleNoteClick} />
        </main>
      </div>

      {/* Shortcuts modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
