"use client";

import Link from "next/link";
import { HubCell } from "./HubGrid";

interface HubSelectorGridProps {
  cells: (HubCell | null)[];
  emptyCellBg?: string;
}

export function HubSelectorGrid({
  cells,
  emptyCellBg = "bg-gray-100 dark:bg-gray-800",
}: HubSelectorGridProps): JSX.Element {
  // Layout structure:
  // - 2 large cards (left and right) - cells[0] and cells[1]
  // - 8 smaller cards in middle:
  //   - Top row: 3 cards - cells[2], cells[3], cells[4]
  //   - Bottom row: 5 cards - cells[5], cells[6], cells[7], cells[8], cells[9]
  const gridCells = Array.from({ length: 10 }, (_, i) => cells[i] || null);

  const renderCell = (cell: HubCell | null, index: number, isLarge = false) => {
    if (!cell) {
      return (
        <div
          key={`empty-${index}`}
          className={`relative ${
            isLarge
              ? "w-32 h-48 sm:w-40 sm:h-56 md:w-48 md:h-64"
              : "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
          } ${emptyCellBg} rounded-lg`}
          aria-hidden="true"
        />
      );
    }

    // Inactive cell with image
    if (cell.inactiveImage && !cell.href && !cell.onClick) {
      return (
        <div
          key={`inactive-${index}`}
          className={`relative ${
            isLarge
              ? "w-32 h-48 sm:w-40 sm:h-56 md:w-48 md:h-64"
              : "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
          } ${emptyCellBg} rounded-lg overflow-hidden`}
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
          className={`${isLarge ? "text-6xl md:text-7xl" : "text-5xl md:text-6xl"} z-10`}
          role="img"
          aria-label={cell.name}
        >
          {cell.emoji}
        </span>

        {/* Name/Micro-label */}
        <span
          className={`text-[9px] md:text-[10px] ${
            isLarge
              ? "text-gray-800 dark:text-gray-200"
              : "text-gray-700 dark:text-gray-300"
          } font-medium text-center leading-tight uppercase tracking-wide whitespace-pre-line z-10`}
        >
          {cell.name}
        </span>
      </div>
    );

    // Large cards: light green (mint green), small cards: very pale green
    const bgColor = isLarge
      ? "bg-green-300 dark:bg-green-500"
      : "bg-green-50 dark:bg-green-900/30";

    const baseClassName = `group relative ${
      isLarge
        ? "w-32 h-48 sm:w-40 sm:h-56 md:w-48 md:h-64"
        : "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
    } ${bgColor} cursor-pointer hover:opacity-90 active:scale-95 transition-all rounded-lg flex items-center justify-center overflow-hidden touch-manipulation border border-red-300 dark:border-red-500`;

    // Use button if onClick is provided, otherwise use Link
    if (cell.onClick) {
      return (
        <button
          key={cell.id}
          onClick={cell.onClick}
          className={baseClassName}
          style={{ animationDelay: `${index * 0.1}s` }}
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

    return (
      <Link
        key={cell.id}
        href={cell.href || "#"}
        className={baseClassName}
        style={{ animationDelay: `${index * 0.1}s` }}
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
  };

  return (
    <div className="flex justify-center mb-8 md:mb-12">
      <div className="overflow-x-auto w-full pb-4">
        <div className="inline-flex items-start gap-2 px-4">
          {/* Left large card */}
          <div className="flex-shrink-0">
            {renderCell(gridCells[0], 0, true)}
          </div>

          {/* Middle section with smaller cards */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {/* Top row: 3 smaller cards */}
            <div className="flex gap-2">
              {[2, 3, 4].map((cellIndex) =>
                renderCell(gridCells[cellIndex], cellIndex, false),
              )}
            </div>

            {/* Bottom row: 5 smaller cards */}
            <div className="flex gap-2">
              {[5, 6, 7, 8, 9].map((cellIndex) =>
                renderCell(gridCells[cellIndex], cellIndex, false),
              )}
            </div>
          </div>

          {/* Right large card */}
          <div className="flex-shrink-0">
            {renderCell(gridCells[1], 1, true)}
          </div>
        </div>
      </div>
    </div>
  );
}
