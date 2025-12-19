"use client";

export default function HockeyCulturePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <span className="text-4xl md:text-5xl lg:text-6xl">📜</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
              Hockey Culture
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the unwritten rules and traditions of hockey culture. Learn
            about the code that players live by on and off the ice.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Content coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
