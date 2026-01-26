"use client";

import { useEffect, useState } from "react";
import { PageSlogan } from "@/components/PageSlogan";

// Define TypeScript interfaces for your data
interface CodeItem {
  id?: number;
  title?: string;
  content?: string;
  description?: string;
  principle?: string;
  category?: string;
  [key: string]: unknown;
}

interface CodeRecord {
  id: number;
  items: CodeItem[];
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
  data?: CodeRecord | ArchiveItem[];
  error?: string;
}

export default function TheCodePage(): JSX.Element {
  // State management
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CodeItem[]>([]);
  const [currentSetId, setCurrentSetId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [archiveList, setArchiveList] = useState<ArchiveItem[]>([]);
  const [loadingArchive, setLoadingArchive] = useState(true);

  // Data fetching
  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const response = await fetch("/api/the-code");
        const result: ApiResponse = await response.json();

        if (result.success && result.data && !Array.isArray(result.data)) {
          const record = result.data as CodeRecord;
          // Ensure items is an array
          const items = Array.isArray(record.items) ? record.items : [];
          setData(items);
          setCurrentSetId(record.id);
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    async function fetchArchiveList(): Promise<void> {
      try {
        const response = await fetch("/api/the-code?mode=archive");
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
      const response = await fetch(`/api/the-code?id=${setId}`);
      const result: ApiResponse = await response.json();

      if (result.success && result.data && !Array.isArray(result.data)) {
        const record = result.data as CodeRecord;
        const items = Array.isArray(record.items) ? record.items : [];
        setData(items);
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

  // Page structure
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">
            The Code
          </h1>
          <PageSlogan />
          <div className="max-w-2xl mx-auto mt-4">
            <p className="text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              The unwritten rules and principles that govern hockey culture.
            </p>
          </div>
        </div>

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

        {/* Main Content */}
        {!loading && !error && data.length > 0 && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {data.map((item, index) => (
              <section key={item.id || index} className="mb-12">
                {item.title && (
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h2>
                )}
                {item.principle && (
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {item.principle}
                  </h3>
                )}
                {item.description && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {item.description}
                  </p>
                )}
                {item.content && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {typeof item.content === "string" ? (
                      item.content
                    ) : (
                      <div>{JSON.stringify(item.content)}</div>
                    )}
                  </p>
                )}
                {item.category && (
                  <div className="inline-block bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold px-2 py-1 rounded mt-4">
                    {item.category}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && data.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No content available at this time.
            </p>
          </div>
        )}

        {/* Past Collections Section */}
        {!loading && !error && archiveList.length > 0 && (
          <div className="mt-20 mb-6">
            {loadingArchive ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
