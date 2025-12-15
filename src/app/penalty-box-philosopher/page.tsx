"use client";

import { useState, useEffect } from "react";

interface WisdomItem {
  id: number;
  quote: string;
  theme: string | null;
  category: string | null;
  attribution: string | null;
  author?: string | null;
  [key: string]: unknown;
}

// Wisdom Themes
const THEMES = ["Chirp code", "flow", "grind", "room"];

export default function PenaltyBoxPhilosopherPage(): JSX.Element {
  const [items, setItems] = useState<WisdomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string>("Daily Set");
  const [selectedItem, setSelectedItem] = useState<WisdomItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDailySet = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/penalty-box-philosopher");
      const result = await response.json();

      if (result.success && result.data) {
        if (result.type === "daily") {
          setItems(result.data as WisdomItem[]);
          setCurrentLabel("Daily Set");
        } else {
          setItems(result.data || []);
        }
      } else {
        setError(result.error || "Failed to load Daily Set");
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
        `/api/penalty-box-philosopher?theme=${encodeURIComponent(theme)}`,
      );
      const result = await response.json();

      if (result.success && result.data) {
        setItems((result.data as WisdomItem[]).slice(0, 12));
        setCurrentLabel(theme);
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

  const handleThemeClick = (theme: string): void => {
    fetchTheme(theme);
  };

  const handleDailySetClick = (): void => {
    fetchDailySet();
  };

  const handleIconClick = (item: WisdomItem): void => {
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

  const getEmoji = (): string => {
    // Default emoji for wisdom items
    return "🎓";
  };

  const getQuote = (item: WisdomItem): string => {
    return item.quote;
  };

  const getAuthor = (item: WisdomItem): string | null => {
    return item.author || null;
  };

  const getContext = (item: WisdomItem): string | null => {
    if (item.theme) {
      return item.theme;
    }
    if (item.category) {
      return item.category;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🎓</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              Penalty Box Philosopher
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Wisdom and mindset lessons. Placeholder content for grid testing.
          </p>
        </div>

        {/* Set Label */}
        {!loading && !error && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {currentLabel}
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6 text-center">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Grid - 2x4 for Daily Set (8 items), 3x4 for Themes (12 items) */}
        {!loading && !error && items.length > 0 && (
          <div className="flex justify-center mb-8">
            <div
              className={`grid gap-2 ${
                items.length === 8
                  ? "grid-cols-2 md:grid-cols-4"
                  : "grid-cols-4"
              }`}
            >
              {items.map((item, index) => {
                const emoji = getEmoji();
                return (
                  <div
                    key={item.id || index}
                    onClick={() => handleIconClick(item)}
                    className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-4xl md:text-5xl hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md transition-all cursor-pointer"
                    aria-label={`View wisdom ${index + 1}`}
                  >
                    {emoji}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No items available at this time.
            </p>
          </div>
        )}

        {/* Theme Label Cloud */}
        {!loading && !error && (
          <div className="mt-12 mb-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Wisdom Themes
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {/* Daily Set Button */}
                <button
                  onClick={handleDailySetClick}
                  className="px-6 py-2 rounded-full font-semibold transition-colors bg-green-500 dark:bg-green-500 text-white hover:bg-green-600 dark:hover:bg-green-600"
                >
                  Daily Set
                </button>

                {/* Theme Buttons */}
                {THEMES.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleThemeClick(theme)}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getEmoji(selectedItem)}</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Shareable Motivator
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

            <div className="p-6">
              {/* Quote */}
              <div className="mb-6">
                <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed italic">
                  &ldquo;{getQuote(selectedItem)}&rdquo;
                </p>
              </div>

              {/* Author */}
              {getAuthor(selectedItem) && (
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    &mdash; {getAuthor(selectedItem)}
                  </p>
                </div>
              )}

              {/* Context/Category Tag */}
              {getContext(selectedItem) && (
                <div className="mb-6">
                  <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-semibold px-3 py-1 rounded">
                    {getContext(selectedItem)}
                  </span>
                </div>
              )}

              {/* Share Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleShare}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
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
