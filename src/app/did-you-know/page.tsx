"use client";

import { useState, useEffect } from "react";
import { getEmojiForFact, formatCategoryLabel } from "@/utils/factEmojis";

interface FactItem {
  id: number;
  fact_text: string;
  fact_category?: string | null;
  year?: number | null;
  fact_value?: string | null;
  [key: string]: unknown;
}

// Themes from CollectionHockeyFacts table
const THEMES = [
  "acting",
  "anomaly",
  "attendance",
  "awards",
  "broadcasting",
  "business",
  "championship",
  "coaching",
  "comeback",
  "community",
  "comparison",
  "contracts",
  "controversy",
  "culture",
  "defense",
  "draft",
  "early career",
  "fanbase",
  "fighting",
  "filming",
  "franchise",
  "general",
  "goals",
  "goaltending",
  "historical",
  "history",
  "ice_quality",
  "impact",
  "international",
  "leadership",
  "management",
  "marketing",
  "music",
  "NHL",
  "obscure",
  "OHL",
  "performance",
  "planning",
  "playoffs",
  "popularity",
  "record",
  "rivalry",
  "safety",
  "scoring",
  "special-teams",
  "strategy",
  "success",
  "talent",
  "team",
  "team composition",
  "team success",
  "team_selection",
  "teamwork",
  "training",
];

// Additional Category Filters
const CATEGORY_FILTERS = [
  "anomaly",
  "award",
  "awards",
  "business",
  "coaching",
  "comparison",
  "defense",
  "franchise",
  "goaltending",
  "historical",
  "milestone",
  "obscure",
  "on-this-day",
  "record",
  "scoring",
];

