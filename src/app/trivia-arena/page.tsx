"use client";

import { HubGrid, type HubCell } from "@/components/HubGrid";

// 3x5 grid (15 cells): Place 6 trivia personas
// Row 1: [empty, empty, Bench Boss, empty, empty]
// Row 2: [empty, Captain Heart, Stats Master, Historian, empty]
// Row 3: [empty, The Ref, empty, Rink Philosopher, empty]
const GRID_CELLS: (HubCell | null)[] = [
  null, // Row 1, Col 1
  null, // Row 1, Col 2 (moved to Row 2, Col 2)
  {
    id: "bench-boss",
    name: "Bench Boss",
    emoji: "💪",
    href: "/trivia-arena/bench-boss",
    description: "Trivia challenges from Bench Boss",
  },
  null, // Row 1, Col 4 (moved to Row 2, Col 4)
  null, // Row 1, Col 5
  null, // Row 2, Col 1
  {
    id: "captain-heart",
    name: "Captain Heart",
    emoji: "💙",
    href: "/trivia-arena/captain-heart",
    description: "Trivia challenges from Captain Heart",
  }, // Row 2, Col 2 (moved from Row 1, Col 2)
  {
    id: "stats-master",
    name: "Stats Master",
    emoji: "📊",
    href: "/trivia-arena/stats-master",
    description: "Statistics and records trivia",
  },
  {
    id: "historian",
    name: "Historian",
    emoji: "📜",
    href: "/trivia-arena/historian",
    description: "Historical trivia and facts",
  }, // Row 2, Col 4 (moved from Row 1, Col 4)
  null, // Row 2, Col 5
  null, // Row 3, Col 1
  {
    id: "the-ref",
    name: "The Ref",
    emoji: "⚖️",
    href: "/trivia-arena/the-ref",
    description: "Rules and regulations trivia",
  },
  null, // Row 3, Col 3
  {
    id: "rink-philosopher",
    name: "Rink Philosopher",
    emoji: "🎓",
    href: "/trivia-arena/rink-philosopher",
    description: "Wisdom and knowledge trivia",
  },
  null, // Row 3, Col 5
];

export default function TriviaArenaPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-20 pb-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            <span className="text-5xl md:text-6xl lg:text-7xl">🎯</span>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Trivia Arena
            </h1>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg md:text-xl lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              Welcome to Trivia Arena, your hub for our collection of
              interactive trivia games. Test your knowledge across a variety of
              challenges and compete to see how well you know the game.
            </p>
          </div>
        </div>

        {/* 3x5 Hub Grid */}
        <HubGrid cells={GRID_CELLS} />

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-block px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-light italic">
              Select a persona above to start your trivia challenge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
