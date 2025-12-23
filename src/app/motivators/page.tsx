"use client";

import { HubGrid, type HubCell } from "@/components/HubGrid";

// 3x5 grid (15 cells): Place personas in strategic positions
// Row 1: [empty, empty, empty, empty, empty]
// Row 2: [empty, Bench Boss, Captain Heart, Rink Philosopher, empty]
// Row 3: [empty, empty, empty, empty, empty]
const GRID_CELLS: (HubCell | null)[] = [
  null, // Row 1, Col 1
  null, // Row 1, Col 2
  null, // Row 1, Col 3
  null, // Row 1, Col 4
  null, // Row 1, Col 5
  null, // Row 2, Col 1
  {
    id: "bench-boss",
    name: "Bench Boss",
    emoji: "💪",
    href: "/bench-boss",
    description:
      "Daily motivation messages from your Bench Boss. Strong, no-nonsense reminders to stay focused, train hard, and lead the shift.",
    badge: "SHARE",
    badgeColor: "bg-orange-500",
  },
  {
    id: "captain-heart",
    name: "Captain Heart",
    emoji: "💙",
    href: "/captain-heart",
    description:
      "Daily motivation messages from your Captain Heart. Quick, uplifting notes you can read or share anytime you need a boost.",
    badge: "SHARE",
    badgeColor: "bg-purple-500",
  },
  {
    id: "rink-philosopher",
    name: "Rink Philosopher",
    emoji: "🎓",
    href: "/rink-philosopher",
    description:
      "Wisdom and mindset lessons from the Rink Philosopher. Thoughtful takes to reset, refocus, and level up your game.",
    badge: "SHARE",
    badgeColor: "bg-indigo-500",
  },
  null, // Row 2, Col 5
  null, // Row 3, Col 1
  null, // Row 3, Col 2
  null, // Row 3, Col 3
  null, // Row 3, Col 4
  null, // Row 3, Col 5
];

export default function MotivatorsPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-20 pb-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="mb-4 md:mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-3 md:mb-4">
              Pass Around
            </h1>
            <div className="flex justify-center">
              <span className="text-5xl md:text-6xl lg:text-7xl">🏒</span>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg md:text-xl lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              Get motivated with daily inspiration from hockey legends. Choose
              your motivational coach and let them guide you to greatness.
            </p>
          </div>
        </div>

        {/* 3x5 Hub Grid */}
        <HubGrid cells={GRID_CELLS} />

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-block px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-light italic">
              Select a motivator above to start your daily inspiration journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
