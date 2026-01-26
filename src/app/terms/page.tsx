import Link from "next/link";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { PageSlogan } from "@/components/PageSlogan";

export default function TermsPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="Our terms of service outline the rules and guidelines for using OnlyHockey.com. By using our site, you agree to these terms. Please read them carefully to understand your rights and responsibilities."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">
            Terms of Service
          </h1>
          <PageSlogan />
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            The terms and conditions for using OnlyHockey.com services.
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-12">
            <strong>Effective Date:</strong> September 9, 2025
          </p>

          {/* Acceptance of Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              By using OnlyHockey.com, you agree to these Terms of Service. If
              you don&apos;t agree, please don&apos;t use our services.
            </p>
          </section>

          {/* Description of Service */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Description of Service
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              OnlyHockey.com provides shareable hockey content, including
              factoids, statistics, motivational content, and digital products
              for hockey fans.
            </p>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              User Accounts
            </h2>
            <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>
                You must provide accurate information when creating an account.
              </li>
              <li>You&apos;re responsible for maintaining account security.</li>
              <li>One account per person.</li>
              <li>
                You must be 13 years or older to create an account (users under
                18 require parental consent).
              </li>
            </ul>
          </section>

          {/* Content and Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Content and Intellectual Property
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Our Content:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  All OnlyHockey.com content is protected by copyright and is
                  owned by us.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Your Use:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  You may share our content for personal, non-commercial use
                  with proper attribution.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Prohibited Uses:
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  You may not commercially redistribute, modify, or claim
                  ownership of our content.
                </p>
              </div>
            </div>
          </section>

          {/* User Conduct */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              User Conduct
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Post harmful, offensive, or inappropriate content.</li>
              <li>Harass other users or spread misinformation.</li>
              <li>Attempt to hack or disrupt our services.</li>
              <li>Use our platform for illegal activities.</li>
            </ul>
          </section>

          {/* Purchases and Refunds */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Purchases and Refunds
            </h2>
            <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Digital products are delivered immediately upon purchase.</li>
              <li>Physical products ship within 5-7 business days.</li>
              <li>
                Refunds are available within 30 days for unused digital
                products.
              </li>
              <li>
                Physical products may be returned within 30 days in original
                condition.
              </li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Disclaimers
            </h2>
            <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>
                OnlyHockey.com content is for entertainment and educational
                purposes.
              </li>
              <li>
                We don&apos;t guarantee the accuracy of all statistical
                information.
              </li>
              <li>
                Services are provided &quot;as is&quot; without warranties.
              </li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Limitation of Liability
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              OnlyHockey.com&apos;s liability is limited to the amount you paid
              for our services in the past 12 months.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Changes to Terms
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update these terms with 30 days&apos; notice. Your
              continued use of our services constitutes your acceptance of the
              new terms.
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
