import Link from "next/link";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { PageHeaderServer } from "@/components/PageHeaderServer";

export default function FAQPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="Everything you need to know about OnlyHockey.com and our hockey content. Find answers to common questions about trivia games, motivational quotes, factoids, and more."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header */}
        <PageHeaderServer
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about OnlyHockey.com and our hockey content. Find answers to common questions about trivia games, motivational quotes, factoids, and more."
          emoji="❓"
        />

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-12">
            Everything you need to know about OnlyHockey.com and our hockey
            content.
          </p>

          {/* FAQ Items */}
          <div className="space-y-8">
            {/* What is OnlyHockey.com? */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                What is OnlyHockey.com?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                OnlyHockey.com is hosts shareable hockey content including
                factoids and trivia, motivational quotes, and stats.
              </p>
            </section>

            {/* How can I share content? */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                How can I share content from the site?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Most of our content includes built-in sharing features. Look for
                share icons on individual stories and posts that allow you to
                share via your device&apos;s native sharing options or copy
                content to your clipboard.
              </p>
            </section>

            {/* Is the content free to use? */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Is the content free to use?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                You may share our content on social media with proper
                attribution and use small excerpts for educational or commentary
                purposes. For commercial use or large portions of content,
                please contact us for licensing information.
              </p>
            </section>

            {/* How do I contact support? */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                How do I contact support?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                You can reach us at{" "}
                <a
                  href="mailto:team@onlyhockey.com"
                  className="text-blue-600 dark:text-orange-500 hover:underline"
                >
                  team@onlyhockey.com
                </a>{" "}
                for general inquiries.
              </p>
            </section>

            {/* What's the history behind OnlyHockey.com? */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                What&apos;s the history behind OnlyHockey.com?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                OnlyHockey.com began in the mid-2000s as an e-commerce platform.
                We were pioneers in publishing comprehensive hockey stick
                pattern databases and providing &quot;pro-returns&quot; - actual
                professional equipment used by the pros. Today, we focus on
                creating engaging hockey content for fans.
              </p>
            </section>

            {/* How often is new content added? */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                How often is new content added?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                We regularly update our content with new hockey stories, trivia,
                and motivational content. Follow us to stay updated with the
                latest additions from our crew members.
              </p>
            </section>

            {/* Can I suggest content ideas? */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Can I suggest content ideas?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Absolutely! We love hearing from our community. Send your
                content suggestions, story ideas, or feedback to{" "}
                <a
                  href="mailto:team@onlyhockey.com"
                  className="text-blue-600 dark:text-orange-500 hover:underline"
                >
                  team@onlyhockey.com
                </a>{" "}
                and we&apos;ll consider them for future content.
              </p>
            </section>
          </div>
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
