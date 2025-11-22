export default function PBPPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">💭</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              P.B.P.
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Penalty Box Philosopher — Wisdom and insights from the game of
            hockey.
          </p>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mt-2 italic">
            Also known as the Wisdom Table
          </p>
        </div>

        {/* Content Placeholder */}
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Philosophical wisdom and deep insights from hockey&apos;s greatest
            minds.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-base">
            Content coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
