"use client";

import { useState, useEffect } from "react";
import { HubGrid, type HubCell } from "@/components/HubGrid";
import { formatModalContent } from "@/utils/formatModalContent";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { PageHeader } from "@/components/PageHeader";

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

export default function RinkPhilosopherPage(): JSX.Element {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sets, setSets] = useState<ContentSet[]>([]);
  const [setsLoading, setSetsLoading] = useState(true);

  const fetchTheme = async (theme: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/rink-philosopher?theme=${encodeURIComponent(theme)}`,
      );
      const result = await response.json();

      if (result.success && result.data) {
        setItems((result.data as CollectionItem[]).slice(0, 12));
      } else {
        setError(result.error || `Failed to load ${theme}`);
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
      const response = await fetch("/api/rink-philosopher/sets");
      const result = await response.json();

      if (result.success && result.data) {
        const fetchedSets = result.data as ContentSet[];
        setSets(fetchedSets);

        // If no sets available, fallback to fetching themes from collection
        if (fetchedSets.length === 0) {
          // Fetch all themes from collection_hockey_culture
          const themeResponse = await fetch("/api/rink-philosopher");
          const themeResult = await themeResponse.json();

          if (themeResult.success && themeResult.data) {
            const allItems = themeResult.data as CollectionItem[];
            // Get unique themes
            const uniqueThemes = Array.from(
              new Set(allItems.map((item) => item.theme).filter(Boolean)),
            );

            // Load first theme by default if available
            if (uniqueThemes.length > 0) {
              await fetchTheme(uniqueThemes[0] as string);
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
        const themeResponse = await fetch("/api/rink-philosopher");
        const themeResult = await themeResponse.json();
        if (themeResult.success && themeResult.data) {
          const allItems = themeResult.data as CollectionItem[];
          const uniqueThemes = Array.from(
            new Set(allItems.map((item) => item.theme).filter(Boolean)),
          );
          if (uniqueThemes.length > 0) {
            await fetchTheme(uniqueThemes[0] as string);
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
      attribution: set.set_attribution || "Rink Philosopher",
    }));

    setItems(convertedItems);
    setLoading(false);
  };

  useEffect(() => {
    fetchSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIconClick = (item: CollectionItem): void => {
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
    const attributionText = selectedItem.attribution
      ? ` - ${selectedItem.attribution}`
      : "";
    const siteUrl = "https://onlyhockey.com/rink-philosopher";
    const subject = encodeURIComponent("Rink Philosopher - OnlyHockey.com");
    const body = encodeURIComponent(
      `${quoteText}${attributionText}\n\nFrom OnlyHockey.com\n${siteUrl}`,
    );
    const shareText = `${quoteText}${attributionText}\n\nFrom OnlyHockey.com\n${siteUrl}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Rink Philosopher - OnlyHockey.com",
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

  const getQuote = (item: CollectionItem): string => {
    return item.quote;
  };

  const getContext = (item: CollectionItem): string | null => {
    if (item.category) {
      return item.category;
    }
    if (item.theme) {
      return item.theme;
    }
    return null;
  };

  const getBadgeText = (item: CollectionItem): string => {
    if (item.category) {
      return item.category;
    }
    if (item.theme) {
      return item.theme;
    }
    return "Rink Philosopher";
  };

  // Get emoji fallback for category
  const getCategoryEmoji = (category: string): string => {
    const emojiMap: Record<string, string> = {
      "The Chirp": "💬",
      "The Flow": "🌊",
      "The Grind": "⚙️",
      "The Room": "🏠",
      "The Code": "📜",
      "The Stripes": "👔",
    };
    return emojiMap[category] || "🎓";
  };

  // Get all unique categories/themes from all sets or current items
  const getAllCategoriesFromSets = (): Array<{
    category: string;
    emoji: string;
    imageIndex: number;
  }> => {
    const categoryMap = new Map<
      string,
      { emoji: string; imageIndex: number }
    >();
    let imageIndexCounter = 0;

    // If we have sets, use them
    if (sets.length > 0) {
      sets.forEach((set) => {
        if (set.set_category && !categoryMap.has(set.set_category)) {
          categoryMap.set(set.set_category, {
            emoji: getCategoryEmoji(set.set_category),
            imageIndex: imageIndexCounter++,
          });
        }
      });
    } else {
      // Fallback: get themes from current items
      items.forEach((item) => {
        const theme = item.theme || item.category;
        if (theme && theme !== "Rink Philosopher" && !categoryMap.has(theme)) {
          categoryMap.set(theme, {
            emoji: getCategoryEmoji(theme),
            imageIndex: imageIndexCounter++,
          });
        }
      });
    }

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      emoji: data.emoji,
      imageIndex: data.imageIndex,
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
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="Sometimes the best lessons come from the rink. Deep wisdom, mental toughness insights, and philosophical reflections from the game's greatest minds. Whether you need perspective on the grind, clarity in the flow, or wisdom from the room, find the words that elevate your mindset."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header */}
        <PageHeader
          title="Rink Philosopher"
          subtitle="Sometimes the best lessons come from the rink. Deep wisdom, mental toughness insights, and philosophical reflections from the game's greatest minds. Whether you need perspective on the grind, clarity in the flow, or wisdom from the room, find the words that elevate your mindset."
          emoji="🎓"
        />

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
            // 1. Row 1 cell 1 (index 0) → Row 2 cell 3 (index 7)
            const gridCells: (HubCell | null)[] = Array.from(
              { length: 15 },
              (_, i) => {
                // Check destinations first

                // Move 1: Row 1 cell 1 (index 0) → Row 2 cell 3 (index 7) - Category[0]
                if (i === 7) {
                  return categories[0]
                    ? {
                        id: categories[0].category
                          .toLowerCase()
                          .replace(/\s+/g, "-"),
                        name: categories[0].category,
                        emoji: categories[0].emoji,
                        description: `View ${categories[0].category} messages`,
                        badge: "SHARE",
                        badgeColor: "bg-indigo-500",
                        onClick: () =>
                          handleCategoryCardClick(categories[0].category),
                      }
                    : null;
                }

                // Source position becomes empty
                if (i === 0) {
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
                  badgeColor: "bg-indigo-500",
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
                      🎓
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
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl md:text-2xl">
                  🎓
                </div>
                <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                  Rink Philosopher about{" "}
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
                <div className="text-base md:text-lg text-gray-800 dark:text-gray-200 leading-relaxed italic">
                  &ldquo;
                  {formatModalContent(getQuote(selectedItem), {
                    className: "",
                    preserveLineBreaks: true,
                  })}
                  &rdquo;
                </div>
              </div>

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
