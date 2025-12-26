"use client";

import Link from "next/link";
import type React from "react";
import { HubCell } from "./HubGrid";

interface MotivatorsGridProps {
  cells: (HubCell | null)[];
  emptyCellBg?: string;
}

export function MotivatorsGrid({
  cells,
  emptyCellBg = "bg-gray-100 dark:bg-gray-800",
}: MotivatorsGridProps): JSX.Element {
  // Always expect 15 cells (3 rows × 5 columns) for MotivatorsCarousel
  const gridCells = Array.from({ length: 15 }, (_, i) => cells[i] || null);

  return (
    <div className="flex justify-center mb-8 md:mb-12">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-w-full">
        {gridCells.map((cell, index) => {
          // Reserved cell (index 7) - always unclickable, 10% opacity
          if (index === 7) {
            return (
              <div
                key={`reserved-${index}`}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ${emptyCellBg} rounded-lg overflow-hidden`}
                aria-hidden="true"
              >
                <img
                  src="/hcip-1.png"
                  alt=""
                  className="w-full h-full object-cover opacity-10"
                />
              </div>
            );
          }

          if (!cell) {
            // Empty cell - use HCIP image at 10% opacity
            const hcipNumber = (index % 54) + 1;
            return (
              <div
                key={`empty-${index}`}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ${emptyCellBg} rounded-lg overflow-hidden`}
                aria-hidden="true"
              >
                <img
                  src={`/hcip-${hcipNumber}.png`}
                  alt=""
                  className="w-full h-full object-cover opacity-10"
                />
              </div>
            );
          }

          const cellContent = (
            <div className="w-full h-full flex flex-col items-center justify-center px-2 relative">
              {/* Show quote text when flipped */}
              {cell.isFlipped && cell.description ? (
                <div className="w-full h-full flex items-center justify-center p-2 z-10 relative">
                  <p className="text-[8px] md:text-[9px] text-white/90 dark:text-white/90 font-medium text-center leading-tight line-clamp-4">
                    {cell.description}
                  </p>
                </div>
              ) : (
                <>
                  {/* Image - 100% opacity for active cells */}
                  {cell.inactiveImage ? (
                    <img
                      src={cell.inactiveImage}
                      alt={cell.name}
                      className="w-full h-full object-cover opacity-100 absolute inset-0 z-0"
                    />
                  ) : null}

                  {/* Name/Micro-label - only show if not flipped and no image */}
                  {cell.name && !cell.inactiveImage && (
                    <span className="text-[9px] md:text-[10px] text-white/90 dark:text-white/90 font-medium text-center leading-tight uppercase tracking-wide whitespace-pre-line z-10 relative">
                      {cell.name}
                    </span>
                  )}
                </>
              )}
            </div>
          );

          const baseClassName = `group relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-navy-900 dark:bg-orange-500 cursor-pointer hover:opacity-90 active:scale-95 transition-all rounded-lg flex items-center justify-center overflow-hidden touch-manipulation animate-[subtle-shake_8s_ease-in-out_infinite] hover:animate-[pulse-glow_2s_ease-in-out_infinite,subtle-shake_8s_ease-in-out_infinite] border-4 border-gray-900 dark:border-gray-100`;

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
                className={baseClassName}
                style={{ animationDelay: `${index * 0.2}s` }}
                aria-label={cell.description || cell.name}
              >
                {/* Badge */}
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

          // If no onClick but has href, use Link
          if (cell.href) {
            return (
              <Link
                key={cell.id}
                href={cell.href}
                className={baseClassName}
                style={{ animationDelay: `${index * 0.2}s` }}
                aria-label={cell.description || cell.name}
              >
                {/* Badge */}
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
          }

          // Default: render as div if not clickable or linkable
          return (
            <div
              key={cell.id}
              className={baseClassName}
              style={{ animationDelay: `${index * 0.2}s` }}
              aria-label={cell.description || cell.name}
            >
              {/* Badge */}
              {cell.badge && (
                <div
                  className={`absolute top-1 right-1 ${cell.badgeColor || "bg-blue-500"} text-white text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md uppercase tracking-tight z-20`}
                >
                  {cell.badge}
                </div>
              )}
              {cellContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
