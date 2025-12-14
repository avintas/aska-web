import React from "react";
import Link from "next/link";

type ThemeCard = {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
};

export function MotivatorPersonaPage(props: {
  title: string;
  subtitle: string;
  headerEmoji: string;
  dailyEmoji: string;
  themes: ThemeCard[];
}): JSX.Element {
  const { title, subtitle, headerEmoji, dailyEmoji, themes } = props;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl" aria-hidden="true">
              {headerEmoji}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Responsive layout: mobile stack, desktop 4x2 with 2x2 daily + 2x2 themes */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2">
            {/* Daily card */}
            <section className="aspect-square md:col-span-2 md:row-span-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">
                    Daily set
                  </p>
                  <h2 className="mt-2 text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                    Placeholder daily motivator
                  </h2>
                </div>
                <div className="text-5xl md:text-6xl" aria-hidden="true">
                  {dailyEmoji}
                </div>
              </div>

              <p className="mt-6 text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Placeholder content. This block exists to show how the large
                card behaves next to the theme grid on desktop, and how it
                stacks on mobile.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
                >
                  Placeholder action
                </button>
                <Link
                  href="/"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Back home
                </Link>
              </div>
            </section>

            {/* Theme cards (4) */}
            {themes.slice(0, 4).map((theme) => (
              <button
                key={theme.id}
                type="button"
                className="aspect-square bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                      Theme
                    </p>
                    <h3 className="mt-2 text-lg md:text-xl font-black text-gray-900 dark:text-white">
                      {theme.title}
                    </h3>
                  </div>
                  <div className="text-3xl md:text-4xl" aria-hidden="true">
                    {theme.emoji}
                  </div>
                </div>
                <p className="mt-4 text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {theme.blurb}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
