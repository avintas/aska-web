"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LandingCarousel } from "@/components/LandingCarousel";

// Cell display type: A = icon-only, B = icon + micro-label, C = icon + badge
type CellDisplayType = "A" | "B" | "C";

// Define cell configuration type
interface CellConfig {
  id: number;
  href?: string;
  icon: string; // Emoji or path to custom icon
  iconAlt: string; // Accessibility description
  title: string; // Full title shown in preview
  description: string; // Full description for preview modal
  displayType: CellDisplayType; // A, B, or C
  microLabel?: string; // For Option B: tiny text below icon
  badge?: string; // For Option C: badge text (e.g., "FREE", "FACTS", "NEW")
  badgeColor?: string; // Badge color class
  isHighlighted?: boolean;
}

export default function Home(): JSX.Element {
  const router = useRouter();
  const [previewCell, setPreviewCell] = useState<CellConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Newsletter form state
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Old grid cells code removed - using carousel now
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unusedCells: CellConfig[] = Array.from({ length: 25 }, (_, i) => {
    const id = i + 1;

    // Default config
    let config: CellConfig = {
      id,
      icon: "",
      iconAlt: "",
      title: "",
      description: "",
      displayType: "A",
    };

    // Configure specific cells
    switch (id) {
      // Row 1: Top of Pyramid (1 item)
      // Option C: Icon + Badge
      case 3:
        config = {
          id,
          href: "/trivia-arena",
          icon: "🎯", // Target icon - replace with custom hockey trivia icon
          iconAlt: "Trivia Arena",
          title: "Trivia Arena",
          description:
            "Play hockey trivia games and challenge yourself with multiple choice and true/false questions. Test your knowledge and compete with friends!",
          displayType: "C",
          microLabel: "PLAY\nTRIVIA ARENA",
          badge: "PLAY",
          badgeColor: "bg-green-500",
          isHighlighted: true,
        };
        break;

      // Row 2: Middle of Pyramid (2 items)
      // Option C: Icon + Badge
      case 7:
        config = {
          id,
          href: "/motivators",
          icon: "🏒",
          iconAlt: "Motivators",
          title: "Motivators!",
          description:
            "Get motivated with daily inspiration from hockey legends.",
          displayType: "C",
          microLabel: "Motivators!",
          badge: "SHARE",
          badgeColor: "bg-blue-500",
          isHighlighted: true,
        };
        break;
      // Option A: Icon-only
      case 9:
        config = {
          id,
          href: "/did-you-know",
          icon: "💡", // Did You Know
          iconAlt: "Did You Know",
          title: "Did You Know?",
          description:
            "Discover interesting facts and curiosities from hockey past and present. Expand your hockey knowledge with fascinating trivia!",
          displayType: "C",
          microLabel: "Academy",
          badge: "PRACTICE",
          badgeColor: "bg-blue-500",
          isHighlighted: true,
        };
        break;

      // Row 3: Bottom of Pyramid (3 items)
      // Option C: Icon + Badge
      case 11:
        config = {
          id,
          href: "/captain-heart",
          icon: "💙", // Captain Heart
          iconAlt: "Captain Heart (Blue Heart)",
          title: "Captain Heart",
          description:
            "Daily motivation messages from your Captain Heart. Quick, uplifting notes you can read or share anytime you need a boost.",
          displayType: "C",
          microLabel: "Captain Heart",
          badge: "SHARE",
          badgeColor: "bg-purple-500",
          isHighlighted: true,
        };
        break;
      // Option B: Icon + Micro-label
      case 13:
        config = {
          id,
          href: "/bench-boss",
          icon: "💪", // Bench Boss
          iconAlt: "Bench Boss (Bicep)",
          title: "Bench Boss",
          description:
            "Daily motivation messages from your Bench Boss. Strong, no-nonsense reminders to stay focused, train hard, and lead the shift.",
          displayType: "C",
          microLabel: "Bench Boss",
          badge: "SHARE",
          badgeColor: "bg-orange-500",
          isHighlighted: true,
        };
        break;
      // Option A: Icon-only
      case 15:
        config = {
          id,
          href: "/rink-philosopher",
          icon: "🎓", // Rink Philosopher (graduation cap)
          iconAlt: "Rink Philosopher (Graduation Cap)",
          title: "Rink Philosopher",
          description:
            "Wisdom and mindset lessons from the Rink Philosopher. Thoughtful takes to reset, refocus, and level up your game.",
          displayType: "C",
          microLabel: "Philosopher",
          badge: "SHARE",
          badgeColor: "bg-indigo-500",
          isHighlighted: true,
        };
        break;

      // Row 4: Fourth row of Pyramid (2 items)
      // Option C: Icon + Badge
      case 17:
        config = {
          id,
          href: "/hockey-culture",
          icon: "📜", // Hockey Culture
          iconAlt: "Hockey Culture",
          title: "Hockey Culture",
          description:
            "Explore the unwritten rules and traditions of hockey culture. Learn about the code that players live by on and off the ice.",
          displayType: "C",
          microLabel: "Hockey Culture",
          badge: "LEARN",
          badgeColor: "bg-teal-500",
          isHighlighted: true,
        };
        break;
      // Option C: Icon + Badge
      case 19:
        config = {
          id,
          href: "/legends",
          icon: "⭐", // Legends
          iconAlt: "Legends",
          title: "Legends",
          description:
            "Celebrate the greatest players and moments in hockey history. Discover the stories that shaped the game.",
          displayType: "C",
          microLabel: "Legends",
          badge: "EXPLORE",
          badgeColor: "bg-yellow-500",
          isHighlighted: true,
        };
        break;

      // Row 5: Fifth row of grid (5 items)
      // Option A: Icon-only
      case 21:
        config = {
          id,
          icon: "",
          iconAlt: "",
          title: "",
          description: "",
          displayType: "A",
        };
        break;
      // Option A: Icon-only
      case 22:
        config = {
          id,
          icon: "",
          iconAlt: "",
          title: "",
          description: "",
          displayType: "A",
        };
        break;
      // Option C: Icon + Badge
      case 23:
        config = {
          id,
          href: "/shop",
          icon: "🛍️", // Store
          iconAlt: "Shop (Store)",
          title: "Shop",
          description:
            "Browse our collection of hockey merchandise and gear. Show your love for the game with official OnlyHockey products!",
          displayType: "C",
          microLabel: "Store",
          badge: "COMING SOON",
          badgeColor: "bg-gray-500",
          isHighlighted: true,
        };
        break;
      // Option A: Icon-only
      case 24:
        config = {
          id,
          icon: "",
          iconAlt: "",
          title: "",
          description: "",
          displayType: "A",
        };
        break;
      // Option A: Icon-only
      case 25:
        config = {
          id,
          icon: "",
          iconAlt: "",
          title: "",
          description: "",
          displayType: "A",
        };
        break;

      default:
        // Standard numbered cells
        config = {
          id,
          icon: "",
          iconAlt: "",
          title: "",
          description: "",
          displayType: "A",
        };
    }

    return config;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unusedHandleCellClick = (
    cell: CellConfig,
    e: React.MouseEvent,
  ): void => {
    if (!cell.isHighlighted || !cell.href) return;

    // Motivator cells, Did You Know, Trivia Arena, and Shop navigate directly without modal preview
    const directNavHrefs = [
      "/captain-heart",
      "/bench-boss",
      "/rink-philosopher",
      "/motivators",
      "/did-you-know",
      "/trivia-arena",
      "/shop",
    ];
    if (cell.id === 7 || directNavHrefs.includes(cell.href)) {
      router.push(cell.href);
      return;
    }

    // Check if this is the second click (preview already shown)
    if (showPreview && previewCell?.id === cell.id) {
      // Navigate to the page
      router.push(cell.href);
      return;
    }

    // First click: show preview
    e.preventDefault();
    setPreviewCell(cell);
    setShowPreview(true);
  };

  const handleClosePreview = (): void => {
    setShowPreview(false);
    setPreviewCell(null);
  };

  const handleNavigate = (href: string): void => {
    router.push(href);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setMessage(null);

    // Basic client-side validation
    if (!email.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your email address",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Thanks for subscribing!",
        });
        setEmail(""); // Clear the form
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 md:px-6 lg:px-8 py-8 md:py-12">
      {/* Centered Content Container */}
      <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-7xl">
        {/* OnlyHockey Branding - Above the grid */}
        <div className="flex flex-col items-center gap-3 md:gap-4 max-w-4xl w-full">
          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white text-center leading-tight">
            There Is Only Hockey!
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

        {/* Landing Carousel - Replaces both mobile and desktop grids */}
        <LandingCarousel className="w-full" />

        {/* Preview Modal - Mobile-first full screen */}
        {showPreview && previewCell && (
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200"
            onClick={handleClosePreview}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-[90vw] md:max-w-md lg:max-w-lg w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 md:gap-4">
                  <span
                    className="text-3xl md:text-4xl lg:text-5xl"
                    role="img"
                    aria-label={previewCell.iconAlt}
                  >
                    {previewCell.icon}
                  </span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {previewCell.title}
                    </h2>
                    {previewCell.badge &&
                      previewCell.href !== "/trivia-arena" && (
                        <span
                          className={`inline-block mt-1 ${previewCell.badgeColor || "bg-blue-500"} text-white text-xs font-bold px-2 py-1 rounded-full uppercase`}
                        >
                          {previewCell.badge}
                        </span>
                      )}
                  </div>
                </div>
                <button
                  onClick={handleClosePreview}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2"
                  aria-label="Close preview"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 md:p-6">
                {/* Show Trivia Arena image if this is the Trivia Arena cell */}
                {previewCell.href === "/trivia-arena" && (
                  <div className="mb-4 md:mb-6 flex justify-center">
                    <img
                      src="/trivia_arena_2.png"
                      alt="Trivia Arena"
                      className="w-full max-w-md rounded-lg shadow-md"
                    />
                  </div>
                )}
                {/* Show Captain Heart image if this is the Captain Heart cell */}
                {previewCell.href === "/captain-heart" && (
                  <div className="mb-4 md:mb-6 flex justify-center">
                    <img
                      src="/captain_heart_1.webp"
                      alt="Captain Heart"
                      className="w-full max-w-md rounded-lg shadow-md"
                    />
                  </div>
                )}
                <p className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {previewCell.description}
                </p>
              </div>

              {/* Modal Footer - Navigation Button */}
              {previewCell.href && (
                <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleNavigate(previewCell.href!)}
                    className="w-full px-4 py-3 md:px-6 md:py-4 text-sm md:text-base lg:text-lg bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 touch-manipulation"
                  >
                    <span>Explore {previewCell.title}</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                    Tap again to explore, or close to browse more
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call to Action - Play Now */}
        <div className="flex flex-col items-center gap-10 mt-12">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Play?
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Tap any game above to start playing — no sign-up needed!
            </p>
          </div>

          {/* Newsletter Sign-Up - Low-key */}
          <div className="w-full max-w-md pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 mb-5">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Want hockey trivia updates?
              </p>
              {/* Live Indicator Badge */}
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wide animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </span>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm rounded-lg bg-gray-700 dark:bg-gray-600 text-white font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </div>

              {/* Success/Error Messages */}
              {message && (
                <div
                  className={`text-sm text-center px-3 py-2 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </form>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
              No spam, just hockey. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
