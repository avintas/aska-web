"use client";

import Link from "next/link";
import type React from "react";
import { HubCell } from "./HubGrid";

interface PuzzleGameGridProps {
  cells: (HubCell | null)[];
  emptyCellBg?: string;
}

export function PuzzleGameGrid({
  cells,
  emptyCellBg = "bg-gray-100 dark:bg-gray-800",
}: PuzzleGameGridProps): JSX.Element {
  // Puzzle Game Grid: 20 cells (4 rows × 5 columns)
  const gridCells = Array.from({ length: 20 }, (_, i) => cells[i] || null);

  return (
    <div className="flex justify-center mb-7 md:mb-10">
      <div className="grid grid-cols-4 md:grid-cols-5 gap-2 max-w-full">
        {gridCells.map((cell, index) => {
          if (!cell) {
            // Empty cell
            return (
              <div
                key={`empty-${index}`}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ${emptyCellBg} rounded-lg`}
                aria-hidden="true"
              />
            );
          }

          // Inactive cell with image (no href, no onClick)
          if (cell.inactiveImage && !cell.href && !cell.onClick) {
            return (
              <div
                key={`inactive-${index}`}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ${emptyCellBg} rounded-lg overflow-hidden`}
                aria-hidden="true"
              >
                <img
                  src={cell.inactiveImage}
                  alt=""
                  className="w-full h-full object-cover opacity-100"
                />
              </div>
            );
          }

          const cellContent = (
            <div className="w-full h-full flex flex-col items-center justify-center px-2 relative">
              {/* Show fact text when flipped (for matching game) */}
              {cell.isFlipped && cell.description ? (
                <div className="w-full h-full flex items-center justify-center p-2 z-10 relative">
                  <p className="text-[8px] md:text-[9px] text-white/90 dark:text-white/90 font-medium text-center leading-tight line-clamp-4">
                    {cell.description}
                  </p>
                </div>
              ) : (
                <>
                  {/* Image if provided (for clickable cells), otherwise emoji */}
                  {cell.inactiveImage ? (
                    <img
                      src={cell.inactiveImage}
                      alt={cell.name}
                      className="w-full h-full object-cover opacity-100 absolute inset-0 z-0"
                    />
                  ) : cell.emoji ? (
                    <span
                      className="text-5xl md:text-6xl z-10"
                      role="img"
                      aria-label={cell.name}
                    >
                      {cell.emoji}
                    </span>
                  ) : null}

                  {/* Name/Micro-label - only show if not flipped */}
                  {cell.name && (
                    <span className="text-[9px] md:text-[10px] text-white/90 dark:text-white/90 font-medium text-center leading-tight uppercase tracking-wide whitespace-pre-line z-10 relative">
                      {cell.name}
                    </span>
                  )}
                </>
              )}
            </div>
          );

          const className = `group relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-navy-900 dark:bg-orange-500 cursor-pointer hover:opacity-90 active:scale-95 transition-all rounded-lg flex items-center justify-center overflow-hidden touch-manipulation animate-[subtle-shake_8s_ease-in-out_infinite] hover:animate-[pulse-glow_2s_ease-in-out_infinite,subtle-shake_8s_ease-in-out_infinite]`;

          // Use button if onClick is provided, otherwise use Link
          if (cell.onClick) {
            return (
              <button
                key={cell.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  cell.onClick?.(e);
                }}
                className={className}
                style={{ animationDelay: `${index * 0.2}s` }}
                aria-label={cell.description || cell.name}
              >
                {/* Badge - positioned relative to cell container */}
                {cell.badge && (
                  <div
                    className={`absolute top-1 right-1 ${cell.badgeColor || "bg-blue-500"} text-white text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md uppercase tracking-tight z-20`}
                  >
                    {cell.badge}
                  </div>
                )}
                {cellContent}
              </button>
            );
          }

          return (
            <Link
              key={cell.id}
              href={cell.href || "#"}
              className={className}
              style={{ animationDelay: `${index * 0.2}s` }}
              aria-label={cell.description || cell.name}
            >
              {/* Badge - positioned relative to cell container */}
              {cell.badge && (
                <div
                  className={`absolute top-1 right-1 ${cell.badgeColor || "bg-blue-500"} text-white text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md uppercase tracking-tight z-20`}
                >
                  {cell.badge}
                </div>
              )}
              {cellContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
