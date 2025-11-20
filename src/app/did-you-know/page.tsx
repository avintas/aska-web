"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Fact {
  id: number;
  // Support both naming conventions: stat_* (from collection_stats) and fact_* (from collection_facts)
  stat_text?: string;
  fact_text?: string;
  fact?: string;
  stat_value?: string | null;
  fact_value?: string | null;
  stat_category?: string | null;
  fact_category?: string | null;
  year?: number | null;
  theme?: string | null;
  attribution?: string | null;
  context?: string | null;
  display_order?: number;
  [key: string]: unknown;
}

// Use same-domain API routes (no CORS needed)
const API_BASE = "/api/public";

// Get icon emoji based on category/theme
const getCategoryIcon = (
  category: string | null | undefined,
  theme: string | null | undefined,
): string => {
  const cat = (category || theme || "").toLowerCase();

  if (cat.includes("historical") || cat.includes("history")) return "🏆";
  if (cat.includes("record") || cat.includes("milestone")) return "📊";
  if (cat.includes("scoring") || cat.includes("goal")) return "🏒";
  if (cat.includes("team") || cat.includes("franchise")) return "👥";
  if (cat.includes("career") || cat.includes("player")) return "⛸️";
  if (cat.includes("coach") || cat.includes("coaching")) return "📋";

  // Default icons based on theme
  if (theme) {
    const themeLower = theme.toLowerCase();
    if (themeLower.includes("scoring")) return "🏒";
    if (themeLower.includes("team")) return "👥";
    if (themeLower.includes("career")) return "⛸️";
  }

  return "🏒"; // Default hockey stick
};

// Get category label
const getCategoryLabel = (
  category: string | null | undefined,
  theme: string | null | undefined,
): string => {
  if (category) {
    const cat = category.toLowerCase();
    if (cat.includes("historical") || cat.includes("history"))
      return "Historical";
    if (cat.includes("record") || cat.includes("milestone")) return "Record";
    if (cat.includes("career")) return "Career";
    if (cat.includes("team")) return "Team";
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  if (theme) {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  }
  return "Fact";
};

// Share functionality
const handleShare = async (fact: Fact): Promise<void> => {
  const mainText = fact.stat_text || fact.fact_text || fact.fact || "";
  const shareText = `${mainText}${fact.attribution ? ` — ${fact.attribution}` : ""}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Did you know?",
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

export default function DidYouKnowPage(): JSX.Element {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacts = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_BASE}/shareables/facts`);

        const data = await response.json();

        if (data.success) {
          setFacts(data.data || []);
        } else {
          setError(data.error || "Failed to load facts");
        }
      } catch (err) {
        console.error("Failed to fetch facts:", err);
        setError("Unable to fetch facts. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">
          Loading facts...
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
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-blue-600 dark:bg-orange-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </Link>
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
            Did you know?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover interesting hockey statistics and facts
          </p>
        </div>

        {/* Facts Grid - Shareable Card Design */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {facts.length > 0 ? (
            facts.map((item) => {
              // Get the main text from any of the possible fields (support both naming conventions)
              const mainText =
                item.stat_text ||
                item.fact_text ||
                item.fact ||
                "No text available";
              // Get category (support both naming conventions)
              const category = item.stat_category || item.fact_category;
              const categoryLabel = getCategoryLabel(category, item.theme);
              const icon = getCategoryIcon(category, item.theme);

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

                  {/* Description */}
                  <p className="text-white text-sm leading-relaxed mb-6 flex-grow">
                    {mainText}
                  </p>

                  {/* Share Button */}
                  <div className="flex justify-center mt-auto">
                    <button
                      onClick={() => handleShare(item)}
                      className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors shadow-md hover:shadow-lg active:scale-95"
                      aria-label="Share this fact"
                      title="Share this fact"
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
              No facts available yet.
            </p>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-blue-600 dark:bg-orange-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
