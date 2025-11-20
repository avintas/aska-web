"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Wisdom {
  id: number;
  title: string;
  from_the_box: string;
  theme: string | null;
  attribution: string | null;
}

interface Greeting {
  id: number;
  greeting_text: string;
  attribution: string | null;
}

// Use same-domain API routes (no CORS needed)
const API_BASE = "/api/public";

export default function ShareablesPage(): JSX.Element {
  const [wisdom, setWisdom] = useState<Wisdom[]>([]);
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllContent = async (): Promise<void> => {
      try {
        const [wisdomRes, greetingsRes] = await Promise.all([
          fetch(`${API_BASE}/wisdom/latest?limit=5`),
          fetch(`${API_BASE}/greetings/latest?limit=5`),
        ]);

        const wisdomData = await wisdomRes.json();
        const greetingsData = await greetingsRes.json();

        if (wisdomData.success) setWisdom(wisdomData.data || []);
        if (greetingsData.success) setGreetings(greetingsData.data || []);
      } catch (err) {
        console.error("Failed to fetch shareables:", err);
        setError(
          "Unable to fetch shareables content. Please try refreshing the page.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">
          Loading Shareables...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Shareables
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover wisdom and greetings from the hockey world
          </p>
        </div>

        {/* Wisdom Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            🧠 Wisdom
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Philosophical musings from the Penalty Box Philosopher
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wisdom.length > 0 ? (
              wisdom.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-blue-600 dark:text-orange-500 italic">
                    {item.from_the_box}
                  </p>
                  {item.theme && (
                    <span className="inline-block mt-3 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                      {item.theme}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No wisdom available yet.
              </p>
            )}
          </div>
        </section>

        {/* Greetings Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            👋 H.U.G.s (Hockey Universal Greetings)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Shareable greetings for the hockey community
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {greetings.length > 0 ? (
              greetings.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <p className="text-lg text-gray-900 dark:text-white mb-2">
                    &ldquo;{item.greeting_text}&rdquo;
                  </p>
                  {item.attribution && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      — {item.attribution}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No greetings available yet.
              </p>
            )}
          </div>
        </section>

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
