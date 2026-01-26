"use client";

import { useState, useEffect } from "react";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { PageSlogan } from "@/components/PageSlogan";

interface SemioticSlogan {
  id: number;
  slogan: string;
  source_id?: number;
  created_at?: string;
  [key: string]: unknown;
}

export default function SemioticsPage(): JSX.Element {
  const [slogans, setSlogans] = useState<SemioticSlogan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSlogans() {
      try {
        const response = await fetch("/api/collections/semiotics");
        const result = await response.json();

        if (result.success && result.data) {
          setSlogans(result.data as SemioticSlogan[]);
        } else {
          setError(result.error || "Failed to load slogans");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchSlogans();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="Slogans extracted from semiotic analysis. These are powerful messages derived from the deeper meaning and symbolism in hockey culture."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">
            Semiotic Slogans
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
            <span className="text-5xl md:text-6xl lg:text-7xl">🎯</span>
          </div>
          <PageSlogan />
          <div className="max-w-2xl mx-auto mt-4">
            <p className="text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              Powerful slogans extracted from semiotic analysis of hockey
              culture.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-400">
              Loading slogans...
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

        {/* Slogans Grid */}
        {!loading && !error && slogans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slogans.map((slogan, index) => (
              <div
                key={slogan.id || index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20"
              >
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium">
                  {slogan.slogan}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && slogans.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              No slogans available at this time.
            </p>
          </div>
        )}

        {/* Debug Info */}
        {!loading && !error && slogans.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Found {slogans.length} slogan{slogans.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
