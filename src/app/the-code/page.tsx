"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Motivational {
  id: number;
  quote: string;
  author: string | null;
  context: string | null;
  theme: string | null;
  category: string | null;
  attribution: string | null;
  display_order: number;
}

interface ArchiveItem {
  id: number;
  created_at: string;
  status: string;
}

// Use same-domain API routes (no CORS needed)
const API_BASE = "/api/public";

// Get icon emoji based on category/theme
const getCategoryIcon = (
  category: string | null | undefined,
  theme: string | null | undefined,
): string => {
  const cat = (category || theme || "").toLowerCase();

  if (cat.includes("legend") || cat.includes("legends")) return "⭐";
  if (cat.includes("coach") || cat.includes("coaching")) return "📋";
  if (cat.includes("motivation") || cat.includes("inspire")) return "💪";
  if (cat.includes("team") || cat.includes("unity")) return "👥";
  if (cat.includes("perseverance") || cat.includes("resilience")) return "🔥";
  if (cat.includes("leadership")) return "👑";

  // Default icons based on theme
  if (theme) {
    const themeLower = theme.toLowerCase();
    if (themeLower.includes("legend")) return "⭐";
    if (themeLower.includes("coach")) return "📋";
    if (themeLower.includes("motivation")) return "💪";
  }

  return "💪"; // Default motivational icon
};

// Get category label
const getCategoryLabel = (
  category: string | null | undefined,
  theme: string | null | undefined,
): string => {
  if (category) {
    const cat = category.toLowerCase();
    if (cat.includes("legend") || cat.includes("legends")) return "Legend";
    if (cat.includes("coach") || cat.includes("coaching")) return "Coach";
    if (cat.includes("motivation") || cat.includes("inspire"))
      return "Motivation";
    if (cat.includes("team")) return "Team";
    if (cat.includes("leadership")) return "Leadership";
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  if (theme) {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }
  return "The Code";
};

// Share functionality
const handleShare = async (item: Motivational): Promise<void> => {
  const shareText = `"${item.quote}"${item.author ? ` — ${item.author}` : ""}${item.attribution ? ` (${item.attribution})` : ""}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "The Code",
        text: shareText,
      });
    } catch (err) {
      // User cancelled or error occurred
      console.log("Share cancelled or failed");
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy to clipboard");
    }
  }
};

function TheCodeContent(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setId = searchParams.get("id");

  const [motivational, setMotivational] = useState<Motivational[]>([]);
  const [archiveList, setArchiveList] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSetDate, setActiveSetDate] = useState<string | null>(null);

  // Fetch the specific set (latest or by ID)
  useEffect(() => {
    const fetchMotivational = async (): Promise<void> => {
      setLoading(true);
      try {
        const url = setId
          ? `${API_BASE}/shareables/motivational?id=${setId}`
          : `${API_BASE}/shareables/motivational`;

        const response = await fetch(url);
        const data = await response.json();

        console.log("Motivational API response:", {
          success: data.success,
          hasData: !!data.data,
          dataLength: data.data?.length,
          error: data.error,
          details: data.details,
          code: data.code,
          hint: data.hint,
        });

        if (data.success) {
          setMotivational(data.data || []);
          if (data.meta?.created_at) {
            setActiveSetDate(
              new Date(data.meta.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            );
          }
        } else {
          console.error("Motivational API error:", data.error, data.details);
          setError(data.error || "Failed to load motivational content");
        }
      } catch (err) {
        console.error("Failed to fetch motivational content:", err);
        setError(
          "Unable to fetch motivational content. Please try refreshing the page.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMotivational();
  }, [setId]);

  // Fetch archive list on mount
  useEffect(() => {
    const fetchArchive = async (): Promise<void> => {
      try {
        const response = await fetch(
          `${API_BASE}/shareables/motivational?mode=archive`,
        );
        const data = await response.json();
        if (data.success) {
          setArchiveList(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch archive list:", err);
      }
    };
    fetchArchive();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">
          Loading The Code...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Content Unavailable
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            The Code
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Inspiring quotes from legendary players and coaches
          </p>
          {activeSetDate && (
            <p className="text-sm text-blue-600 dark:text-orange-500 font-medium uppercase tracking-wide">
              Set #{setId || motivational[0]?.id || "Latest"} ({activeSetDate})
            </p>
          )}
        </div>

        {/* Motivational Grid - Shareable Card Design */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {motivational.length > 0 ? (
            motivational.map((item) => {
              const categoryLabel = getCategoryLabel(item.category, item.theme);
              const icon = getCategoryIcon(item.category, item.theme);

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col rounded-xl bg-slate-800 dark:bg-slate-900 border border-slate-700 dark:border-slate-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="text-5xl">{icon}</div>
                  </div>

                  {/* Category Label */}
                  <h3 className="text-center text-white font-bold text-lg mb-4">
                    {categoryLabel}
                  </h3>

                  {/* Quote */}
                  <blockquote className="text-white text-sm leading-relaxed mb-4 flex-grow">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  {/* Author */}
                  {item.author && (
                    <p className="text-sm font-semibold text-blue-400 mb-2 text-center">
                      — {item.author}
                    </p>
                  )}

                  {/* Context */}
                  {item.context && (
                    <p className="text-xs text-gray-300 mb-4">{item.context}</p>
                  )}

                  {/* Share Button */}
                  <div className="flex justify-center mt-auto">
                    <button
                      onClick={() => handleShare(item)}
                      className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-md hover:shadow-lg active:scale-95"
                      aria-label="Share this quote"
                      title="Share this quote"
                    >
                      <svg
                        className="w-6 h-6 text-white"
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
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
              No motivational quotes available yet.
            </p>
          )}
        </div>

        {/* Past Collections Section */}
        {archiveList.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 pt-12 pb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Past Collections
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {archiveList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(`/the-code?id=${item.id}`)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    Number(setId) === item.id
                      ? "bg-blue-600 dark:bg-orange-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  Set #{item.id}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TheCodePage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 flex items-center justify-center">
          <div className="text-xl text-gray-600 dark:text-gray-400">
            Loading The Code...
          </div>
        </div>
      }
    >
      <TheCodeContent />
    </Suspense>
  );
}
