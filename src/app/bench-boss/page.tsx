"use client";

import { useState, useEffect } from "react";

interface MotivationalItem {
  id: number;
  quote: string;
  emoji?: string;
  author?: string;
  context?: string;
  theme?: string;
}

interface CollectionItem {
  id: number;
  quote: string;
  theme: string | null;
  category: string | null;
  attribution: string | null;
}

const CATEGORIES = [
  "Bounce Back",
  "Discipline",
  "Focus",
  "Grit",
  "Hard Work",
  "Leadership",
  "Pain",
  "Team",
  "Teamwork",
];

export default function BenchBossPage(): JSX.Element {
  const [items, setItems] = useState<(MotivationalItem | CollectionItem)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string>("Daily Selection");
  const [selectedItem, setSelectedItem] = useState<
    MotivationalItem | CollectionItem | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDailySet = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bench-boss");
      const result = await response.json();

      if (result.success && result.data) {
        if (result.type === "daily") {
          // New structure: data is directly an array of CollectionItem
          const items = Array.isArray(result.data) ? result.data : [];
          setItems(items.slice(0, 12));
          setCurrentLabel("Daily Selection");
        } else {
          setItems(result.data || []);
        }
      } else {
        setError(result.error || "Failed to load Daily Selection");
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
        `/api/bench-boss?category=${encodeURIComponent(category)}`,
      );
      const result = await response.json();

      if (result.success && result.data) {
        setItems((result.data as CollectionItem[]).slice(0, 12));
        setCurrentLabel(category);
      } else {
        setError(result.error || `Failed to load ${category}`);
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

  const handleDailySetClick = (): void => {
    fetchDailySet();
  };

  const handleIconClick = (item: MotivationalItem | CollectionItem): void => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleShare = (): void => {
    if (!selectedItem) return;

    const shareText = `${selectedItem.quote}${"author" in selectedItem && selectedItem.author ? ` - ${selectedItem.author}` : ""}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Shareable Motivator",
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
          alert("Motivator copied to clipboard!");
        })
        .catch((err) => {
          console.error("Error copying to clipboard:", err);
        });
    }
  };

  const getEmoji = (item: MotivationalItem | CollectionItem): string => {
    if ("emoji" in item && item.emoji) {
      return item.emoji;
    }
    // Default emoji if not provided
    return "💪";
  };

  const getQuote = (item: MotivationalItem | CollectionItem): string => {
    return item.quote;
  };

  const getAuthor = (
    item: MotivationalItem | CollectionItem,
  ): string | null => {
    if ("author" in item) {
      return item.author || null;
    }
    return null;
  };

  const getContext = (
    item: MotivationalItem | CollectionItem,
  ): string | null => {
    if ("context" in item) {
      return item.context || null;
    }
    if ("category" in item && item.category) {
      return item.category;
    }
    if ("theme" in item && item.theme) {
      return item.theme;
    }
    return null;
  };

  const getBadgeText = (item: MotivationalItem | CollectionItem): string => {
    // For Daily Selection items (MotivationalItem), use theme
    if ("theme" in item && item.theme) {
      return item.theme;
    }
    // For Collection items, use category
    if ("category" in item && item.category) {
      return item.category;
    }
    // Fallback to context if available
    if ("context" in item && item.context) {
      return item.context;
    }
    return "Bench Boss";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 md:pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
            <span className="text-3xl md:text-4xl">💪</span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              Bench Boss
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4 md:px-0 mb-4 md:mb-5">
            The voice from the bench that pushes you harder, believes in you
            deeper, and never lets you quit. Whether you&apos;re building
            character through discipline or celebrating the grind, these
            messages capture the essence of coaching leadership. Find the words
            that drive excellence and share the 💪 strength.
          </p>
        </div>

        {/* Set Label */}
        {!loading && !error && (
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
              <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                {currentLabel}
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-400">
              Loading...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8 text-center">
            <p className="text-sm md:text-base text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* Responsive Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
        {!loading && !error && items.length > 0 && (
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
              {items.map((item, index) => {
                const emoji = getEmoji(item);
                const badgeText = getBadgeText(item);
                return (
                  <div
                    key={item.id || index}
                    onClick={() => handleIconClick(item)}
                    className="relative w-[120px] h-[120px] md:w-[140px] md:h-[140px] lg:w-[150px] lg:h-[150px] bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-3xl md:text-4xl lg:text-5xl hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md transition-all cursor-pointer touch-manipulation"
                    aria-label={`View motivator ${index + 1}`}
                  >
                    {emoji}
                    {/* Badge Overlay */}
                    <span className="absolute top-1 right-1 bg-orange-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md uppercase tracking-tight">
                      {badgeText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              No items available at this time.
            </p>
          </div>
        )}

        {/* Category Label Cloud */}
        {!loading && !error && (
          <div className="mt-10 md:mt-16 mb-8">
            <div className="text-center">
              <h3 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 md:mb-5">
                Our collection of Shareable Motivators.
              </h3>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {/* Daily Selection Button */}
                <button
                  onClick={handleDailySetClick}
                  className="px-4 py-2 md:px-6 md:py-2 text-sm md:text-base rounded-full font-semibold transition-colors bg-green-500 dark:bg-green-500 text-white hover:bg-green-600 dark:hover:bg-green-600 touch-manipulation"
                >
                  Daily Selection
                </button>

                {/* Category Buttons */}
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 py-2 md:px-6 md:py-2 text-sm md:text-base rounded-full font-semibold transition-colors touch-manipulation ${
                      currentLabel === category
                        ? "bg-orange-500 dark:bg-orange-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {category}
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
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-2xl md:text-3xl">
                  {getEmoji(selectedItem)}
                </span>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  {getContext(selectedItem) ||
                    getBadgeText(selectedItem) ||
                    "Bench Boss"}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Close modal"
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

            <div className="p-6 md:p-8">
              {/* Quote */}
              <div className="mb-6 md:mb-8">
                <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 leading-relaxed italic">
                  &ldquo;{getQuote(selectedItem)}&rdquo;
                </p>
              </div>

              {/* Author */}
              {getAuthor(selectedItem) && (
                <div className="mb-5 md:mb-6">
                  <p className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">
                    &mdash; {getAuthor(selectedItem)}
                  </p>
                </div>
              )}

              {/* Context/Category Tag */}
              {getContext(selectedItem) && (
                <div className="mb-8">
                  <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs md:text-sm font-semibold px-3 py-1 rounded">
                    {getContext(selectedItem)}
                  </span>
                </div>
              )}

              {/* Share Button */}
              <div className="flex justify-center mt-8 md:mt-10">
                <button
                  onClick={handleShare}
                  className="px-6 py-3 md:px-8 md:py-3 text-sm md:text-base bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 touch-manipulation"
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