export default function DidYouKnowPage(): JSX.Element {
  const [items, setItems] = useState<FactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string>("Daily Set");
  const [selectedItem, setSelectedItem] = useState<FactItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const fetchDailySet = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/did-you-know");
      const result = await response.json();

      if (result.success && result.data) {
        if (result.type === "daily") {
          setItems(result.data as FactItem[]);
          setCurrentLabel("Daily Set");
        } else {
          setItems(result.data || []);
        }
        setImageErrors(new Set()); // Reset image errors when loading new set
      } else {
        setError(result.error || "Failed to load Daily Set");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async (category: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/did-you-know?category=${encodeURIComponent(category)}`,
      );
      const result = await response.json();

      if (result.success && result.data) {
        setItems((result.data as FactItem[]).slice(0, 12));
        setCurrentLabel(category);
        setImageErrors(new Set()); // Reset image errors when loading new set
      } else {
        setError(result.error || `Failed to load ${category}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTheme = async (theme: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/did-you-know?theme=${encodeURIComponent(theme)}`,
      );
      const result = await response.json();

      if (result.success && result.data) {
        setItems((result.data as FactItem[]).slice(0, 12));
        setCurrentLabel(theme);
        setImageErrors(new Set()); // Reset image errors when loading new set
      } else {
        setError(result.error || `Failed to load ${theme}`);
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

  const handleCategoryClick = (category: string): void => {
    fetchCategory(category);
  };

  const handleThemeClick = (theme: string): void => {
    fetchTheme(theme);
  };

  const handleDailySetClick = (): void => {
    fetchDailySet();
  };

  const handleIconClick = (item: FactItem): void => {
    setSelectedItem(item);
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
            <span className="text-4xl md:text-5xl lg:text-6xl">💡</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
              Did You Know?
            </h1>
          </div>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4 md:px-0">
            Discover fascinating hockey facts, records, and stories that
            showcase the rich history and culture of the greatest game on ice.
            These facts will help you prepare for trivia games. Get inspired and
            share the 💡 knowledge.
            <br />
            Enjoy our daily selection!
          </p>
        </div>

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

        {/* Daily Selections List - Bubble CTAs */}
        {!loading && !error && items.length > 0 && (
          <div className="max-w-3xl mx-auto mb-8 md:mb-12">
            <div className="flex flex-col gap-3 md:gap-4">
              {items.map((item, index) => {
                const emoji = getEmoji(item);
                const showEmojiFallback = imageErrors.has(index);
                const playerImagePath = getPlayerImagePath(index);
                const factPreview =
                  item.fact_text.length > 60
                    ? item.fact_text.substring(0, 60) + "..."
                    : item.fact_text;
                const badgeText = item.fact_category
                  ? formatCategoryLabel(item.fact_category)
                  : "Fact";

                return (
                  <button
                    key={item.id || index}
                    onClick={() => handleIconClick(item)}
                    className="group relative w-full px-4 md:px-6 py-3 md:py-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer transition-all duration-300 touch-manipulation text-left flex items-center gap-3 md:gap-4"
                    aria-label={`View ${badgeText} fact`}
                  >
                    {/* Avatar - Player image or emoji fallback */}
                    <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {showEmojiFallback ? (
                        <div className="w-full h-full flex items-center justify-center text-xl md:text-2xl">
                          {emoji}
                        </div>
                      ) : (
                        <img
                          src={playerImagePath}
                          alt={`Player ${(index % 12) + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(index)}
                        />
                      )}
                    </div>

                    {/* Fact Preview */}
                    <span className="flex-1 text-sm md:text-base text-gray-900 dark:text-white font-medium line-clamp-1">
                      {factPreview}
                    </span>

                    {/* Badge - Subtle design */}
                    {item.fact_category && (
                      <span className="bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-[10px] md:text-[11px] font-normal px-2 md:px-2.5 py-0.5 md:py-1 rounded-full uppercase tracking-tight flex-shrink-0">
                        {badgeText}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No facts available at this time.
            </p>
          </div>
        )}

        {/* Category Filters Cloud */}
        {!loading && !error && (
          <div className="mt-8 md:mt-12 mb-6">
            <div className="text-center">
              <h3 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 md:mb-4">
                Category Filters
              </h3>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {/* Daily Set Button */}
                <button
                  onClick={handleDailySetClick}
                  className="px-4 py-2 md:px-6 md:py-2 text-sm md:text-base rounded-full font-semibold transition-colors bg-green-500 dark:bg-green-500 text-white hover:bg-green-600 dark:hover:bg-green-600 touch-manipulation"
                >
                  Daily Set
                </button>

                {/* Category Filter Buttons */}
                {CATEGORY_FILTERS.map((categoryFilter) => (
                  <button
                    key={categoryFilter}
                    onClick={() => handleCategoryClick(categoryFilter)}
                    className={`px-4 py-2 md:px-6 md:py-2 text-sm md:text-base rounded-full font-semibold transition-colors touch-manipulation ${
                      currentLabel === categoryFilter
                        ? "bg-orange-500 dark:bg-orange-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {categoryFilter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Theme Label Cloud */}
        {!loading && !error && (
          <div className="mt-8 md:mt-12 mb-6">
            <div className="text-center">
              <h3 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 md:mb-4">
                Themes
              </h3>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {/* Theme Buttons */}
                {THEMES.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleThemeClick(theme)}
                    className={`px-4 py-2 md:px-6 md:py-2 text-sm md:text-base rounded-full font-semibold transition-colors touch-manipulation ${
                      currentLabel === theme
                        ? "bg-orange-500 dark:bg-orange-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-[95vw] md:max-w-lg lg:max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative flex items-start justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3 md:gap-4 flex-1">
                {/* Avatar - Larger size to show pixel art, positioned top-left */}
                {(() => {
                  const itemIndex = items.findIndex(
                    (i) => i.id === selectedItem.id,
                  );
                  const modalIndex = itemIndex >= 0 ? itemIndex : 0;
                  const showEmojiFallback = imageErrors.has(modalIndex);
                  const playerImagePath = getPlayerImagePath(modalIndex);

                  return (
                    <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                      {showEmojiFallback ? (
                        <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl lg:text-6xl">
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
                <div className="flex-1 pt-2 md:pt-4">
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 italic">
                    Practice trivia question for upcoming Trivia battles
                  </p>
                </div>
              </div>

              {/* Close Button - More prominent */}
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors shadow-md flex-shrink-0"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
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
            <div className="p-6 md:p-8">
              {/* Fact Text */}
              <div className="mb-6 md:mb-8">
                <p className="text-lg md:text-xl lg:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed italic">
                  &ldquo;{selectedItem.fact_text}&rdquo;
                </p>
              </div>

              {/* Year Badge */}
              {selectedItem.year && (
                <div className="mb-5 md:mb-6">
                  <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold px-4 py-2 rounded">
                    {selectedItem.year}
                  </span>
                </div>
              )}

              {/* Share Button */}
              <div className="flex justify-center mt-8 md:mt-10">
                <button
                  onClick={handleShare}
                  className="px-8 py-4 md:px-10 md:py-4 text-base md:text-lg bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 touch-manipulation"
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
