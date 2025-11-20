import Link from "next/link";

export default function ShopPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Shop
          </h1>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-20">
          <div className="mb-8">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Coming Soon
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Our storefront is under construction. Check back soon for exclusive
            OnlyHockey merchandise and digital products!
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-blue-600 dark:bg-orange-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
