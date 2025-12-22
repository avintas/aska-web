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

interface ContentSet {
  id: number;
  app_id: number;
  set_title: string;
  set_summary: string | null;
  set_items: Array<{ id: number; quote: string }>;
  set_type: string[] | null;
  set_theme: string | null;
  set_category: string | null;
  set_difficulty: string | null;
  set_parent: number | null;
  set_created_at: string;
  set_updated_at: string;
  set_attribution: string | null;
}

export default function BenchBossPage(): JSX.Element {
  const [items, setItems] = useState<(MotivationalItem | CollectionItem)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<
    MotivationalItem | CollectionItem | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sets, setSets] = useState<ContentSet[]>([]);
  const [setsLoading, setSetsLoading] = useState(true);

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

  const fetchSets = async (): Promise<void> => {
    setSetsLoading(true);
    try {
      const response = await fetch("/api/bench-boss/sets");
      const result = await response.json();

      if (result.success && result.data) {
        const fetchedSets = result.data as ContentSet[];
        setSets(fetchedSets);

        // If no sets available, fallback to fetching categories from collection
        if (fetchedSets.length === 0) {
          // Fetch all categories from collection_hockey_culture
          const categoryResponse = await fetch("/api/bench-boss");
          const categoryResult = await categoryResponse.json();

          if (categoryResult.success && categoryResult.data) {
            const allItems = categoryResult.data as CollectionItem[];
            // Get unique categories
            const uniqueCategories = Array.from(
              new Set(allItems.map((item) => item.category).filter(Boolean)),
            );

            // Load first category by default if available
            if (uniqueCategories.length > 0) {
              await fetchCategory(uniqueCategories[0] as string);
            }
          }
        } else {
          // Load first set by default
          handleSetClick(fetchedSets[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load sets:", err);
      // Fallback: try to load from collection
      try {
        const categoryResponse = await fetch("/api/bench-boss");
        const categoryResult = await categoryResponse.json();
        if (categoryResult.success && categoryResult.data) {
          const allItems = categoryResult.data as CollectionItem[];
          const uniqueCategories = Array.from(
            new Set(allItems.map((item) => item.category).filter(Boolean)),
          );
          if (uniqueCategories.length > 0) {
            await fetchCategory(uniqueCategories[0] as string);
          }
        }
      } catch (fallbackErr) {
        setError("Failed to load collections");
      }
    } finally {
      setSetsLoading(false);
    }
  };

  const handleSetClick = (set: ContentSet): void => {
    setLoading(true);
    setError(null);

    // Convert set items to CollectionItem format
    const convertedItems: CollectionItem[] = set.set_items.map((item) => ({
      id: item.id,
      quote: item.quote,
      theme: set.set_theme,
      category: set.set_category,
      attribution: set.set_attribution || "Bench Boss",
    }));

    setItems(convertedItems);
    setCurrentLabel(set.set_title);
    setLoading(false);
  };

  useEffect(() => {
    fetchSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Get all unique categories from all sets or current items
  const getAllCategoriesFromSets = (): Array<{
    category: string;
    emoji: string;
  }> => {
    const categoryMap = new Map<string, string>();

    // If we have sets, use them
    if (sets.length > 0) {
      sets.forEach((set) => {
        if (set.set_category && !categoryMap.has(set.set_category)) {
          // Map categories to emojis for Bench Boss
          const emojiMap: Record<string, string> = {
            "Bounce Back": "🔄",
            Discipline: "⚡",
            Focus: "🎯",
            Grit: "💎",
            "Hard Work": "🔨",
            Leadership: "👑",
            Pain: "💔",
            Team: "👥",
            Teamwork: "🤝",
          };
          categoryMap.set(set.set_category, emojiMap[set.set_category] || "💪");
        }
      });
    } else {
      // Fallback: get categories from current items
      items.forEach((item) => {
        const category = getBadgeText(item);
        if (
          category &&
          category !== "Bench Boss" &&
          !categoryMap.has(category)
        ) {
          const emojiMap: Record<string, string> = {
            "Bounce Back": "🔄",
            Discipline: "⚡",
            Focus: "🎯",
            Grit: "💎",
            "Hard Work": "🔨",
            Leadership: "👑",
            Pain: "💔",
            Team: "👥",
            Teamwork: "🤝",
          };
          categoryMap.set(category, emojiMap[category] || "💪");
        }
      });
    }

    return Array.from(categoryMap.entries()).map(([category, emoji]) => ({
      category,
      emoji,
    }));
  };

  const handleCategoryCardClick = (category: string): void => {
    // Find the set that matches this category
    const matchingSet = sets.find((set) => set.set_category === category);

    if (matchingSet) {
      // Load the set's items
      handleSetClick(matchingSet);
    } else {
      // Fallback: filter current items by category
      const filteredItems = items.filter((item) => {
        const itemCategory = getBadgeText(item);
        return itemCategory === category;
      });

      setItems(filteredItems);
      setCurrentLabel(category);
    }
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

        {/* Category Cards - Display all categories from all sets */}
        {!loading &&
          !error &&
          !setsLoading &&
          ((): JSX.Element | null => {
            const categories = getAllCategoriesFromSets();
            if (categories.length === 0) return null;

            return (
              <div className="max-w-4xl mx-auto mb-8 md:mb-12">
                {/* Instruction Text */}
                <div className="text-center mb-4 md:mb-6">
                  <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium">
                    Hey, click on me.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  {categories.map((cat) => {
                    // Check if this category is currently active
                    const isActive =
                      currentLabel === cat.category ||
                      sets.find(
                        (s) =>
                          s.set_title === currentLabel &&
                          s.set_category === cat.category,
                      );

                    return (
                      <button
                        key={cat.category}
                        onClick={() => handleCategoryCardClick(cat.category)}
                        className={`group relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-navy-900 dark:bg-orange-500 cursor-pointer hover:opacity-90 active:scale-95 transition-all rounded-lg flex flex-col items-center justify-center overflow-hidden touch-manipulation ${
                          isActive
                            ? "ring-2 ring-orange-500 dark:ring-orange-400"
                            : ""
                        }`}
                      >
                        {/* Badge */}
                        <div className="absolute top-1 right-1 bg-orange-500 text-white text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md uppercase tracking-tight z-20">
                          SHARE
                        </div>

                        {/* Emoji */}
                        <span
                          className="text-4xl md:text-5xl mb-1 z-10"
                          role="img"
                          aria-label={cat.category}
                        >
                          {cat.emoji}
                        </span>

                        {/* Category Name */}
                        <span className="text-[9px] md:text-[10px] text-white dark:text-gray-900 font-medium text-center leading-tight uppercase tracking-wide whitespace-pre-line z-10">
                          {cat.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

        {/* Daily Selections List - Bubble CTAs */}
        {!loading && !error && items.length > 0 && (
          <div className="max-w-3xl mx-auto mb-8 md:mb-12">
            <div className="flex flex-col gap-3 md:gap-4">
              {items.map((item, index) => {
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
                    {/* Avatar */}
                    <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl md:text-2xl">
                      💪
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
                  💪
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
