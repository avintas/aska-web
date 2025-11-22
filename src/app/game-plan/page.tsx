"use client";

import { useEffect, useState } from "react";

interface MotivationalItem {
  id?: number;
  quote?: string;
  author?: string | null;
  context?: string | null;
  attribution?: string;
  [key: string]: unknown;
}

interface MotivationalRecord {
  id: number;
  items: MotivationalItem[];
  status: string;
  created_at: string;
  updated_at: string;
}

interface ArchiveItem {
  id: number;
  created_at: string;
  status: string;
}

interface ApiResponse {
  success: boolean;
  data?: MotivationalRecord | ArchiveItem[];
  error?: string;
}

// Quote/Message icon component for motivational content
const QuoteIcon = (): JSX.Element => (
  <svg
    className="w-10 h-10 text-orange-500 dark:text-orange-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

export default function GamePlanPage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [motivationals, setMotivationals] = useState<MotivationalItem[]>([]);
  const [currentSetId, setCurrentSetId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [archiveList, setArchiveList] = useState<ArchiveItem[]>([]);
  const [loadingArchive, setLoadingArchive] = useState(true);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const response = await fetch("/api/game-plan");
        const result: ApiResponse = await response.json();

        if (result.success && result.data && !Array.isArray(result.data)) {
          const record = result.data as MotivationalRecord;
          // Ensure items is an array
          const items = Array.isArray(record.items) ? record.items : [];
          setMotivationals(items);
          setCurrentSetId(record.id);
        } else {
          setError(result.error || "Failed to fetch motivational content");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    async function fetchArchiveList(): Promise<void> {
      try {
        const response = await fetch("/api/game-plan?mode=archive");
        const result: ApiResponse = await response.json();

        if (result.success && result.data && Array.isArray(result.data)) {
          setArchiveList(result.data as ArchiveItem[]);
        }
      } catch (err) {
        console.error("Failed to fetch archive:", err);
      } finally {
        setLoadingArchive(false);
      }
    }

    fetchData();
    fetchArchiveList();
  }, []);

  const loadSet = async (setId: number): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/game-plan?id=${setId}`);
      const result: ApiResponse = await response.json();

      if (result.success && result.data && !Array.isArray(result.data)) {
        const record = result.data as MotivationalRecord;
        const items = Array.isArray(record.items) ? record.items : [];
        setMotivationals(items);
        setCurrentSetId(record.id);
      } else {
        setError(result.error || "Failed to load set");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">📋</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              Game Plan
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Motivational quotes and wisdom from legendary players and epic
            coaches to inspire your game.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading motivational content...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6 text-center">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Motivational Content Grid */}
        {!loading && !error && motivationals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {motivationals.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20 relative"
              >
                {/* Icon */}
                <div className="mb-4">
                  <QuoteIcon />
                </div>

                {/* Quote Text */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-lg font-medium">
                  {typeof item.quote === "string"
                    ? item.quote
                    : "No quote available"}
                </p>

                {/* Author */}
                {item.author && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      — {item.author}
                    </p>
                  </div>
                )}

                {/* Attribution (fallback if no author) */}
                {!item.author && item.attribution && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      — {item.attribution}
                    </p>
                  </div>
                )}

                {/* Context badge if available */}
                {item.context && (
                  <div className="inline-block bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold px-2 py-1 rounded mb-4">
                    {item.context}
                  </div>
                )}

                {/* Share Button */}
                <button
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center transition-colors"
                  aria-label="Share quote"
                  onClick={() => {
                    const quoteText =
                      typeof item.quote === "string"
                        ? item.quote
                        : "Hockey quote";
                    const author =
                      typeof item.author === "string"
                        ? item.author
                        : typeof item.attribution === "string"
                          ? item.attribution
                          : "";
                    const shareText = author
                      ? `${quoteText} — ${author}`
                      : quoteText;

                    if (navigator.share) {
                      navigator.share({
                        title: "Hockey Quote",
                        text: shareText,
                      });
                    } else {
                      navigator.clipboard.writeText(shareText);
                    }
                  }}
                >
                  <svg
                    className="w-5 h-5 text-white"
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
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && motivationals.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No motivational content available at this time.
            </p>
          </div>
        )}

        {/* Past Collections Section */}
        {!loading && !error && (
          <div className="mt-20 mb-6">
            {loadingArchive ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : archiveList.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3">
                {archiveList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadSet(item.id)}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                      currentSetId === item.id
                        ? "bg-orange-500 dark:bg-orange-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Set #{item.id}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
