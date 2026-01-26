import { PageSloganServer } from "@/components/PageSloganServer";

export default function MyRecordsPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">📊</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">
              My Records
            </h1>
          </div>
          <PageSloganServer />
          <div className="max-w-2xl mx-auto mt-4">
            <p className="text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              View your personal records, achievements, and statistics.
            </p>
          </div>
        </div>

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
