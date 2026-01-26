import Link from "next/link";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { PageHeaderServer } from "@/components/PageHeaderServer";

export default function PrivacyPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="Our privacy policy explains how we collect, use, and protect your personal information when you use OnlyHockey.com. We are committed to protecting your privacy and ensuring transparency about our data practices."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header */}
        <PageHeaderServer
          title="Privacy Policy"
          subtitle="Our privacy policy explains how we collect, use, and protect your personal information when you use OnlyHockey.com. We are committed to protecting your privacy and ensuring transparency about our data practices."
          emoji="🔒"
        />

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            Your privacy matters to us. Here&apos;s how we protect and handle
            your information.
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-12">
            <strong>Effective Date:</strong> September 9, 2025
          </p>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Account Information:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Name, email address, and profile preferences when you create
                  an account.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Usage Data:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  How you interact with our content, sharing patterns, and
                  browsing behavior.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Device Information:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Browser type, device type, and basic technical information.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Payment Information:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Credit card details for purchases (processed securely through
                  third-party payment processors).
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>
                Provide and improve our OnlyHockey.com content and services.
              </li>
              <li>Process purchases and deliver digital products.</li>
              <li>
                Send important updates about your account and our services.
              </li>
              <li>Analyze usage to improve your user experience.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Information Sharing
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We don&apos;t sell your personal information. We may share data
              with:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Service Providers:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Payment processors, email services, and analytics tools.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Legal Requirements:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  When required by law or to protect our rights.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Business Transfers:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  In the event of a merger or acquisition of OnlyHockey.com.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Rights
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Access, update, or delete your personal information.</li>
              <li>Opt out of marketing communications.</li>
              <li>Request data portability.</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Cookies
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              We use cookies to improve your experience, analyze usage, and
              remember your preferences. You can control cookie settings in your
              browser.
            </p>
          </section>
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
