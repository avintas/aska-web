"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { DidYouKnowCarousel } from "@/components/DidYouKnowCarousel";
import { HubCell } from "@/components/HubGrid";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gridFacts, setGridFacts] = useState<FactItem[]>([]);

  // Matching game state (prototype - matching logic included but not rigorously tested)
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set()); // Card IDs that are currently flipped
  const [matchedCards, setMatchedCards] = useState<Set<string>>(new Set()); // Card IDs that have been matched
  const [firstSelectedCard, setFirstSelectedCard] = useState<{
    cardId: string;
    fact: FactItem;
  } | null>(null); // First card clicked for matching
  const [isProcessing, setIsProcessing] = useState(false); // Prevent clicks during match check

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
        // Reset matching game state
        setFlippedCards(new Set());
        setMatchedCards(new Set());
        setFirstSelectedCard(null);
        setIsProcessing(false);
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

  // Generate pairs of facts for matching game (prototype - not rigorously tested)
  const generateFactPairs = (
    facts: FactItem[],
  ): Array<{ fact: FactItem; pairId: string }> => {
    // Group facts by category
    const categoryMap = new Map<string, FactItem[]>();
    facts.forEach((fact) => {
      const category = fact.fact_category || "Uncategorized";
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(fact);
    });

    // Create pairs (take 1 fact from each category, duplicate it for matching)
    const pairs: Array<{ fact: FactItem; pairId: string }> = [];
    categoryMap.forEach((categoryFacts, category) => {
      // For each category, take the first fact and create a pair
      if (categoryFacts.length > 0) {
        pairs.push({
          fact: categoryFacts[0],
          pairId: `pair-${category}`,
        });
      }
    });

    // Shuffle pairs and take exactly 10 pairs
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10); // Return exactly 10 pairs
  };

  // Handle card click for matching game (prototype - if it works, great; if not, that's fine)
  const handleCardClick = (cardId: string, fact: FactItem | null): void => {
    if (!fact) return;

    // Don't process if already matched, processing, or already flipped
    if (matchedCards.has(cardId) || isProcessing || flippedCards.has(cardId)) {
      return;
    }

    // If this is the first card selected
    if (firstSelectedCard === null) {
      setFirstSelectedCard({ cardId, fact });
      setFlippedCards((prev) => new Set(prev).add(cardId));
      return;
    }

    // Second card selected - check for match
    setIsProcessing(true);
    setFlippedCards((prev) => new Set(prev).add(cardId));

    // Check if they match (same category)
    const match = firstSelectedCard.fact.fact_category === fact.fact_category;

    setTimeout(() => {
      if (match) {
        // Match! Keep both cards open
        setMatchedCards((prev) =>
          new Set(prev).add(firstSelectedCard.cardId).add(cardId),
        );
      } else {
        // No match - flip both back
        setFlippedCards((prev) => {
          const next = new Set(prev);
          next.delete(firstSelectedCard.cardId);
          next.delete(cardId);
          return next;
        });
      }
      setFirstSelectedCard(null);
      setIsProcessing(false);
    }, 1500); // Wait 1.5 seconds before checking match
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
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-14 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 md:mb-16">
          <div className="flex items-center justify-center gap-1.5 md:gap-2.5 mb-3.5 md:mb-4">
            <span className="text-2xl md:text-3xl lg:text-4xl">💡</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
              Did You Know?
            </h1>
          </div>
          <p className="text-lg md:text-sm text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-wider text-center max-w-3xl mx-auto px-4 md:px-0 mb-2.5">
            &ldquo;Take pride in being prepared. Every practice, every game,
            give it everything you&apos;ve got.&rdquo;
          </p>
          <p className="text-sm md:text-xs text-gray-600 dark:text-gray-400 font-semibold text-center italic mb-7 md:mb-8">
            — Bench Boss
          </p>
        </div>

        {/* Round Navigation Buttons */}
        <div className="mb-10 md:mb-14">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Did You Know? - Info"
            infoContent="Test your memory with our Match the Facts puzzle game! Flip cards to reveal hockey facts and match pairs by category. Each match unlocks fascinating stories about the rich history and culture of the greatest game on ice. Challenge yourself to find all 10 pairs across 5 scrollable game boards. Perfect for practicing trivia knowledge while having fun!"
            extrasTitle="Did You Know? - Extras"
            extrasContent="Additional features and options for the Did You Know page coming soon..."
          />
        </div>

        {/* Hub Selector Carousel - Puzzle Game (Prototype) */}
        {!loading &&
          !error &&
          items.length > 0 &&
          ((): JSX.Element => {
            // Generate pairs for matching game - need 10 pairs (20 cards total)
            const factPairs = generateFactPairs(items);
            const pairsToUse = factPairs.slice(0, 10); // Exactly 10 pairs

            // Create array with pairs duplicated (each fact appears twice)
            const pairedFacts: FactItem[] = [];
            pairsToUse.forEach((pair) => {
              pairedFacts.push(pair.fact);
              pairedFacts.push(pair.fact); // Add same fact twice for matching
            });

            return (
              <div className="mb-10 md:mb-14">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-5 md:mb-7 text-center">
                  Match the Facts - Puzzle Game
                </h2>
                <DidYouKnowCarousel
                  cells={Array.from({ length: 5 }, (_, slideIndex) => {
                    // Create 5 slides, each with 20 cells (4 rows × 5 columns)
                    // Each slide gets a different set of facts
                    const factsPerSlide = Math.ceil(pairedFacts.length / 5);
                    const slideStartIndex = slideIndex * factsPerSlide;

                    return Array.from(
                      { length: 20 },
                      (_, cellIndex): HubCell | null => {
                        // Calculate global index across all slides
                        const globalIndex = slideIndex * 20 + cellIndex;

                        // Every cell is flippable - assign a fact to each cell
                        const factIndex = slideStartIndex + cellIndex;
                        const fact =
                          pairedFacts[factIndex % pairedFacts.length];

                        if (!fact) return null;

                        const cardId = `cell-${slideIndex}-${cellIndex}`;
                        const isFlipped = flippedCards.has(cardId);
                        const isMatched = matchedCards.has(cardId);

                        // Alternate between player images (now hcip-41 to hcip-52) and HCIP images for visual variety
                        const usePlayerImage = cellIndex % 2 === 0;
                        const imageNumber = usePlayerImage
                          ? (factIndex % 12) + 41 // Player images now hcip-41 through hcip-52
                          : (globalIndex % 40) + 1; // HCIP images 1-40

                        const imagePath = `/hcip-${imageNumber}.png`;

                        return {
                          id: cardId,
                          name: "", // No category name
                          emoji: "", // No emoji
                          inactiveImage: imagePath, // Use player or HCIP image
                          description: fact.fact_text.substring(0, 80), // Show fact text when flipped
                          isFlipped: isFlipped || isMatched, // Show fact text when flipped or matched
                          isMatched: isMatched,
                          onClick: (e?: React.MouseEvent): void => {
                            if (e) {
                              e.preventDefault();
                              e.stopPropagation();
                            }

                            // Open modal with the fact text
                            setSelectedItem(fact);
                            setIsModalOpen(true);

                            // Also handle card flip for matching game (if not matched and not processing)
                            if (!isMatched && !isProcessing) {
                              handleCardClick(cardId, fact);
                            }
                          },
                          // Add badge for matched cards
                          badge: isMatched ? "✓" : undefined,
                          badgeColor: isMatched ? "bg-green-500" : undefined,
                        };
                      },
                    );
                  })}
                />
              </div>
            );
          })()}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-3.5 text-gray-600 dark:text-gray-400">
              Loading facts...
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
