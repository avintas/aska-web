"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { MotivatorsCarousel } from "@/components/MotivatorsCarousel";
import { HubCell } from "@/components/HubGrid";

interface MotivatorItem {
  id: number;
  quote: string;
  set_id: number;
  set_title: string;
  set_attribution: string | null;
  set_category: string | null;
  set_theme: string | null;
}

// Category to image mapping - MCIP for categories with dedicated images, HCIP for others
const CATEGORY_MCIP_MAP: Record<string, number> = {
  "bounce back": 1,
  celebration: 2,
  discipline: 3,
  focus: 4,
  glory: 5,
  "good luck": 6,
  leadership: 7,
  team: 8,
};

const CATEGORY_HCIP_MAP: Record<string, number> = {
  grit: 2,
  "hard work": 3,
  "i'm proud": 4,
  mindset: 5,
  perseverance: 6,
  resilience: 7,
  teamwork: 8,
  "the code": 9,
  "the flow": 10,
  "the grind": 11,
  "the room": 12,
};

// Default image for unknown categories
const DEFAULT_HCIP_IMAGE = 21;

// Get image path based on category
function getCategoryImage(category: string | null): string {
  if (!category) {
    return `/hcip-${DEFAULT_HCIP_IMAGE}.png`;
  }
  const normalizedCategory = category.toLowerCase().trim();

  // Check MCIP first (categories with dedicated labeled images)
  if (normalizedCategory in CATEGORY_MCIP_MAP) {
    return `/mcip-${CATEGORY_MCIP_MAP[normalizedCategory]}.png`;
  }

  // Fall back to HCIP for remaining categories
  const hcipNumber =
    CATEGORY_HCIP_MAP[normalizedCategory] ?? DEFAULT_HCIP_IMAGE;
  return `/hcip-${hcipNumber}.png`;
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
            inactiveImage: getCategoryImage(item.set_category),
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-16 pb-14 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-14 md:mb-16">
          <div className="mb-4 md:mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-3 md:mb-4">
              Pass Around
            </h1>
            <div className="flex justify-center">
              <span className="text-5xl md:text-6xl lg:text-7xl">🏒</span>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg md:text-xl lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              Get motivated with daily inspiration from hockey legends. Browse
              curated motivational quotes and share your favorites.
            </p>
          </div>
        </div>

        {/* Round Navigation Buttons */}
        <div className="mb-10 md:mb-14">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Pass Around - Info"
            infoContent="Browse our collection of motivational quotes from Bench Boss, Captain Heart, and Rink Philosopher. Click any card to flip it and read the full quote. Share your favorites with friends and teammates!"
            extrasTitle="Pass Around - Extras"
            extrasContent="Additional features and options for the Pass Around page coming soon..."
          />
        </div>

        {/* Motivators Carousel */}
        {!loading && !error && items.length > 0 && (
          <div className="mb-10 md:mb-14">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-5 md:mb-7 text-center">
              Motivational Quotes
            </h2>
            <MotivatorsCarousel cells={generateCarouselSlides()} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-3.5 text-gray-600 dark:text-gray-400">
              Loading quotes...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-5 text-center">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
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
                Pass Around
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
