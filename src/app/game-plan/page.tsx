"use client";

export default function GamePlanPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Game Plan
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Your strategic guide to mastering the game of hockey.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Welcome to the Game Plan. This is where strategy meets passion,
              where tactics meet tradition. Here you&apos;ll find everything you
              need to elevate your understanding of the greatest game on ice.
            </p>
          </section>

          {/* Placeholder for future content */}
          <section className="mb-12">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Content coming soon...
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
