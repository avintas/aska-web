"use client";

import { useState } from "react";

interface Directive {
  title: string;
  text: string;
  section: string;
}

const directives: Directive[] = [
  // THE GRIND
  {
    title: "The Standard",
    text: "You don't get the game you wish for. You get the game you work for. Earn your ice time.",
    section: "THE GRIND",
  },
  {
    title: "The Reality",
    text: "Talent is just the starting line. Grit is the engine that gets you to the finish.",
    section: "THE GRIND",
  },
  {
    title: "The Legs",
    text: "When your lungs burn, your legs feed the wolf. Keep moving.",
    section: "THE GRIND",
  },
  {
    title: "The Shadow Work",
    text: "Champions are built in the empty gym and the early morning rink. Love the work.",
    section: "THE GRIND",
  },
  // THE CREST
  {
    title: "The Golden Rule",
    text: "Play for the name on the front, not the name on the back.",
    section: "THE CREST",
  },
  {
    title: "The Mathematics",
    text: "An assist makes two people happy. A goal only makes one. Be a playmaker.",
    section: "THE CREST",
  },
  {
    title: "The Sacrifice",
    text: "Blocking a shot hurts for a minute. Letting in a goal hurts forever. Pay the price.",
    section: "THE CREST",
  },
  {
    title: "The Bond",
    text: "Great teams don't just play together. They suffer together and they win together.",
    section: "THE CREST",
  },
  // THE MENTAL GAME
  {
    title: "The Response",
    text: "It's not about the mistake you just made. It's about what you do on the very next shift. Reset.",
    section: "THE MENTAL GAME",
  },
  {
    title: "The Temperature",
    text: "Panic is contagious. So is calm. Be the one who settles the storm.",
    section: "THE MENTAL GAME",
  },
  {
    title: "The Definition",
    text: "Leadership isn't about being the best player on the ice. It's about making everyone around you better.",
    section: "THE MENTAL GAME",
  },
  {
    title: "The Focus",
    text: "Control the controllables: Your Effort. Your Attitude. Your Focus. Let the ref handle the rest.",
    section: "THE MENTAL GAME",
  },
];

export default function GamePlanStrategyPage(): JSX.Element {
  const [shuffledDirective, setShuffledDirective] = useState<Directive | null>(
    null,
  );
  const [isShuffling, setIsShuffling] = useState(false);

  const shuffleStrategy = (): void => {
    setIsShuffling(true);
    // Random delay for effect
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * directives.length);
      setShuffledDirective(directives[randomIndex]);
      setIsShuffling(false);
    }, 300);
  };

  const getSectionDirectives = (sectionName: string): Directive[] => {
    return directives.filter((d) => d.section === sectionName);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight">
            THE GAME PLAN
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-semibold mb-8">
            Strategy, mindset, and motivation to sharpen your competitive edge.
          </p>

          {/* Intro Text */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Hockey is 10% physical and 90% mental. Your gear is ready, but is
              your head in the game? This section is your daily briefing—a
              collection of strategies, directives, and reminders to help you
              set the standard, lead by example, and execute when it counts.
              Read it. Visualise it. Execute it.
            </p>
          </div>

          {/* Shuffle Strategy Button */}
          <button
            onClick={shuffleStrategy}
            disabled={isShuffling}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-black text-lg uppercase tracking-wider rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isShuffling ? "Shuffling..." : "Shuffle Strategy"}
          </button>
        </div>

        {/* Shuffled Directive Display */}
        {shuffledDirective && (
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-8 border-4 border-orange-500 shadow-2xl">
              <div className="text-center">
                <p className="text-orange-500 dark:text-orange-400 text-sm font-bold uppercase tracking-widest mb-4">
                  {shuffledDirective.section}
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-6 uppercase tracking-tight">
                  {shuffledDirective.title}
                </h2>
                <p className="text-xl md:text-2xl text-white font-bold leading-relaxed">
                  {shuffledDirective.text}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 1: THE GRIND */}
        <section className="mb-16">
          <div className="bg-gray-800 dark:bg-gray-900 rounded-lg p-8 md:p-12 border-2 border-gray-700">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 uppercase tracking-wide text-center">
              THE GRIND
            </h2>
            <p className="text-gray-400 text-center mb-8 italic">
              Work Ethic & Discipline
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getSectionDirectives("THE GRIND").map((directive, index) => (
                <div
                  key={index}
                  className="bg-gray-700 dark:bg-gray-800 rounded-lg p-6 border border-gray-600"
                >
                  <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wide">
                    {directive.title}
                  </h3>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {directive.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: THE CREST */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-900 via-red-900 to-blue-900 rounded-lg p-8 md:p-12 border-4 border-blue-700">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 uppercase tracking-wide text-center drop-shadow-lg">
              THE CREST
            </h2>
            <p className="text-blue-200 text-center mb-8 italic font-semibold">
              Teamwork & Sacrifice
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getSectionDirectives("THE CREST").map((directive, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-white/20"
                >
                  <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wide">
                    {directive.title}
                  </h3>
                  <p className="text-white text-lg leading-relaxed font-medium">
                    {directive.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: THE MENTAL GAME */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-100 rounded-lg p-8 md:p-12 border-4 border-gray-900 dark:border-gray-800 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 uppercase tracking-wide text-center">
              THE MENTAL GAME
            </h2>
            <p className="text-gray-600 text-center mb-8 italic font-semibold">
              Leadership & Composure
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getSectionDirectives("THE MENTAL GAME").map(
                (directive, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-white rounded-lg p-6 border-2 border-gray-300 dark:border-gray-400"
                  >
                    <h3 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-wide">
                      {directive.title}
                    </h3>
                    <p className="text-gray-800 text-lg leading-relaxed font-semibold">
                      {directive.text}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Optional: THE COACH'S CHALLENGE */}
        <section className="mb-8">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-8 border-2 border-orange-500">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-wide text-center">
              THE COACH&apos;S CHALLENGE
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-orange-300 dark:border-orange-700">
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
                TODAY&apos;S MISSION
              </p>
              <p className="text-lg md:text-xl text-gray-900 dark:text-white font-semibold">
                Be the first player to the loose puck in every corner today. No
                passengers.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
