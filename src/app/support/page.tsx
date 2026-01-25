import Link from "next/link";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";

export default function SupportPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="Everything you need to know about refunds, copyright, and getting help. We're here to support you and ensure the best experience on OnlyHockey.com."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">
            Support
          </h1>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            Everything you need to know about refunds, copyright, and getting
            help.
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            <strong>Effective Date:</strong> September 09, 2025
          </p>

          {/* Reporting Copyright Infringement */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Reporting Copyright Infringement
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you believe your copyrighted work has been used without
              permission, contact us with:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Description of the copyrighted work</li>
              <li>Location of the allegedly infringing content</li>
              <li>Your contact information</li>
              <li>Good faith statement that use is not authorized</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Email Support
                </h3>
                <a
                  href="mailto:team@onlyhockey.com"
                  className="text-lg text-blue-600 dark:text-orange-500 hover:underline"
                >
                  team@onlyhockey.com
                </a>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Business Hours
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Monday-Friday, 9 AM - 5 PM PST
                </p>
              </div>
            </div>
          </section>

          <p className="text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-8">
            <strong>Last Updated:</strong> September 09, 2025
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            These policies apply to all OnlyHockey.com services and may be
            updated periodically.
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
