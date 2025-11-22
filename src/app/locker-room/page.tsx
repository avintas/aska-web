"use client";

import Link from "next/link";

export default function LockerRoomPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🏒</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              The Locker Room
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Your pre-game preparation hub. Get motivated, get focused, and get
            ready to play.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Motivational Card */}
          <Link
            href="/game-plan"
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20 group"
          >
            <div className="text-center mb-4">
              <div className="mb-2">
                <span className="text-4xl">💪</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                Motivational
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Motivational quotes and wisdom from legendary players and epic
              coaches to inspire your game.
            </p>
            <div className="mt-6 text-orange-500 dark:text-orange-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              View Motivational
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Penalty Box Philosopher Card */}
          <Link
            href="/pbp"
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20 group"
          >
            <div className="text-center mb-4">
              <div className="mb-2">
                <span className="text-4xl">💭</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                Penalty Box Philosopher
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Wisdom and insights from the game of hockey. Also known as the
              Wisdom Table.
            </p>
            <div className="mt-6 text-orange-500 dark:text-orange-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              View Penalty Box Philosopher
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Pre-Game Card */}
          <Link
            href="/pre-game"
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20 group"
          >
            <div className="text-center mb-4">
              <div className="mb-2">
                <span className="text-4xl">⏰</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                Pre-Game
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your pre-game preparation and warm-up content.
            </p>
            <div className="mt-6 text-orange-500 dark:text-orange-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              View Pre-Game
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Game Plan Card */}
          <Link
            href="/game-plan-strategy"
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20 group"
          >
            <div className="text-center mb-4">
              <div className="mb-2">
                <span className="text-4xl">📋</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                Game Plan
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Strategic game plans and tactical insights.
            </p>
            <div className="mt-6 text-orange-500 dark:text-orange-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
              View Game Plan
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
