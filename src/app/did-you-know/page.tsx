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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

interface ApiResponse {
  success: boolean;
  data?: FactRecord | ArchiveItem[];
  pagination?: PaginationInfo;
  error?: string;
}

// Small icon component for facts (responsive)
const FactIconSmall = (): JSX.Element => (
  <svg
    className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-orange-500 dark:text-orange-400"
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

// Modal Component
interface ModalProps {
  fact: FactItem;
  isOpen: boolean;
  onClose: () => void;
}

const FactModal = ({ fact, isOpen, onClose }: ModalProps): JSX.Element => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return <></>;

  const categoryLabel = fact.fact_category
    ? fact.fact_category
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")
    : "Hockey Fact";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300"
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

        {/* Icon */}
        <div className="mb-6">
          <FactIconSmall />
        </div>

        {/* Category/Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {categoryLabel}
        </h2>

        {/* Fact Text */}
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          {fact.fact_text}
        </p>

        {/* Year badge if available */}
        {fact.year && (
          <div className="inline-block bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-semibold px-3 py-1 rounded mb-6">
            {fact.year}
          </div>
        )}

        {/* Share Button */}
        <button
          className="w-full px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Hockey Fact",
                text: fact.fact_text,
              });
            } else {
              navigator.clipboard.writeText(fact.fact_text);
              alert("Fact copied to clipboard!");
            }
          }}
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
          Share Fact
        </button>
      </div>
    </div>
  );
};

export default function DidYouKnowPage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [facts, setFacts] = useState<FactItem[]>([]);
  const [currentSetId, setCurrentSetId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [archiveList, setArchiveList] = useState<ArchiveItem[]>([]);
  const [loadingArchive, setLoadingArchive] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [selectedFact, setSelectedFact] = useState<FactItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (
    setId: number | null = null,
    page = 1,
  ): Promise<void> => {
    const isInitialLoad = page === 1;
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const url = setId
        ? `/api/did-you-know?id=${setId}&page=${page}&limit=80`
        : `/api/did-you-know?page=${page}&limit=80`;
      const response = await fetch(url);
      const result: ApiResponse = await response.json();

      if (result.success && result.data && !Array.isArray(result.data)) {
        const record = result.data as FactRecord;
        const items = Array.isArray(record.items) ? record.items : [];

        if (isInitialLoad) {
          setFacts(items);
        } else {
          setFacts((prev) => [...prev, ...items]);
        }

        setCurrentSetId(record.id);
        setPagination(result.pagination || null);
        setCurrentPage(page);
      } else {
        setError(result.error || "Failed to fetch facts");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
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

    fetchArchiveList();
  }, []);

  const loadSet = async (setId: number): Promise<void> => {
    setCurrentPage(1);
    await fetchData(setId, 1);
  };

  const loadMore = async (): Promise<void> => {
    if (pagination?.hasMore && !loadingMore) {
      const nextPage = currentPage + 1;
      await fetchData(currentSetId, nextPage);
    }
  };

  const openModal = (fact: FactItem): void => {
    setSelectedFact(fact);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedFact(null);
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
            These facts will help you prepare for trivia games.
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

        {/* Icons Grid */}
        {!loading && !error && facts.length > 0 && (
          <>
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-9 gap-2">
                {facts.map((fact, index) => (
                  <button
                    key={fact.id || index}
                    onClick={() => openModal(fact)}
                    className="relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20 flex items-center justify-center cursor-pointer group"
                    aria-label={`View fact ${index + 1}`}
                  >
                    <FactIconSmall />
                    {fact.year && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {fact.year.toString().slice(-2)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Load More Button */}
            {pagination?.hasMore && (
              <div className="text-center mb-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </span>
                  ) : (
                    `Load More (${pagination.total - facts.length} remaining)`
                  )}
                </button>
              </div>
            )}

            {/* Pagination Info */}
            {pagination && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                Showing {facts.length} of {pagination.total} facts
              </div>
            )}
          </>
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

      {/* Modal */}
      {selectedFact && (
        <FactModal
          fact={selectedFact}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
