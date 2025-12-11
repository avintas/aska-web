"use client";

import { useState } from "react";

// Cell display type: A = icon-only, B = icon + micro-label, C = icon + badge
type CellDisplayType = "A" | "B" | "C";

// Define cell configuration type
interface CellConfig {
  id: number;
  href?: string;
  icon: string; // Emoji or path to custom icon
  iconAlt: string; // Accessibility description
  title: string; // Full title shown in preview
  description: string; // Full description for preview modal
  displayType: CellDisplayType; // A, B, or C
  microLabel?: string; // For Option B: tiny text below icon
  badge?: string; // For Option C: badge text (e.g., "FREE", "FACTS", "NEW")
  badgeColor?: string; // Badge color class
  isHighlighted?: boolean;
}

export default function Home(): JSX.Element {
  const [previewCell, setPreviewCell] = useState<CellConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Create configuration for the 15 cells with mixed display types
  const cells: CellConfig[] = Array.from({ length: 15 }, (_, i) => {
    const id = i + 1;

    // Default config
    let config: CellConfig = {
      id,
      icon: "",
      iconAlt: "",
      title: "",
      description: "",
      displayType: "A",
    };

    // Configure specific cells
    switch (id) {
      // Row 1: Top of Pyramid (1 item)
      // Option C: Icon + Badge
      case 3:
        config = {
          id,
          href: "/trivia-arena",
          icon: "🎯", // Target icon - replace with custom hockey trivia icon
          iconAlt: "Trivia Arena",
          title: "Trivia Arena",
          description:
            "Play hockey trivia games and challenge yourself with multiple choice and true/false questions. Test your knowledge and compete with friends!",
          displayType: "C",
          badge: "FREE",
          badgeColor: "bg-green-500",
          isHighlighted: true,
        };
        break;

      // Row 2: Middle of Pyramid (2 items)
      // Option B: Icon + Micro-label
      case 7:
        config = {
          id,
          href: "/game-day",
          icon: "💬", // Message icon - replace with custom hockey message icon
          iconAlt: "Shareable Motivators",
          title: "Shareable Motivators",
          description:
            "Find motivational messages ready to text - pre-game boost, post-game celebration, or encouragement during tough times. Perfect for game day!",
          displayType: "B",
          microLabel: "Messages",
          isHighlighted: true,
        };
        break;
      // Option A: Icon-only
      case 9:
        config = {
          id,
          href: "/game-plan-strategy",
          icon: "📋", // Clipboard icon - replace with custom coach clipboard icon
          iconAlt: "Game Plan",
          title: "Game Plan",
          description:
            "Learn from legendary coaches and iconic players - strategic insights and hockey wisdom. Master the game with proven strategies.",
          displayType: "A",
          isHighlighted: true,
        };
        break;

      // Row 3: Bottom of Pyramid (3 items)
      // Option C: Icon + Badge
      case 11:
        config = {
          id,
          href: "/did-you-know",
          icon: "💡", // Lightbulb icon - replace with custom fact icon
          iconAlt: "Did You Know",
          title: "Did You Know?",
          description:
            "Discover interesting facts and curiosities from hockey&apos;s past and present. Expand your hockey knowledge with fascinating trivia!",
          displayType: "C",
          badge: "FACTS",
          badgeColor: "bg-blue-500",
          isHighlighted: true,
        };
        break;
      // Option B: Icon + Micro-label
      case 13:
        config = {
          id,
          href: "/shop",
          icon: "🛍️", // Shopping bag icon - replace with custom hockey gear icon
          iconAlt: "Shop",
          title: "Shop",
          description:
            "Browse our collection of hockey merchandise and gear. Show your love for the game with official OnlyHockey products!",
          displayType: "B",
          microLabel: "Store",
          isHighlighted: true,
        };
        break;
      // Option A: Icon-only
      case 15:
        config = {
          id,
          href: "/locker-room",
          icon: "👥", // People icon - replace with custom locker room icon
          iconAlt: "Locker Room",
          title: "Locker Room",
          description:
            "Connect with the OnlyHockey community - share stories, achievements, and connect with fellow fans. Join the conversation!",
          displayType: "A",
          isHighlighted: true,
        };
        break;

      default:
        // Standard numbered cells
        config = {
          id,
          icon: "",
          iconAlt: "",
          title: "",
          description: "",
          displayType: "A",
        };
    }

    return config;
  });

  const handleCellClick = (cell: CellConfig, e: React.MouseEvent): void => {
    if (!cell.isHighlighted || !cell.href) return;

    // Check if this is the second click (preview already shown)
    if (showPreview && previewCell?.id === cell.id) {
      // Navigate to the page
      window.location.href = cell.href;
      return;
    }

    // First click: show preview
    e.preventDefault();
    setPreviewCell(cell);
    setShowPreview(true);
  };

  const handleClosePreview = (): void => {
    setShowPreview(false);
    setPreviewCell(null);
  };

  const handleNavigate = (href: string): void => {
    window.location.href = href;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      {/* Centered Content Container */}
      <div className="flex flex-col items-center gap-8">
        {/* OnlyHockey Branding - Above the grid */}
        <div className="flex flex-col items-center gap-4 max-w-4xl px-4">
          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white text-center leading-tight">
            There Is
            <br />
            Only Hockey!
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-sm text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-wider text-center">
            L❤️VE FOR THE GAME IS ALL YOU NEED
          </p>

          {/* Description */}
          <p className="text-base md:text-md text-gray-700 dark:text-gray-300 leading-relaxed text-center">
            We launched OnlyHockey as a tribute to the great Game of Hockey.
            Here, you can immerse yourself in the curiosities of hockey culture
            and interesting facts from the sport&apos;s past and present.
            Challenge yourself and your friends to engaging hockey trivia and
            get a motivational boost from legendary coaches and iconic players.
            We hope you will discover what makes our hockey community so
            special. 🏠✨
          </p>
        </div>

        {/* 5x4 Grid Structure - Centered */}
        <div className="grid grid-cols-5 gap-0 border border-gray-300 dark:border-gray-700">
          {cells.map((cell) => (
            <div
              key={cell.id}
              className={`relative w-32 h-32 border border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden ${
                cell.isHighlighted
                  ? "bg-navy-900 dark:bg-orange-500 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                  : "bg-white dark:bg-gray-800"
              }`}
              onClick={(e) => handleCellClick(cell, e)}
            >
              {cell.isHighlighted ? (
                <div
                  className="w-full h-full flex flex-col items-center justify-center px-2 relative"
                  aria-label={cell.description || `Preview ${cell.title}`}
                >
                  {/* Option A: Icon-only */}
                  {cell.displayType === "A" && (
                    <div className="flex flex-col items-center justify-center z-10">
                      <span
                        className="text-5xl md:text-6xl"
                        role="img"
                        aria-label={cell.iconAlt}
                      >
                        {cell.icon}
                      </span>
                    </div>
                  )}

                  {/* Option B: Icon + Micro-label */}
                  {cell.displayType === "B" && (
                    <div className="flex flex-col items-center justify-center z-10 gap-1">
                      <span
                        className="text-5xl md:text-6xl"
                        role="img"
                        aria-label={cell.iconAlt}
                      >
                        {cell.icon}
                      </span>
                      {cell.microLabel && (
                        <span className="text-[9px] md:text-[10px] text-white/90 dark:text-white/90 font-medium text-center leading-tight uppercase tracking-wide">
                          {cell.microLabel}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Option C: Icon + Badge */}
                  {cell.displayType === "C" && (
                    <div className="flex flex-col items-center justify-center z-10 relative">
                      <span
                        className="text-5xl md:text-6xl"
                        role="img"
                        aria-label={cell.iconAlt}
                      >
                        {cell.icon}
                      </span>
                      {cell.badge && (
                        <span
                          className={`absolute -top-1 -right-1 ${cell.badgeColor || "bg-blue-500"} text-white text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md uppercase tracking-tight`}
                        >
                          {cell.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tap indicator for mobile */}
                  {showPreview && previewCell?.id === cell.id && (
                    <div className="absolute inset-0 bg-white/20 dark:bg-black/20 z-5 animate-pulse"></div>
                  )}
                </div>
              ) : (
                // Non-highlighted cells just show number
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {cell.id}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Preview Modal - Mobile-first full screen */}
        {showPreview && previewCell && (
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={handleClosePreview}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <span
                    className="text-5xl"
                    role="img"
                    aria-label={previewCell.iconAlt}
                  >
                    {previewCell.icon}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {previewCell.title}
                    </h2>
                    {previewCell.badge && (
                      <span
                        className={`inline-block mt-1 ${previewCell.badgeColor || "bg-blue-500"} text-white text-xs font-bold px-2 py-1 rounded-full uppercase`}
                      >
                        {previewCell.badge}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleClosePreview}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2"
                  aria-label="Close preview"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {previewCell.description}
                </p>
              </div>

              {/* Modal Footer - Navigation Button */}
              {previewCell.href && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleNavigate(previewCell.href!)}
                    className="w-full px-6 py-4 bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    <span>Explore {previewCell.title}</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                    Tap again to explore, or close to browse more
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call to Action - Sign Up */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">
            Sign up to PLAY
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 text-center">
            Join the OnlyHockey community and start playing today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500"
            />
            <button className="px-6 py-3 rounded-lg bg-blue-600 dark:bg-orange-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-orange-600 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
