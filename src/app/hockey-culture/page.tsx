"use client";

import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { PageHeader } from "@/components/PageHeader";

export default function HockeyCulturePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="Explore the unwritten rules and traditions of hockey culture. Learn about the code that players live by on and off the ice."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header Section */}
        <PageHeader
          title="Hockey Culture"
          subtitle="Explore the unwritten rules and traditions of hockey culture. Learn about the code that players live by on and off the ice."
          emoji="📜"
        />

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
