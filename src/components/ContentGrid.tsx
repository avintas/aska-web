"use client";

import Link from "next/link";
import type React from "react";
import { HubCell } from "./HubGrid";
import { isVisualAnchorIndex } from "@/utils/visualAnchor";

interface ContentGridProps {
  cells: (HubCell | null)[];
  flippedCards: Set<string>;
  onCellClick: (
    cellId: string,
    content: string,
    theme?: string,
    attribution?: string,
    set_title?: string,
  ) => void;
  emptyCellBg?: string;
}

export function ContentGrid({
  cells,
  flippedCards,
  onCellClick,
  emptyCellBg = "bg-gray-100 dark:bg-gray-800",
}: ContentGridProps): JSX.Element {
  // Expect exactly 15 cells (3 rows × 5 columns)
  const gridCells = Array.from({ length: 15 }, (_, i) => cells[i] || null);

  return (
    <div className="flex justify-center mb-8 md:mb-12">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-w-full">
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

          // Inactive cell with image (no href, no onClick) - Used for padding
          if (
            cell.inactiveImage &&
            !cell.href &&
            !cell.onClick &&
            !cell.description
          ) {
            return (
              <div
                key={`inactive-${index}`}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ${emptyCellBg} rounded-lg overflow-hidden`}
                aria-hidden="true"
              >
                <img
                  src={cell.inactiveImage}
                  alt=""
                  className="w-full h-full object-cover opacity-10"
                  onError={(e) => {
                    // Fallback to center-tile.webp for factoid, motivator, and trivia images that fail to load
                    const target = e.target as HTMLImageElement;
                    if (target.src) {
                      if (
                        target.src.includes("/factoids/") &&
                        !target.src.includes("center-tile.webp")
                      ) {
                        target.src = "/factoids/center-tile.webp";
                      } else if (
                        target.src.includes("/motivators/") &&
                        !target.src.includes("center-tile.webp")
                      ) {
                        target.src = "/motivators/center-tile.webp";
                      } else if (
                        target.src.includes("/trivia-arena/") &&
                        !target.src.includes("center-tile.webp")
                      ) {
                        target.src = "/trivia-arena/center-tile.webp";
                      }
                    }
                  }}
                />
              </div>
            );
          }

          const isFlipped = flippedCards.has(cell.id);
          const isVisualAnchor =
            cell.isVisualAnchor || isVisualAnchorIndex(index);
          const isTriviaAnswered = cell.isAnswered === true;
          const isTriviaCorrect = cell.isCorrect === true;

          const cellContent = (
            <div className="w-full h-full flex flex-col items-center justify-center px-2 relative">
              {/* Trivia answered state - show badge/icon and points */}
              {isTriviaAnswered ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 z-10 relative">
                  {/* Correct/Incorrect Badge */}
                  <div
                    className={`text-4xl md:text-5xl mb-1 ${
                      isTriviaCorrect ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {isTriviaCorrect ? "✓" : "✗"}
                  </div>
                  {/* Points Display */}
                  {cell.pointsGained !== undefined && (
                    <div
                      className={`text-[10px] md:text-[11px] font-bold ${
                        isTriviaCorrect ? "text-green-300" : "text-red-300"
                      }`}
                    >
                      {cell.pointsGained > 0
                        ? `+${cell.pointsGained}`
                        : cell.pointsGained}
                    </div>
                  )}
                </div>
              ) : isFlipped && cell.description ? (
                // Show text preview when flipped (for non-trivia content)
                <div className="w-full h-full flex items-center justify-center p-2 z-10 relative">
                  {cell.isBonus ? (
                    // Bonus tile - display "BONUS" and "15 points"
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-[12px] md:text-[14px] text-white font-black uppercase tracking-wider mb-1">
                        BONUS
                      </p>
                      <p className="text-[10px] md:text-[12px] text-white/90 font-bold">
                        15 points
                      </p>
                    </div>
                  ) : cell.isSponsored ? (
                    // Sponsored tile - display "This is a sponsored ad"
                    <p className="text-[8px] md:text-[9px] text-white/90 dark:text-white/90 font-medium text-center leading-tight">
                      This is a sponsored ad
                    </p>
                  ) : (
                    // Regular content preview
                    <p className="text-[8px] md:text-[9px] text-white/90 dark:text-white/90 font-medium text-center leading-tight line-clamp-4">
                      {cell.description.substring(0, 100)}...
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {/* Background Image */}
                  {cell.inactiveImage && (
                    <img
                      src={cell.inactiveImage}
                      alt={cell.name}
                      className={`w-full h-full object-cover absolute inset-0 z-0 ${isVisualAnchor ? "opacity-25" : "opacity-100"}`}
                      onError={(e) => {
                        // Fallback to center-tile.webp for factoid, motivator, and trivia images that fail to load
                        const target = e.target as HTMLImageElement;
                        if (target.src) {
                          if (
                            target.src.includes("/factoids/") &&
                            !target.src.includes("center-tile.webp")
                          ) {
                            target.src = "/factoids/center-tile.webp";
                          } else if (
                            target.src.includes("/motivators/") &&
                            !target.src.includes("center-tile.webp")
                          ) {
                            target.src = "/motivators/center-tile.webp";
                          } else if (
                            target.src.includes("/trivia-arena/") &&
                            !target.src.includes("center-tile.webp")
                          ) {
                            target.src = "/trivia-arena/center-tile.webp";
                          }
                        }
                      }}
                    />
                  )}

                  {/* Emoji (for trivia/factoids without background images) */}
                  {cell.emoji && !cell.inactiveImage && (
                    <span
                      className="text-5xl md:text-6xl z-10"
                      role="img"
                      aria-label={cell.name || "Tile"}
                    >
                      {cell.emoji}
                    </span>
                  )}
                </>
              )}
            </div>
          );

          // Visual anchor tiles: 25% opacity, non-clickable, no hover effects
          // Trivia answered tiles: different styling based on correct/incorrect
          let baseClassName: string;
          if (isVisualAnchor) {
            baseClassName = `group relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-navy-900 dark:bg-orange-500 rounded-lg flex items-center justify-center overflow-hidden opacity-25 pointer-events-none`;
          } else if (isTriviaAnswered) {
            // Answered trivia tiles: colored border based on correctness
            const borderColor = isTriviaCorrect
              ? "border-green-500 dark:border-green-400"
              : "border-red-500 dark:border-red-400";
            baseClassName = `group relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-navy-900 dark:bg-orange-500 cursor-pointer hover:opacity-90 active:scale-95 transition-all rounded-lg flex items-center justify-center overflow-hidden touch-manipulation border-2 ${borderColor}`;
          } else {
            baseClassName = `group relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-navy-900 dark:bg-orange-500 cursor-pointer hover:opacity-90 active:scale-95 transition-all rounded-lg flex items-center justify-center overflow-hidden touch-manipulation animate-[subtle-shake_8s_ease-in-out_infinite] hover:animate-[pulse-glow_2s_ease-in-out_infinite,subtle-shake_8s_ease-in-out_infinite]`;
          }

          // Visual anchor tiles are always non-interactive
          if (isVisualAnchor) {
            return (
              <div key={cell.id} className={baseClassName} aria-hidden="true">
                {cellContent}
              </div>
            );
          }

          // Clickable cell with modal/flip functionality
          if (cell.onClick || cell.description) {
            return (
              <button
                key={cell.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (cell.onClick) {
                    cell.onClick(e);
                  }

                  // Trigger flip and modal
                  if (cell.description) {
                    onCellClick(
                      cell.id,
                      cell.description,
                      cell.theme,
                      cell.attribution || undefined,
                      cell.set_title,
                    );
                  }
                }}
                className={baseClassName}
                style={{ animationDelay: `${index * 0.2}s` }}
                aria-label={cell.description || cell.name}
              >
                {/* Badge - removed for now, will be used for trivia game bonus content in the future */}
                {cellContent}
              </button>
            );
          }

          // Link cell (for navigation)
          if (cell.href) {
            return (
              <Link
                key={cell.id}
                href={cell.href}
                className={baseClassName}
                style={{ animationDelay: `${index * 0.2}s` }}
                aria-label={cell.description || cell.name}
              >
                {/* Badge - removed for now, will be used for trivia game bonus content in the future */}
                {cellContent}
              </Link>
            );
          }

          // Default: non-interactive cell
          return (
            <div
              key={cell.id}
              className={baseClassName}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Badge - removed for now, will be used for trivia game bonus content in the future */}
              {cellContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
