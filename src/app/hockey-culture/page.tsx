"use client";

import { PageSlogan } from "@/components/PageSlogan";

export default function HockeyCulturePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <span className="text-4xl md:text-5xl lg:text-6xl">📜</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">
              Hockey Culture
            </h1>
          </div>
          <PageSlogan />
          <div className="max-w-2xl mx-auto mt-4">
            <p className="text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              Explore the unwritten rules and traditions of hockey culture.
              Learn about the code that players live by on and off the ice.
            </p>
          </div>
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
