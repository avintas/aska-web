import Link from "next/link";

export default function EthosPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Ethos
          </h1>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              The ethos of OnlyHockey is built on the core values that make
              hockey the greatest game on earth. We believe in respect,
              teamwork, perseverance, and the pure love of the game.
            </p>
          </section>

          {/* Core Values */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Respect
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  We honor the game, our opponents, our teammates, and
                  ourselves. Respect is the foundation of everything we do.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Teamwork
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Hockey teaches us that we are stronger together. We celebrate
                  the collective effort and the bonds forged on and off the ice.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Perseverance
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  The game demands resilience. We embrace challenges, learn from
                  setbacks, and always get back up.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Love for the Game
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  At the heart of it all is passion. Whether you&apos;re playing
                  in the NHL or on a frozen pond, the love for hockey unites us
                  all.
                </p>
              </div>
            </div>
          </section>

          {/* Community */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Community
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              We are a community that welcomes everyone who shares our passion
              for hockey. From Mini Mites to beer leaguers, from parents to
              grandparents, from players to fans—if you love the game, you
              belong here. We create safe, positive spaces where the hockey
              community can connect, learn, and grow together.
            </p>
          </section>

          {/* Commitment */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Commitment
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              We are committed to creating content and experiences that reflect
              the best of hockey culture. We celebrate the sport&apos;s rich
              history, its legendary figures, and the values that make it
              special. Every piece of content we create is designed to inspire,
              educate, and bring joy to the hockey community.
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
