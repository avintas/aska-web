"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { DidYouKnowCarousel } from "@/components/DidYouKnowCarousel";
import { HubCell } from "@/components/HubGrid";

interface FactItem {
  id?: number;
  fact_text: string;
  fact_category?: string | null;
  category?: string | null;
  theme?: string | null;
  year?: number | null;
  fact_value?: string | null;
  [key: string]: unknown;
}

interface SetInfo {
  id: number;
  title: string;
  summary: string | null;
  theme: string | null;
  category: string | null;
}

// Pre-indexed cell layout: 70 factoid cells across 5 slides
// Each slide has 15 cells total: 14 factoid cells + 1 center cell
// Center cell is always at index 7 in each slide
interface CellIndex {
  slideIndex: number;
  cellIndex: number;
  factoidIndex: number | null; // null for center cells
}

// Generate cell index map: maps each of 70 factoid positions to slide/cell indices
function generateCellIndexMap(): CellIndex[] {
  const cells: CellIndex[] = [];
  const totalSlides = 5;
  let factoidCounter = 0;

  for (let slideIndex = 0; slideIndex < totalSlides; slideIndex++) {
    for (let cellIndex = 0; cellIndex < 15; cellIndex++) {
      if (cellIndex === 7) {
        // Center cell - no factoid
        cells.push({
          slideIndex,
          cellIndex,
          factoidIndex: null,
        });
      } else {
        // Factoid cell - assign factoid index
        cells.push({
          slideIndex,
          cellIndex,
          factoidIndex: factoidCounter++,
        });
      }
    }
  }

  return cells;
}

const CELL_INDEX_MAP = generateCellIndexMap(); // Pre-computed at module load

