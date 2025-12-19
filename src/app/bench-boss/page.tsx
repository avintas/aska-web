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

    const quoteText = selectedItem.quote;
    const authorText =
      "author" in selectedItem && selectedItem.author
        ? ` - ${selectedItem.author}`
        : "attribution" in selectedItem && selectedItem.attribution
          ? ` - ${selectedItem.attribution}`
          : "";
    const siteUrl = "https://onlyhockey.com/bench-boss";
    const subject = encodeURIComponent("Bench Boss - OnlyHockey.com");
    const body = encodeURIComponent(
      `${quoteText}${authorText}\n\nFrom OnlyHockey.com\n${siteUrl}`,
    );
    const shareText = `${quoteText}${authorText}\n\nFrom OnlyHockey.com\n${siteUrl}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Bench Boss - OnlyHockey.com",
          text: shareText,
          url: siteUrl,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
          window.location.href = `mailto:?subject=${subject}&body=${body}`;
        });
    } else {
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  const getEmoji = (item: MotivationalItem | CollectionItem): string => {
    if ("emoji" in item && item.emoji) {
      return item.emoji;
    }
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
    if ("theme" in item && item.theme) {
      return item.theme;
    }
    if ("category" in item && item.category) {
      return item.category;
    }
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
            messages capture the essence of coaching leadership. Get inspired
            and send the 💪 strength.
            <br />
            Enjoy our daily selection!
          </p>
        </div>

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

        {/* Daily Selections List - Bubble CTAs */}
        {!loading && !error && items.length > 0 && (
          <div className="max-w-3xl mx-auto mb-8 md:mb-12">
            <div className="flex flex-col gap-3 md:gap-4">
              {items.map((item, index) => {
                const emoji = getEmoji(item);
                const badgeText = getBadgeText(item);
                const quotePreview = getQuote(item);
                const previewText =
                  quotePreview.length > 60
                    ? quotePreview.substring(0, 60) + "..."
                    : quotePreview;

                return (
                  <button
                    key={item.id || index}
                    onClick={() => handleIconClick(item)}
                    className="group relative w-full px-4 md:px-6 py-3 md:py-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer transition-all duration-300 touch-manipulation text-left flex items-center gap-3 md:gap-4"
                    aria-label={`View ${badgeText} message`}
                  >
                    {/* Avatar - Using emoji as placeholder */}
                    <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl md:text-2xl">
                      {emoji}
                    </div>

                    {/* Quote Preview */}
                    <span className="flex-1 text-sm md:text-base text-gray-900 dark:text-white font-medium line-clamp-1">
                      {previewText}
                    </span>

                    {/* Badge - Subtle design */}
                    <span className="bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-[10px] md:text-[11px] font-normal px-2 md:px-2.5 py-0.5 md:py-1 rounded-full uppercase tracking-tight flex-shrink-0">
                      {badgeText}
                    </span>
                  </button>
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
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl md:text-3xl">
                  {getEmoji(selectedItem)}
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  Bench Boss about{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {getContext(selectedItem) ||
                      getBadgeText(selectedItem) ||
                      ""}
                  </span>
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

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              {/* Quote */}
              <div className="mb-6 md:mb-8">
                <p className="text-lg md:text-xl lg:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed italic">
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
