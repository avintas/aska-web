"use client";

import Link from "next/link";

interface TriviaPersona {
  id: string;
  name: string;
  emoji: string;
  href: string;
  description: string;
}

const TRIVIA_PERSONAS: TriviaPersona[] = [
  {
    id: "captain-heart",
    name: "Captain Heart",
    emoji: "💙",
    href: "/trivia-arena/captain-heart",
    description: "Trivia challenges from Captain Heart",
  },
  {
    id: "bench-boss",
    name: "Bench Boss",
    emoji: "💪",
    href: "/trivia-arena/bench-boss",
    description: "Trivia challenges from Bench Boss",
  },
  {
    id: "historian",
    name: "Historian",
    emoji: "📜",
    href: "/trivia-arena/historian",
    description: "Historical trivia and facts",
  },
  {
    id: "the-ref",
    name: "The Ref",
    emoji: "⚖️",
    href: "/trivia-arena/the-ref",
    description: "Rules and regulations trivia",
  },
  {
    id: "rink-philosopher",
    name: "Rink Philosopher",
    emoji: "🎓",
    href: "/trivia-arena/rink-philosopher",
    description: "Wisdom and knowledge trivia",
  },
  {
    id: "stats-master",
    name: "Stats Master",
    emoji: "📊",
    href: "/trivia-arena/stats-master",
    description: "Statistics and records trivia",
  },
];

export default function TriviaArenaPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-20 pb-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            <span className="text-5xl md:text-6xl lg:text-7xl">🎯</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
              Trivia Arena
            </h1>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              Welcome to Trivia Arena, your hub for our collection of
              interactive trivia games. Test your knowledge across a variety of
              challenges and compete to see how well you know the game.
            </p>
          </div>
        </div>

        {/* Personas Grid - 2x3 on mobile, 3x2 on desktop */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4 max-w-4xl">
            {TRIVIA_PERSONAS.map((persona, index) => (
              <Link
                key={persona.id}
                href={persona.href}
                className="group relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-navy-900 dark:bg-orange-500 cursor-pointer hover:opacity-90 active:scale-95 transition-all rounded-lg flex items-center justify-center overflow-hidden touch-manipulation animate-[subtle-shake_8s_ease-in-out_infinite] hover:animate-[pulse-glow_2s_ease-in-out_infinite,subtle-shake_8s_ease-in-out_infinite]"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center px-2 relative">
                  {/* Emoji */}
                  <span
                    className="text-4xl md:text-5xl lg:text-6xl mb-1 z-10"
                    role="img"
                    aria-label={persona.name}
                  >
                    {persona.emoji}
                  </span>

                  {/* Name/Micro-label */}
                  <span className="text-[9px] md:text-[10px] text-white dark:text-gray-900 font-medium text-center leading-tight uppercase tracking-wide whitespace-pre-line z-10">
                    {persona.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

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
