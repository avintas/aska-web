"use client";

import { useState, useEffect } from "react";
import { HubGrid, type HubCell } from "@/components/HubGrid";

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

export default function CaptainHeartPage(): JSX.Element {
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

  const fetchSets = async (): Promise<void> => {
    setSetsLoading(true);
    try {
      const response = await fetch("/api/captain-heart/sets");
      const result = await response.json();

      if (result.success && result.data) {
        const fetchedSets = result.data as ContentSet[];
        setSets(fetchedSets);

        // Find and load "I Am Proud" collection by default
        const proudSet = fetchedSets.find(
          (set) =>
            set.set_title.toLowerCase().includes("proud") ||
            set.set_category?.toLowerCase().includes("proud") ||
            set.set_title.toLowerCase().includes("i'm proud") ||
            set.set_title.toLowerCase().includes("im proud"),
        );

        if (proudSet) {
          handleSetClick(proudSet);
        }
      }
    } catch (err) {
      console.error("Failed to load sets:", err);
      setError("Failed to load collections");
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
      attribution: set.set_attribution || "Captain Heart",
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
    const siteUrl = "https://onlyhockey.com/captain-heart";
    const subject = encodeURIComponent("Captain Heart - OnlyHockey.com");
    const body = encodeURIComponent(
      `${quoteText}${authorText}\n\nFrom OnlyHockey.com\n${siteUrl}`,
    );
    const shareText = `${quoteText}${authorText}\n\nFrom OnlyHockey.com\n${siteUrl}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Captain Heart - OnlyHockey.com",
          text: shareText,
          url: siteUrl,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
          // Fallback to mailto if share fails
          window.location.href = `mailto:?subject=${subject}&body=${body}`;
        });
    } else {
      // Fallback: use mailto link with subject line
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
    return "Captain Heart";
  };

  // Get all unique categories from all sets
  const getAllCategoriesFromSets = (): Array<{
    category: string;
    emoji: string;
  }> => {
    const categoryMap = new Map<string, string>();

    sets.forEach((set) => {
      if (set.set_category && !categoryMap.has(set.set_category)) {
        // Map categories to emojis
        const emojiMap: Record<string, string> = {
          Resilience: "💪",
          Celebration: "🎉",
          "Good Luck": "🍀",
          "Im Proud": "⭐",
          "I'm Proud": "⭐",
          "I Am Proud": "⭐",
          Mindset: "🧠",
          Perseverance: "🔥",
          Vision: "👁️",
          Glory: "🏆",
        };
        categoryMap.set(set.set_category, emojiMap[set.set_category] || "💙");
      }
    });

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

  // Get emoji for currently selected collection/category
  const getCurrentCollectionEmoji = (): string => {
    // Check if currentLabel matches a set title
    const currentSet = sets.find((set) => set.set_title === currentLabel);
    const category = currentSet?.set_category || currentLabel;

    // Map categories to emojis
    const emojiMap: Record<string, string> = {
      Resilience: "💪",
      Celebration: "🎉",
      "Good Luck": "🍀",
      "Im Proud": "⭐",
      "I'm Proud": "⭐",
      "I Am Proud": "⭐",
      Mindset: "🧠",
      Perseverance: "🔥",
      Vision: "👁️",
      Glory: "🏆",
    };

    return emojiMap[category] || "💙";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 md:pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
            <span className="text-3xl md:text-4xl">💙</span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              Captain Heart
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4 md:px-0 mb-4 md:mb-5">
            The game starts before the puck drops. Whether you need a pre-game
            boost or a post-game high five, we&apos;ve got the perfect message
            ready to text. Get inspired and send the ❤️ love.
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

        {/* Category Grid - 3x5 Hub Grid */}
        {!loading &&
          !error &&
          !setsLoading &&
          ((): JSX.Element | null => {
            const categories = getAllCategoriesFromSets();
            if (categories.length === 0) return null;

            // Convert categories to HubCell format and create 3x5 grid
            // Moves applied:
            // 1. Row 1 cell 1 (index 0) → Row 2 cell 3 (index 8)
            // 2. Row 1 cell 5 (index 4) → Row 2 cell 4 (index 9)
            const gridCells: (HubCell | null)[] = Array.from(
              { length: 15 },
              (_, i) => {
                // Check destinations first

                // Move 1: Row 1 cell 1 (index 0) → Row 2 cell 3 (index 8) - Category[0]
                if (i === 8) {
                  return categories[0]
                    ? {
                        id: categories[0].category
                          .toLowerCase()
                          .replace(/\s+/g, "-"),
                        name: categories[0].category,
                        emoji: categories[0].emoji,
                        description: `View ${categories[0].category} messages`,
                        badge: "SHARE",
                        badgeColor: "bg-purple-500",
                        onClick: () =>
                          handleCategoryCardClick(categories[0].category),
                      }
                    : null;
                }

                // Move 2: Row 1 cell 5 (index 4) → Row 2 cell 4 (index 9) - Category[4]
                if (i === 9) {
                  return categories[4]
                    ? {
                        id: categories[4].category
                          .toLowerCase()
                          .replace(/\s+/g, "-"),
                        name: categories[4].category,
                        emoji: categories[4].emoji,
                        description: `View ${categories[4].category} messages`,
                        badge: "SHARE",
                        badgeColor: "bg-purple-500",
                        onClick: () =>
                          handleCategoryCardClick(categories[4].category),
                      }
                    : null;
                }

                // Source positions become empty
                if (i === 0 || i === 4) {
                  return null;
                }

                // Default: use category at this index
                const category = categories[i];
                if (!category) return null;

                return {
                  id: category.category.toLowerCase().replace(/\s+/g, "-"),
                  name: category.category,
                  emoji: category.emoji,
                  description: `View ${category.category} messages`,
                  badge: "SHARE",
                  badgeColor: "bg-purple-500",
                  onClick: () => handleCategoryCardClick(category.category),
                };
              },
            );

            return (
              <>
                {/* Hub Title */}
                <div className="text-center mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Hub Selector
                  </h2>
                </div>
                <HubGrid cells={gridCells} />
              </>
            );
          })()}

        {/* Daily Selections List - Bubble CTAs */}
        {!loading && !error && items.length > 0 && (
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="w-[200px] sm:w-[232px] md:w-[672px] flex flex-col gap-3 md:gap-4">
              {items.map((item, index) => {
                const badgeText = getBadgeText(item);
                const quotePreview = getQuote(item);
                // Get first line or truncate to ~60 characters for preview
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
                    <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-xl md:text-2xl">
                        {getCurrentCollectionEmoji()}
                      </span>
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-[90vw] md:max-w-md lg:max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src="/captain_heart_1.webp"
                    alt="Captain Heart"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                  Captain Heart about{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {getContext(selectedItem) ||
                      getBadgeText(selectedItem) ||
                      ""}
                  </span>
                </h2>
              </div>
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
              {/* Quote */}
              <div className="mb-4 md:mb-5">
                <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 leading-relaxed italic">
                  &ldquo;{getQuote(selectedItem)}&rdquo;
                </p>
              </div>

              {/* Author */}
              {getAuthor(selectedItem) && (
                <div className="mb-4 md:mb-5">
                  <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    &mdash; {getAuthor(selectedItem)}
                  </p>
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
