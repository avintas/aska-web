"use client";

import { useEffect, useState } from "react";
import { getEmojiForFact, formatCategoryLabel } from "@/utils/factEmojis";

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

// Modal Component (Game Day Pattern)
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

  const emoji = getEmojiForFact(fact);
  const categoryLabel = formatCategoryLabel(fact.fact_category);

  const handleShare = (): void => {
    const shareText = fact.fact_text;

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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{emoji}</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hockey Fact
            </h2>
          </div>
          <button
            onClick={onClose}
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
        <div className="p-6">
          {/* Fact Text */}
          <div className="mb-6">
            <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed italic">
              &ldquo;{fact.fact_text}&rdquo;
            </p>
          </div>

          {/* Category Badge */}
          {fact.fact_category && (
            <div className="mb-4">
              <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-semibold px-3 py-1 rounded">
                {categoryLabel}
              </span>
            </div>
          )}

          {/* Year Badge */}
          {fact.year && (
            <div className="mb-6">
              <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-semibold px-3 py-1 rounded">
                {fact.year}
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
  );
};

export default function DidYouKnowPage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [facts, setFacts] = useState<FactItem[]>([]);
  const [currentSetId, setCurrentSetId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [archiveList, setArchiveList] = useState<ArchiveItem[]>([]);
  const [loadingArchive, setLoadingArchive] = useState(true);
  const [selectedFact, setSelectedFact] = useState<FactItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async (setId: number | null = null): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Load full set without pagination (limit to 20 for display)
      const url = setId
        ? `/api/did-you-know?id=${setId}&limit=20`
        : `/api/did-you-know?limit=20`;
      const response = await fetch(url);
      const result: ApiResponse = await response.json();

      if (result.success && result.data && !Array.isArray(result.data)) {
        const record = result.data as FactRecord;
        const items = Array.isArray(record.items) ? record.items : [];

        // Limit to 20 facts for 4×5 grid
        const displayItems = items.slice(0, 20);

        setFacts(displayItems);
        setCurrentSetId(record.id);
      } else {
        setError(result.error || "Failed to fetch facts");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
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
    await fetchData(setId);
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

        {/* Breadcrumbs - Show current setId */}
        {!loading && !error && currentSetId && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Set #{currentSetId}
              </span>
            </div>
          </div>
        )}

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

        {/* 4×5 Grid (20 facts) */}
        {!loading && !error && facts.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {facts.map((fact, index) => {
                const emoji = getEmojiForFact(fact);
                return (
                  <div
                    key={fact.id || index}
                    onClick={() => openModal(fact)}
                    className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-4xl md:text-5xl hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md transition-all cursor-pointer"
                    aria-label={`View fact ${index + 1}`}
                  >
                    {emoji}
                  </div>
                );
              })}
            </div>
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

        {/* Archive Section */}
        {!loading && !error && (
          <div className="mt-12 mb-6">
            {loadingArchive ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : archiveList.length > 0 ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Past Sets
                </h3>
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
