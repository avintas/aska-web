"use client";

import { useEffect, useState } from "react";

interface FactItem {
  id?: number;
  fact_text: string;
  fact_category?: string;
  year?: number;
  [key: string]: unknown;
}

interface FactRecord {
  id: number;
  items: FactItem[];
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
  data?: FactRecord | ArchiveItem[];
  error?: string;
}

// Graph/Chart icon component for facts
const FactIcon = (): JSX.Element => (
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
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export default function DidYouKnowPage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [facts, setFacts] = useState<FactItem[]>([]);
  const [currentSetId, setCurrentSetId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [archiveList, setArchiveList] = useState<ArchiveItem[]>([]);
  const [loadingArchive, setLoadingArchive] = useState(true);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const response = await fetch("/api/did-you-know");
        const result: ApiResponse = await response.json();

        if (result.success && result.data && !Array.isArray(result.data)) {
          const record = result.data as FactRecord;
          // Ensure items is an array
          const items = Array.isArray(record.items) ? record.items : [];
          setFacts(items);
          setCurrentSetId(record.id);
        } else {
          setError(result.error || "Failed to fetch facts");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    async function fetchArchiveList(): Promise<void> {
      try {
        const response = await fetch("/api/did-you-know?mode=archive");
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
      const response = await fetch(`/api/did-you-know?id=${setId}`);
      const result: ApiResponse = await response.json();

      if (result.success && result.data && !Array.isArray(result.data)) {
        const record = result.data as FactRecord;
        const items = Array.isArray(record.items) ? record.items : [];
        setFacts(items);
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
            <span className="text-5xl">💡</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              Did You Know?
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Discover fascinating hockey facts, records, and stories that
            showcase the rich history and culture of the greatest game on ice.
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

        {/* Facts Grid */}
        {!loading && !error && facts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facts.map((fact, index) => (
              <div
                key={fact.id || index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20 relative"
              >
                {/* Icon */}
                <div className="mb-4">
                  <FactIcon />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {fact.fact_category
                    ? fact.fact_category
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase(),
                        )
                        .join(" ")
                    : `Fact ${index + 1}`}
                </h3>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {fact.fact_text}
                </p>

                {/* Year badge if available */}
                {fact.year && (
                  <div className="inline-block bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold px-2 py-1 rounded mb-4">
                    {fact.year}
                  </div>
                )}

                {/* Share Button */}
                <button
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center transition-colors"
                  aria-label="Share fact"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Hockey Fact",
                        text: fact.fact_text,
                      });
                    } else {
                      navigator.clipboard.writeText(fact.fact_text);
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
        {!loading && !error && facts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No facts available at this time.
            </p>
          </div>
        )}

        {/* Past Collections Section */}
        {!loading && !error && (
          <div className="mt-12 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
              Past Collections
            </h2>
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