export default function DidYouKnowPage(): JSX.Element {
  const [items, setItems] = useState<FactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<FactItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [setInfo, setSetInfo] = useState<SetInfo | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set()); // Track flipped cards

  const fetchFactoidSet = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/did-you-know");
      const result = await response.json();

      if (result.success && result.data) {
        const factoids = result.data as FactItem[];
        setItems(factoids || []);

        if (result.setInfo) {
          setSetInfo(result.setInfo as SetInfo);
        }

        // Reset flipped cards state
        setFlippedCards(new Set());
      } else {
        setError(result.error || "Failed to load factoid set");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactoidSet();
  }, []);

  // Get thumbnail path based on theme from /public/factoids/ folder
  // Falls back to category mapping if theme is not available
  const getThumbnailPath = (
    theme: string | null | undefined,
    category: string | null | undefined,
    index: number,
  ): string => {
    // Map category to theme (for cases where factoids have category but no theme)
    const categoryToThemeMap: Record<string, string> = {
      historical: "the-legacy",
      milestone: "game-day",
      record: "the-players",
      comparison: "the-players",
      "on-this-day": "game-day",
      franchise: "the-legacy",
      quirky: "the-players",
      geography: "geography-of-hockey",
      "behind-the-scenes": "the-business",
      cultural: "the-legacy",
    };

    // Determine which value to use: theme first, then mapped category, then category as-is
    let valueToUse: string | null = null;

    if (theme) {
      valueToUse = theme;
    } else if (category) {
      // Try to map category to theme
      const categorySlug = category
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      valueToUse = categoryToThemeMap[categorySlug] || category;
    }

    if (!valueToUse) {
      // Default thumbnail if no theme or category
      return `/factoids/the-players-${(index % 14) + 1}.png`;
    }

    // Convert to kebab-case for file naming
    const themeSlug = valueToUse
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Map theme to available thumbnails (based on actual files in /public/factoids/)
    const themeMap: Record<string, number> = {
      "the-players": 14,
      "the-wall": 3,
      "the-system": 2,
      "the-business": 2,
      "the-lab": 1,
      "the-league": 2,
      "the-legacy": 1,
      "game-day": 2,
      "geography-of-hockey": 1,
    };

    // Check if theme exists in map
    if (!themeMap[themeSlug]) {
      // Unknown theme - use default
      return `/factoids/the-players-${(index % 14) + 1}.png`;
    }

    const maxCount = themeMap[themeSlug];
    const thumbnailNumber = (index % maxCount) + 1;

    return `/factoids/${themeSlug}-${thumbnailNumber}.png`;
  };

  // Handle card click - flip card and open modal
  const handleCardClick = (cardId: string, fact: FactItem): void => {
    // Toggle flip state
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });

    // Open modal with factoid
    setSelectedItem(fact);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleShare = (): void => {
    if (!selectedItem) return;

    const shareText = selectedItem.fact_text;

    if (navigator.share) {
      navigator
        .share({
          title: "Hockey Fact",
          text: shareText,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          alert("Fact copied to clipboard!");
        })
        .catch((err) => {
          console.error("Error copying to clipboard:", err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-8 pb-14 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hardware Buttons - Above the Screen */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Did You Know? - Info"
            infoContent="Discover fascinating hockey facts! Tap cards to flip and reveal interesting stories about the rich history and culture of the greatest game on ice. Explore 70 factoids across 5 scrollable boards, each featuring unique thumbnails and shareable content. Perfect for expanding your hockey knowledge!"
            extrasTitle="Did You Know? - Extras"
            extrasContent="Additional features and options for the Did You Know page coming soon..."
          />
        </div>

        {/* Game Boy Device Container - Screen + Buttons aligned */}
        <div className="flex flex-col items-center">
          {/* Game Boy Screen - Title Display Only */}
          <div className="w-[19.5rem] sm:w-[22.5rem] md:w-[42.5rem] rounded-lg bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 p-3 md:p-4 shadow-inner mb-6 md:mb-8">
            {/* Screen Inner Bezel */}
            <div className="border-2 border-gray-600 dark:border-gray-500 rounded bg-gradient-to-b from-green-200/80 to-green-100/80 dark:from-green-900/30 dark:to-green-800/20 p-4 md:p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl md:text-3xl">💡</span>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                    Did You Know?
                  </h1>
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-light">
                  Discover fascinating hockey facts
                </p>
              </div>
            </div>
          </div>

          {/* Factoid Cards Grid Section */}
          {!loading &&
            !error &&
            items.length > 0 &&
            ((): JSX.Element => {
              // Create 5 slides, each with 15 cells (3 rows × 5 columns)
              // 14 factoid cells per slide + 1 center cell = 15 cells per slide
              // Total: 5 slides × 14 factoid cells = 70 unique factoids needed
              const cellsPerSlide = 15;
              const totalSlides = 5;

              return (
                <div className="mb-10 md:mb-14">
                  {setInfo && (
                    <div className="mb-5 md:mb-7 text-center">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {setInfo.title}
                      </h2>
                      {setInfo.summary && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {setInfo.summary}
                        </p>
                      )}
                    </div>
                  )}
                  <DidYouKnowCarousel
                    cells={Array.from(
                      { length: totalSlides },
                      (_, slideIndex) => {
                        return Array.from(
                          { length: cellsPerSlide },
                          (_, cellIndex): HubCell | null => {
                            // Use pre-indexed cell map to find factoid assignment
                            const cellMapEntry = CELL_INDEX_MAP.find(
                              (entry) =>
                                entry.slideIndex === slideIndex &&
                                entry.cellIndex === cellIndex,
                            );

                            if (!cellMapEntry) {
                              return null;
                            }

                            // Center cell (factoidIndex is null)
                            if (cellMapEntry.factoidIndex === null) {
                              const centerImageIndex = slideIndex % 14; // Cycle through the-players images
                              const centerThumbnailPath = `/factoids/the-players-${centerImageIndex + 1}.png`;

                              return {
                                id: `center-${slideIndex}`,
                                name: "",
                                emoji: "",
                                inactiveImage: centerThumbnailPath,
                                description: "",
                                isFlipped: false,
                                // No onClick - makes it unclickable
                              };
                            }

                            // Factoid cell - get factoid by pre-indexed position
                            const fact = items[cellMapEntry.factoidIndex];

                            if (!fact) return null;

                            if (!fact) {
                              return null;
                            }

                            const cardId = `cell-${slideIndex}-${cellIndex}`;
                            const isFlipped = flippedCards.has(cardId);

                            // Get thumbnail based on theme (prefer theme field, fallback to category)
                            const theme = fact.theme || setInfo?.theme || null;
                            const category =
                              fact.category ||
                              fact.fact_category ||
                              setInfo?.category ||
                              null;
                            // Use theme if available, otherwise try to map category to theme
                            const thumbnailPath = getThumbnailPath(
                              theme,
                              category,
                              cellMapEntry.factoidIndex,
                            );

                            return {
                              id: cardId,
                              name: "",
                              emoji: "",
                              inactiveImage: thumbnailPath,
                              description: fact.fact_text.substring(0, 100),
                              isFlipped: isFlipped,
                              onClick: (e?: React.MouseEvent): void => {
                                if (e) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                                handleCardClick(cardId, fact);
                              },
                            };
                          },
                        );
                      },
                    )}
                  />
                </div>
              );
            })()}

          {/* Debug Container - Display loaded items */}
          {!loading && !error && items.length > 0 && (
            <div className="mt-8 mb-10 md:mb-14 w-full max-w-4xl mx-auto">
              <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 md:p-6">
                <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-3">
                  Debug: Loaded Items ({items.length} factoids)
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {items.map((item, index) => (
                    <div
                      key={`factoid-${index}`}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-2 md:p-3 text-xs md:text-sm"
                    >
                      <div className="flex flex-wrap gap-2 mb-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          #{index + 1}
                        </span>
                        {item.id && (
                          <span className="text-gray-600 dark:text-gray-400">
                            ID: {item.id}
                          </span>
                        )}
                        {item.theme && (
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                            Theme: {item.theme}
                          </span>
                        )}
                        {(item.category || item.fact_category) && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                            Category: {item.category || item.fact_category}
                          </span>
                        )}
                        {item.year && (
                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                            Year: {item.year}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 mt-1 line-clamp-2">
                        {String(
                          item.fact_text ||
                            (item.content as string | undefined) ||
                            "No text",
                        )}
                      </p>
                    </div>
                  ))}
                </div>
                {setInfo && (
                  <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      <strong>Set Info:</strong> {setInfo.title}
                      {setInfo.theme && ` | Theme: ${setInfo.theme}`}
                      {setInfo.category && ` | Category: ${setInfo.category}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading State - Spinner below screen */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Loading facts...
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

      {/* Modal Dialog */}
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
                Did You Know?
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
              {/* Fact Text */}
              <div className="mb-4">
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedItem.fact_text}
                </p>
              </div>

              {/* Year Badge */}
              {selectedItem.year && (
                <div className="mb-4">
                  <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs md:text-sm font-semibold px-3 py-1.5 rounded">
                    {selectedItem.year}
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
