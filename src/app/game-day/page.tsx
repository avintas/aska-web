"use client";

export default function GameDayPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🏒</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              Game Day
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Messages and support for every moment of your game day journey.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Good Luck Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
            <div className="text-center mb-4">
              <div className="mb-2">
                <span className="text-4xl">🍀</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                Good Luck
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center italic">
              The pre-game jitters text
            </p>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-center">
                Content for pre-game encouragement and calming pre-game nerves
                coming soon...
              </p>
            </div>
          </div>

          {/* I'm Proud Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
            <div className="text-center mb-4">
              <div className="mb-2">
                <span className="text-4xl">❤️</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                I&apos;m Proud
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center italic">
              The unconditional love text
            </p>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-center">
                Content expressing unconditional love and pride coming soon...
              </p>
            </div>
          </div>

          {/* Bounce Back Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
            <div className="text-center mb-4">
              <div className="mb-2">
                <span className="text-4xl">💪</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                Bounce Back
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center italic">
              The text after a tough period or loss
            </p>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-center">
                Content for resilience and bouncing back after setbacks coming
                soon...
              </p>
            </div>
          </div>

          {/* Celebration Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
            <div className="text-center mb-4">
              <div className="mb-2">
                <span className="text-4xl">🎉</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                Celebration
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center italic">
              The text after a win
            </p>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-center">
                Content for celebrating victories and achievements coming
                soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
