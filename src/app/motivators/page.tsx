"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { MotivatorsCarousel } from "@/components/MotivatorsCarousel";
import { HubCell } from "@/components/HubGrid";
import { getImage } from "@/config/image-mappings";

interface MotivatorItem {
  id: number;
  quote: string;
  set_id: number;
  set_title: string;
  set_attribution: string | null;
  set_category: string | null;
  set_theme: string | null;
}

// Fisher-Yates shuffle to randomize items
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MotivatorsPage(): JSX.Element {
  const [items, setItems] = useState<MotivatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MotivatorItem | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const fetchMotivators = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/motivators");
      const result = await response.json();

      if (result.success && result.data) {
        setItems(shuffleArray(result.data as MotivatorItem[]));
        setFlippedCards(new Set()); // Reset flipped cards
      } else {
        setError(result.error || "Failed to load motivators");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotivators();
  }, []);

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedItem(null);

    // Flip the card back after 500ms
    if (selectedCardId) {
      const cardIdToFlip = selectedCardId;
      setTimeout(() => {
        setFlippedCards((prev) => {
          const next = new Set(prev);
          next.delete(cardIdToFlip);
          return next;
        });
      }, 500);
    }
    setSelectedCardId(null);
  };

  const handleShare = (): void => {
    if (!selectedItem) return;

    const shareText = selectedItem.quote;
    const attributionText = selectedItem.set_attribution
      ? ` - ${selectedItem.set_attribution}`
      : "";

    if (navigator.share) {
      navigator
        .share({
          title: "Hockey Motivation",
          text: `${shareText}${attributionText}`,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(`${shareText}${attributionText}`)
        .then(() => {
          alert("Quote copied to clipboard!");
        })
        .catch((err) => {
          console.error("Error copying to clipboard:", err);
        });
    }
  };

  // Generate carousel slides: 15 cells per slide (3×5), reserved cell at index 7
  const generateCarouselSlides = (): (HubCell | null)[][] => {
    const slides: (HubCell | null)[][] = [];
    const itemsPerSlide = 14; // 15 cells - 1 reserved = 14 available

    for (let i = 0; i < items.length; i += itemsPerSlide) {
      const slideItems = items.slice(i, i + itemsPerSlide);
      const slideCells: (HubCell | null)[] = Array.from(
        { length: 15 },
        (_, cellIndex) => {
          // Reserved cell at index 7 (Row 2, Cell 3)
          if (cellIndex === 7) {
            return null; // Will be handled as reserved cell in MotivatorsGrid
          }

          // Calculate item index within this slide (skip index 7)
          const itemIndex = cellIndex < 7 ? cellIndex : cellIndex - 1;
          const item = slideItems[itemIndex];

          if (!item) {
            return null; // Empty cell
          }

          const cardId = `motivator-${i}-${cellIndex}`;
          const isFlipped = flippedCards.has(cardId);

          return {
            id: cardId,
            name: "",
            emoji: "",
            inactiveImage: getImage(
              "motivationalCategories",
              item.set_category,
            ),
            description: item.quote.substring(0, 80),
            isFlipped: isFlipped,
            onClick: (e?: React.MouseEvent): void => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }

              // Flip the card
              setFlippedCards((prev) => {
                const next = new Set(prev);
                if (next.has(cardId)) {
                  next.delete(cardId);
                } else {
                  next.add(cardId);
                }
                return next;
              });

              // Track which card was clicked and open modal after 500ms delay
              setSelectedCardId(cardId);
              setTimeout(() => {
                setSelectedItem(item);
                setIsModalOpen(true);
              }, 500);
            },
          };
        },
      );

      slides.push(slideCells);
    }

    // If no items, return at least one empty slide
    if (slides.length === 0) {
      const emptySlide: (HubCell | null)[] = Array.from(
        { length: 15 },
        (_, cellIndex) => (cellIndex === 7 ? null : null),
      );
      slides.push(emptySlide);
    }

    return slides;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-8 pb-14 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hardware Buttons - Above the Screen */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="The Locker Room - Info"
            infoContent="Browse our collection of motivational quotes from Bench Boss, Captain Heart, and Rink Philosopher. Click any card to flip it and read the full quote. Share your favorites with friends and teammates!"
            extrasTitle="The Locker Room - Extras"
            extrasContent="Additional features and options for The Locker Room page coming soon..."
          />
        </div>

        {/* Game Boy Device Container - Screen + Buttons aligned */}
        <div className="flex flex-col items-center">
          {/* Game Boy Screen - Title Display Only */}
          {/* Width matches grid: 3 cols mobile (19.5rem), 5 cols md (42.5rem) */}
          <div className="w-[19.5rem] sm:w-[22.5rem] md:w-[42.5rem] rounded-lg bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 p-3 md:p-4 shadow-inner mb-6 md:mb-8">
            {/* Screen Inner Bezel */}
            <div className="border-2 border-gray-600 dark:border-gray-500 rounded bg-gradient-to-b from-green-200/80 to-green-100/80 dark:from-green-900/30 dark:to-green-800/20 p-4 md:p-6">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                  The Locker Room
                </h1>
                <div className="flex justify-center mb-2">
                  <span className="text-3xl md:text-4xl">🏒</span>
                </div>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-light">
                  Daily inspiration from hockey legends
                </p>
              </div>
            </div>
          </div>

          {/* The Table of Motivational Elements - Grid Section (Dial Pad) */}
          {!loading && !error && items.length > 0 && (
            <div className="mb-8 md:mb-10">
              <div className="mb-5 md:mb-6 text-center">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">
                  The Table of Motivational Elements
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Daily inspiration from hockey life and culture. Tap to reveal
                  a quote, then share it with your friends and family.
                </p>
              </div>
              <MotivatorsCarousel cells={generateCarouselSlides()} />
            </div>
          )}

          {/* Loading State - Spinner below screen */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Loading quotes...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="w-[19.5rem] sm:w-[22.5rem] md:w-[42.5rem] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog - Game Boy Style */}
      {isModalOpen && selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300 border-4 border-gray-900 dark:border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-gray-900 dark:border-gray-100">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                The Locker Room
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2"
                aria-label="Close"
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
            <div className="p-4 md:p-6">
              {/* Quote Text */}
              <div className="mb-4">
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedItem.quote}
                </p>
              </div>

              {/* Attribution */}
              {selectedItem.set_attribution && (
                <div className="mb-4">
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-semibold italic">
                    — {selectedItem.set_attribution}
                  </p>
                </div>
              )}

              {/* Set Title (optional) */}
              {selectedItem.set_title && (
                <div className="mb-4">
                  <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs md:text-sm font-semibold px-3 py-1.5 rounded">
                    {selectedItem.set_title}
                  </span>
                </div>
              )}

              {/* Share Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleShare}
                  className="px-6 py-3 md:px-8 md:py-3 text-sm md:text-base bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 touch-manipulation"
                >
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
