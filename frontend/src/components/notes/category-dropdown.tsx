"use client";

import { useState, useRef, useEffect } from "react";
import type { Category } from "@/types";

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelect: (categoryId: number) => void;
}

const CATEGORY_DOT_COLORS: Record<string, string> = {
  "#F5C4A1": "bg-[#E8A87C]",
  "#F5E6A3": "bg-[#E8D87C]",
  "#A8D5D8": "bg-[#7CB8BC]",
};

function getCategoryDotColor(color: string): string {
  return CATEGORY_DOT_COLORS[color.toUpperCase()] || "bg-gray-400";
}

export function CategoryDropdown({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-[160px] sm:w-[225px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-md bg-transparent"
      >
        {selectedCategory && (
          <span
            className={`w-[11px] h-[11px] rounded-full ${getCategoryDotColor(selectedCategory.color)}`}
          />
        )}
        <span className="flex-1 text-xs text-black text-left">
          {selectedCategory?.name || "Select category"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-md shadow-lg z-50">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onSelect(category.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-black/5 transition-colors ${
                category.id === selectedCategoryId ? "bg-black/5" : ""
              }`}
            >
              <span
                className={`w-[11px] h-[11px] rounded-full ${getCategoryDotColor(category.color)}`}
              />
              <span className="text-xs text-black">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
