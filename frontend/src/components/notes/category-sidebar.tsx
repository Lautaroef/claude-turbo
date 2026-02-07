"use client";

import type { Category } from "@/types";

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

const CATEGORY_DOT_COLORS: Record<string, string> = {
  "#F5C4A1": "bg-[#E8A87C]",
  "#F5E6A3": "bg-[#E8D87C]",
  "#A8D5D8": "bg-[#7CB8BC]",
};

function getCategoryDotColor(color: string): string {
  return CATEGORY_DOT_COLORS[color.toUpperCase()] || "bg-gray-400";
}

export function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategorySidebarProps) {
  const totalNotes = categories.reduce((sum, cat) => sum + cat.notes_count, 0);

  return (
    <aside className="w-64 shrink-0">
      <nav className="space-y-0">
        {/* All Categories */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors ${
            selectedCategoryId === null
              ? "font-bold text-black"
              : "text-black hover:bg-black/5"
          }`}
        >
          <span className="text-xs font-bold">All Categories</span>
          {selectedCategoryId === null && totalNotes > 0 && (
            <span className="text-xs">{totalNotes}</span>
          )}
        </button>

        {/* Category list */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-left transition-colors ${
              selectedCategoryId === category.id
                ? "bg-black/5"
                : "hover:bg-black/5"
            }`}
          >
            <span
              className={`w-[11px] h-[11px] rounded-full ${getCategoryDotColor(category.color)}`}
            />
            <span className="flex-1 text-xs text-black">{category.name}</span>
            {category.notes_count > 0 && (
              <span className="text-xs text-black">{category.notes_count}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}
