import { PageHeaderServer } from "@/components/PageHeaderServer";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";

export default function PBPPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="Rink Philosopher — Wisdom and insights from the game of hockey. Also known as the Wisdom Table."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header */}
        <PageHeaderServer
          title="P.B.P."
          subtitle="Rink Philosopher — Wisdom and insights from the game of hockey. Also known as the Wisdom Table."
          emoji="💭"
        />

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
