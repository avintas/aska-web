import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { PageHeaderServer } from "@/components/PageHeaderServer";

export default function MyRecordsPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="View your personal records, achievements, and statistics."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header */}
        <PageHeaderServer
          title="My Records"
          subtitle="View your personal records, achievements, and statistics."
          emoji="📊"
        />

        {/* Content Placeholder */}
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            My Records content coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
