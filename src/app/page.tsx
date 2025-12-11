import Link from "next/link";
import Image from "next/image";

// Define cell configuration type
interface CellConfig {
  id: number;
  href?: string;
  label?: React.ReactNode;
  imageSrc?: string; // Support for future images
  isHighlighted?: boolean;
}

export default function Home(): JSX.Element {
  // Create configuration for the 15 cells
  const cells: CellConfig[] = Array.from({ length: 15 }, (_, i) => {
    const id = i + 1;

    // Default config
    let config: CellConfig = { id };

    // Configure specific cells
    switch (id) {
      // Row 1: Top of Pyramid (1 item)
      case 3:
        config = {
          id,
          href: "/trivia-arena",
          label: (
            <span className="text-sm md:text-base font-bold text-white text-center z-10 relative">
              Trivia
              <br />
              Arena
            </span>
          ),
          isHighlighted: true,
          // imageSrc: '/images/trivia-thumb.jpg' // Placeholder for future use
        };
        break;

      // Row 2: Middle of Pyramid (2 items)
      case 7:
        config = {
          id,
          href: "/game-day",
          label: (
            <span className="text-sm md:text-base font-bold text-white text-center z-10 relative">
              Game
              <br />
              Day
            </span>
          ),
          isHighlighted: true,
        };
        break;
      case 9:
        config = {
          id,
          href: "/game-plan-strategy",
          label: (
            <span className="text-sm md:text-base font-bold text-white text-center z-10 relative">
              Game
              <br />
              Plan
            </span>
          ),
          isHighlighted: true,
        };
        break;

      // Row 3: Bottom of Pyramid (3 items)
      case 11:
        config = {
          id,
          href: "/did-you-know",
          label: (
            <span className="text-sm md:text-base font-bold text-white text-center z-10 relative">
              Did
              <br />
              You
              <br />
              Know?
            </span>
          ),
          isHighlighted: true,
        };
        break;
      case 13:
        config = {
          id,
          href: "/shop",
          label: (
            <span className="text-sm md:text-base font-bold text-white text-center z-10 relative">
              Shop
            </span>
          ),
          isHighlighted: true,
          // imageSrc: '/images/shop-thumb.jpg'
        };
        break;
      case 15:
        config = {
          id,
          href: "/locker-room",
          label: (
            <span className="text-sm md:text-base font-bold text-white text-center z-10 relative">
              Locker
              <br />
              Room
            </span>
          ),
          isHighlighted: true,
        };
        break;

      default:
        // Standard numbered cells
        config = { id };
    }

    return config;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      {/* Centered Content Container */}
      <div className="flex flex-col items-center gap-8">
        {/* OnlyHockey Branding - Above the grid */}
        <div className="flex flex-col items-center gap-4 max-w-4xl px-4">
          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white text-center leading-tight">
            There Is
            <br />
            Only Hockey!
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-sm text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-wider text-center">
            L❤️VE FOR THE GAME IS ALL YOU NEED
          </p>

          {/* Description */}
          <p className="text-base md:text-md text-gray-700 dark:text-gray-300 leading-relaxed text-center">
            We launched OnlyHockey as a tribute to the great Game of Hockey.
            Here, you can immerse yourself in the curiosities of hockey culture
            and interesting facts from the sport&apos;s past and present.
            Challenge yourself and your friends to engaging hockey trivia and
            get a motivational boost from legendary coaches and iconic players.
            We hope you will discover what makes our hockey community so
            special. 🏠✨
          </p>
        </div>

        {/* 5x4 Grid Structure - Centered */}
        <div className="grid grid-cols-5 gap-0 border border-gray-300 dark:border-gray-700">
          {cells.map((cell) => (
            <div
              key={cell.id}
              className={`relative w-32 h-32 border border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden ${
                cell.isHighlighted
                  ? "bg-navy-900 dark:bg-orange-500 cursor-pointer hover:opacity-90 transition-opacity"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              {cell.isHighlighted ? (
                <Link
                  href={cell.href || "#"}
                  className="w-full h-full flex items-center justify-center px-2 relative"
                  aria-label={`Navigate to feature ${cell.id}`}
                >
                  {/* Background Image (if provided) */}
                  {cell.imageSrc && (
                    <Image
                      src={cell.imageSrc}
                      alt=""
                      fill
                      className="object-cover opacity-50 hover:opacity-75 transition-opacity"
                    />
                  )}

                  {/* Content/Label */}
                  {cell.label}
                </Link>
              ) : (
                // Non-highlighted cells just show number
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {cell.id}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action - Sign Up */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">
            Sign up to PLAY
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 text-center">
            Join the OnlyHockey community and start playing today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500"
            />
            <button className="px-6 py-3 rounded-lg bg-blue-600 dark:bg-orange-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-orange-600 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
