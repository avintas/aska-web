import Link from "next/link";
import { PageNavigationButtons } from "@/components/PageNavigationButtons";

export default function AboutPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Circular Navigation Menu */}
        <div className="mb-6 md:mb-8">
          <PageNavigationButtons
            homeLabel="Home"
            homeHref="/"
            infoTitle="Info"
            infoContent="We launched OnlyHockey as a tribute to the great Game of Hockey. You can challenge yourself and your friends with hockey trivia games, support people you care about with H.U.G.s, and find and share motivational quotes from legendary players and epic coaches as well as interesting facts, anecdotes, and curiosities of hockey culture."
            extrasTitle="Extras"
            extrasContent="Settings and other options coming soon..."
          />
        </div>

        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">
            About OnlyHockey
          </h1>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              We launched OnlyHockey as a tribute to the great Game of Hockey.
              You can challenge yourself and your friends with hockey trivia
              games, support people you care about with H.U.G.s You can find and
              share motivational quotes from legendary players and epic coaches
              as well as interesting facts, anecdotes, curiosities of hockey
              culture, all that we call hockey lore. We hope you will discover
              what makes our hockey community so special. Whether you are here
              for the stories, the stats, or the pure joy of the game, you
              belong here. 🏠✨
            </p>
          </section>

          {/* Our Mission */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              To create a fun, engaging, and safe community where players, fans,
              and parents can learn, play, and connect.
            </p>
          </section>

          {/* What We Do */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What We Do
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              We operate hockey themed trivia games site, where fans can enjoy
              bite-sized, shareable hockey themed safe content. We want to bring
              you engaging, easily shareable content in formats perfect for
              social media and fan conversations.
            </p>
          </section>

          {/* Who We Serve */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Who We Serve
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              We serve passionate hockey fans, the families who support them,
              and players at every level of the game. Whether you&apos;re a
              young Mini Mite, a Tier 1 (AAA) standout, a high school player, or
              a &quot;beer leaguer&quot; who just loves the sport, our community
              is for you. We also welcome the parents, grandparents, and family
              members who want to support and motivate their loved ones with
              content that celebrates the values and spirit of hockey.
            </p>
          </section>

          {/* Our Vision */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Vision
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Hockey deserves content as dynamic and engaging as the sport
              itself. We&apos;re building a community where fans can discover,
              enjoy, and share the stories that make hockey the greatest game on
              earth.
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
