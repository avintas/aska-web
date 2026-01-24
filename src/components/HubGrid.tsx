"use client";

import Link from "next/link";
import type React from "react";

export interface TriviaQuestionData {
  question_text: string;
  correct_answer: string;
  wrong_answers?: string[];
  is_true?: boolean;
  explanation?: string | null;
  points?: number;
  difficulty?: string | null;
  question_type?: string;
}

export interface HubCell {
  id: string;
  name: string;
  emoji: string;
  href?: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
  onClick?: (e?: React.MouseEvent) => void;
  inactiveImage?: string; // Path to image for inactive cells
  isFlipped?: boolean; // For matching game - show description when flipped
  isMatched?: boolean; // For matching game - card has been matched
  // Metadata for modal display
  theme?: string;
  attribution?: string | null;
  set_title?: string;
  // Visual anchor: center tile that serves as visual center, non-clickable, 25% opacity
  isVisualAnchor?: boolean;
  // Trivia game fields
  isAnswered?: boolean;
  isCorrect?: boolean;
  pointsGained?: number;
  questionData?: TriviaQuestionData;
  // Hub navigation (for Card 0)
  targetCardIndex?: number; // Target card index to navigate to when clicked
}

interface HubGridProps {
  cells: (HubCell | null)[];
  emptyCellBg?: string;
  onShopClick?: () => void;
}

export function HubGrid({
  cells,
  emptyCellBg = "bg-gray-100 dark:bg-gray-800",
  onShopClick,
}: HubGridProps): JSX.Element {
  // LandingCarousel HubGrid: exactly 15 cells (3 rows × 5 columns)
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

          // Inactive cell with image (no href, no onClick) - Landing page Hub Selector
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
                  className="w-full h-full object-cover opacity-10"
                />
              </div>
            );
          }

          const cellContent = (
            <div className="w-full h-full flex flex-col items-center justify-center px-2">
              {/* Emoji */}
              <span
                className="text-5xl md:text-6xl z-10"
                role="img"
                aria-label={cell.name}
              >
                {cell.emoji}
              </span>

              {/* Name/Micro-label */}
              <span className="text-[9px] md:text-[10px] text-white/90 dark:text-white/90 font-medium text-center leading-tight uppercase tracking-wide whitespace-pre-line z-10">
                {cell.name}
              </span>
            </div>
          );

          const className = `group relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-navy-900 dark:bg-orange-500 cursor-pointer hover:opacity-90 active:scale-95 transition-all rounded-lg flex items-center justify-center overflow-hidden touch-manipulation animate-[subtle-shake_8s_ease-in-out_infinite] hover:animate-[pulse-glow_2s_ease-in-out_infinite,subtle-shake_8s_ease-in-out_infinite]`;

          // Use button if onClick is provided, otherwise use Link
          if (cell.onClick) {
            return (
              <button
                key={cell.id}
                onClick={cell.onClick}
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

          // If shop link and onShopClick callback provided, use button instead of Link
          if (cell.href === "/shop" && onShopClick) {
            return (
              <button
                key={cell.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onShopClick();
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
