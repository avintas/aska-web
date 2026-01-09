"use client";

import Link from "next/link";
import Image from "next/image";
import type React from "react";
import { HubCell } from "./HubGrid";

interface FactGridProps {
  cells: (HubCell | null)[];
  emptyCellBg?: string;
}

export function FactGrid({
  cells,
  emptyCellBg = "bg-gray-100 dark:bg-gray-800",
}: FactGridProps): JSX.Element {
  // Flexible grid: supports any number of cells
  // For 15 cells: 3 rows × 5 columns
  const gridCells = cells;

  return (
    <div className="flex justify-center mb-7 md:mb-10">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-w-full">
        {gridCells.map((cell, index) => {
          if (!cell) {
            // Empty cell
            return (
              <div
                key={`empty-${index}`}
                className={`relative w-[86px] h-[86px] sm:w-28 sm:h-28 md:w-32 md:h-32 ${emptyCellBg} rounded-lg`}
                aria-hidden="true"
              />
            );
          }

          // Center cell - grayed out, unclickable with image at 25% opacity
          // Check if this is the center cell by checking for isCenterCell property
          const cellWithCenterFlag = cell as HubCell & {
            isCenterCell?: boolean;
          };
          if (
            cellWithCenterFlag.isCenterCell &&
            cell.inactiveImage &&
            !cell.onClick &&
            !cell.href
          ) {
            return (
              <div
                key={`center-${index}`}
                className={`relative w-[86px] h-[86px] sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg cursor-not-allowed overflow-hidden`}
                aria-hidden="true"
              >
                <Image
                  src={cell.inactiveImage}
                  alt=""
                  fill
                  className="object-cover opacity-25"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `/factoids/the-players-1.png`;
                  }}
                />
              </div>
            );
          }

          // Inactive cell with image (no href, no onClick)
          if (cell.inactiveImage && !cell.href && !cell.onClick) {
            return (
              <div
                key={`inactive-${index}`}
                className={`relative w-[86px] h-[86px] sm:w-28 sm:h-28 md:w-32 md:h-32 ${emptyCellBg} rounded-lg overflow-hidden`}
                aria-hidden="true"
              >
                <Image
                  src={cell.inactiveImage}
                  alt=""
                  fill
                  className="object-cover opacity-100"
                />
              </div>
            );
          }

          const cellContent = (
            <div className="w-full h-full flex flex-col items-center justify-center px-2 relative">
              {/* Show fact text when flipped */}
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
                    <Image
                      src={cell.inactiveImage}
                      alt={cell.name || "Factoid thumbnail"}
                      fill
                      className="object-cover opacity-100 z-0"
                      onError={(e) => {
                        // Fallback to default thumbnail if image fails to load
                        const target = e.target as HTMLImageElement;
                        const originalSrc = target.src;
                        console.warn(
                          "⚠️ Thumbnail failed to load:",
                          originalSrc,
                        );

                        // Try fallback to default players thumbnail
                        if (!target.src.includes("the-players-1.png")) {
                          target.src = `/factoids/the-players-1.png`;
                        } else {
                          // If even fallback fails, hide the image and show background
                          target.style.display = "none";
                        }
                      }}
                      onLoad={(e) => {
                        // Ensure image is visible when it loads successfully
                        const target = e.target as HTMLImageElement;
                        target.style.display = "block";
                      }}
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

          const className = `group relative w-[86px] h-[86px] sm:w-28 sm:h-28 md:w-32 md:h-32 bg-navy-900 dark:bg-orange-500 cursor-pointer hover:opacity-90 active:scale-95 transition-all rounded-lg flex items-center justify-center overflow-hidden touch-manipulation animate-[subtle-shake_8s_ease-in-out_infinite] hover:animate-[pulse-glow_2s_ease-in-out_infinite,subtle-shake_8s_ease-in-out_infinite]`;

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
