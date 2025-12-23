"use client";

import { useState, useEffect } from "react";
import { getEmojiForFact } from "@/utils/factEmojis";

interface FactItem {
  id: number;
  fact_text: string;
  fact_category?: string | null;
  year?: number | null;
  fact_value?: string | null;
  [key: string]: unknown;
}

export default function DidYouKnowPage(): JSX.Element {
  const [items, setItems] = useState<FactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<FactItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [gridFacts, setGridFacts] = useState<FactItem[]>([]);
  const [flippedCategoryCells, setFlippedCategoryCells] = useState<Set<number>>(
    new Set(),
  );

  const fetchDailySet = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/did-you-know");
      const result = await response.json();

      if (result.success && result.data) {
        const facts = result.data as FactItem[];
        if (result.type === "daily") {
          setItems(facts);
        } else {
          setItems(facts || []);
        }

        // Prepare facts for grid (144 cells) - cycle through available facts
        if (facts && facts.length > 0) {
          const gridFactsArray: FactItem[] = [];
          for (let i = 0; i < 144; i++) {
            gridFactsArray.push(facts[i % facts.length]);
          }
          setGridFacts(gridFactsArray);
        } else {
          setGridFacts([]);
        }
        setImageErrors(new Set()); // Reset image errors when loading new set
        setFlippedCategoryCells(new Set()); // Reset flipped category grid cells
      } else {
        setError(result.error || "Failed to load Daily Set");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailySet();
  }, []);

  const handleCategoryGridCellClick = (index: number): void => {
    // Flip the card
    setFlippedCategoryCells((prev) => new Set(prev).add(index));

    // Open modal with the fact if available
    // Use the first 30 facts from gridFacts for the category grid
    if (gridFacts.length > 0) {
      const factIndex = index % gridFacts.length;
      setSelectedItem(gridFacts[factIndex]);
      setIsModalOpen(true);
    } else if (items.length > 0) {
      // Fallback: use items array if gridFacts not populated yet
      const factIndex = index % items.length;
      setSelectedItem(items[factIndex]);
      setIsModalOpen(true);
    }
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

  const getEmoji = (item: FactItem): string => {
    // Convert null to undefined for compatibility with getEmojiForFact
    const factItem = {
      ...item,
      fact_category: item.fact_category ?? undefined,
    };
    return getEmojiForFact(factItem);
  };

  const getPlayerImagePath = (index: number): string => {
    // Cycle through player_1.png through player_12.png
    const playerNumber = (index % 12) + 1;
    return `/player_${playerNumber}.png`;
  };

  const handleImageError = (index: number): void => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-6 md:pb-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <span className="text-2xl md:text-3xl lg:text-4xl">💡</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
              Did You Know?
            </h1>
          </div>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4 md:px-0">
            Discover fascinating hockey facts, records, and stories that
            showcase the rich history and culture of the greatest game on ice.
          </p>
        </div>

        {/* 5x6 Puzzle Grid */}
        {!loading && !error && (
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 max-w-full">
              {Array.from({ length: 30 }, (_, index) => {
                // Cycle through player_1.png through player_12.png
                const playerNumber = (index % 12) + 1;
                const imagePath = `/player_${playerNumber}.png`;
                const isFlipped = flippedCategoryCells.has(index);
                // Use the first 30 facts from gridFacts, cycling if needed
                const fact =
                  gridFacts.length > 0
                    ? gridFacts[index % gridFacts.length]
                    : null;
                const emoji = fact ? getEmoji(fact) : "💡";

                return (
                  <button
                    key={`category-grid-${index}`}
                    onClick={() => handleCategoryGridCellClick(index)}
                    className={`flip-card w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ${isFlipped ? "flipped" : ""} cursor-pointer touch-manipulation`}
                    aria-label={`Reveal fact ${index + 1}`}
                  >
                    <div className="flip-card-inner h-full w-full">
                      {/* Front side - Player image */}
                      <div className="flip-card-front h-full w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                        <img
                          src={imagePath}
                          alt={`Player ${playerNumber}`}
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy"
                        />
                      </div>

                      {/* Back side - Fact preview */}
                      <div className="flip-card-back h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 flex items-center justify-center p-2">
                        <div className="text-center">
                          <div className="text-xl md:text-2xl mb-1">
                            {emoji}
                          </div>
                          <div className="text-white text-[8px] md:text-[9px] font-semibold uppercase tracking-tight line-clamp-2">
                            {fact?.fact_text.substring(0, 30)}...
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading facts...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6 text-center">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-[90vw] md:max-w-md lg:max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative flex items-start justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-2 md:gap-3 flex-1">
                {/* Avatar - Smaller size */}
                {(() => {
                  const itemIndex = items.findIndex(
                    (i) => i.id === selectedItem.id,
                  );
                  const modalIndex = itemIndex >= 0 ? itemIndex : 0;
                  const showEmojiFallback = imageErrors.has(modalIndex);
                  const playerImagePath = getPlayerImagePath(modalIndex);

                  return (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                      {showEmojiFallback ? (
                        <div className="w-full h-full flex items-center justify-center text-2xl md:text-3xl">
                          {getEmoji(selectedItem)}
                        </div>
                      ) : (
                        <img
                          src={playerImagePath}
                          alt="Player"
                          className="w-full h-full object-contain"
                          onError={() => handleImageError(modalIndex)}
                        />
                      )}
                    </div>
                  );
                })()}

                {/* Practice Trivia Text */}
                <div className="flex-1 pt-1 md:pt-2">
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 italic">
                    Practice trivia question for upcoming Trivia battles
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors shadow-md flex-shrink-0"
                aria-label="Close modal"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
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
            <div className="p-4 md:p-5">
              {/* Fact Text */}
              <div className="mb-4 md:mb-5">
                <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 leading-relaxed italic">
                  &ldquo;{selectedItem.fact_text}&rdquo;
                </p>
              </div>

              {/* Year Badge */}
              {selectedItem.year && (
                <div className="mb-4 md:mb-5">
                  <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs md:text-sm font-semibold px-3 py-1.5 rounded">
                    {selectedItem.year}
                  </span>
                </div>
              )}

              {/* Share Button */}
              <div className="flex justify-center mt-6 md:mt-7">
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
