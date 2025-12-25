import { HubCell } from "@/components/HubGrid";

export interface CarouselCard {
  id: number;
  title?: string;
  cells: (HubCell | null)[];
}

// Helper function to create inactive cell with image
function createInactiveCell(imageNumber: number): HubCell {
  return {
    id: `inactive-${imageNumber}`,
    name: "",
    emoji: "",
    inactiveImage: `/HCIP-${imageNumber}.png`, // Adjust extension if needed (.jpg, .webp, etc.)
  };
}

/**
 * Carousel Cards Configuration
 *
 * Each card contains a 5x3 grid (15 cells total)
 * Cells are positioned using row/column indices:
 * - Row 0-2 (top to bottom)
 * - Column 0-4 (left to right)
 *
 * Use null for empty cells to create custom layouts
 * (checkerboard, diamond, 3-in-a-row, etc.)
 */
export const carouselCards: CarouselCard[] = [
  // Card 1: Landing Page - Diamond Layout with inactive cells
  {
    id: 1,
    title: "Hub Selector",
    cells: [
      createInactiveCell(1), // Row 0, Col 0
      createInactiveCell(2), // Row 0, Col 1
      {
        id: "trivia-arena",
        name: "PLAY\nTRIVIA ARENA",
        emoji: "🎯",
        href: "/trivia-arena",
        description: "Play hockey trivia games",
        badge: "PLAY",
        badgeColor: "bg-green-500",
      }, // Row 0, Col 2 (top center)
      createInactiveCell(3), // Row 0, Col 3
      createInactiveCell(4), // Row 0, Col 4
      createInactiveCell(5), // Row 1, Col 0
      {
        id: "motivators",
        name: "MOTIVATORS!",
        emoji: "🏒",
        href: "/motivators",
        description: "Get motivated with daily inspiration",
        badge: "SHARE",
        badgeColor: "bg-blue-500",
      }, // Row 1, Col 1
      createInactiveCell(6), // Row 1, Col 2
      {
        id: "did-you-know",
        name: "DID YOU\nKNOW?",
        emoji: "💡",
        href: "/did-you-know",
        description: "Discover interesting hockey facts",
        badge: "FACTS",
        badgeColor: "bg-yellow-500",
      }, // Row 1, Col 3
      createInactiveCell(7), // Row 1, Col 4
      createInactiveCell(8), // Row 2, Col 0
      createInactiveCell(9), // Row 2, Col 1
      {
        id: "shop",
        name: "STORE",
        emoji: "🛍️",
        href: "/shop",
        description: "Hockey merchandise and products",
        badge: "SHOP",
        badgeColor: "bg-purple-500",
      }, // Row 2, Col 2 (bottom center)
      createInactiveCell(10), // Row 2, Col 3
      createInactiveCell(11), // Row 2, Col 4
    ],
  },

  // Card 2: Trivia Arena Page Grid
  {
    id: 2,
    title: "Trivia Arena",
    cells: [
      null, // Row 0, Col 0
      null, // Row 0, Col 1
      {
        id: "bench-boss-trivia",
        name: "Bench Boss",
        emoji: "💪",
        href: "/trivia-arena/bench-boss",
        description: "Trivia challenges from Bench Boss",
      }, // Row 0, Col 2
      null, // Row 0, Col 3
      null, // Row 0, Col 4
      null, // Row 1, Col 0
      {
        id: "captain-heart-trivia",
        name: "Captain Heart",
        emoji: "💙",
        href: "/trivia-arena/captain-heart",
        description: "Trivia challenges from Captain Heart",
      }, // Row 1, Col 1
      {
        id: "stats-master",
        name: "Stats Master",
        emoji: "📊",
        href: "/trivia-arena/stats-master",
        description: "Statistics and records trivia",
      }, // Row 1, Col 2
      {
        id: "historian",
        name: "Historian",
        emoji: "📜",
        href: "/trivia-arena/historian",
        description: "Historical trivia and facts",
      }, // Row 1, Col 3
      null, // Row 1, Col 4
      null, // Row 2, Col 0
      {
        id: "the-ref",
        name: "The Ref",
        emoji: "⚖️",
        href: "/trivia-arena/the-ref",
        description: "Rules and regulations trivia",
      }, // Row 2, Col 1
      null, // Row 2, Col 2
      {
        id: "rink-philosopher-trivia",
        name: "Rink Philosopher",
        emoji: "🎓",
        href: "/trivia-arena/rink-philosopher",
        description: "Wisdom and knowledge trivia",
      }, // Row 2, Col 3
      null, // Row 2, Col 4
    ],
  },

  // Card 3: Pass Around (Motivators) Page Grid
  {
    id: 3,
    title: "Pass Around",
    cells: [
      null, // Row 0, Col 0
      null, // Row 0, Col 1
      null, // Row 0, Col 2
      null, // Row 0, Col 3
      null, // Row 0, Col 4
      null, // Row 1, Col 0
      {
        id: "bench-boss-motivators",
        name: "Bench Boss",
        emoji: "💪",
        href: "/bench-boss",
        description:
          "Daily motivation messages from your Bench Boss. Strong, no-nonsense reminders to stay focused, train hard, and lead the shift.",
        badge: "SHARE",
        badgeColor: "bg-orange-500",
      }, // Row 1, Col 1
      {
        id: "captain-heart-motivators",
        name: "Captain Heart",
        emoji: "💙",
        href: "/captain-heart",
        description:
          "Daily motivation messages from your Captain Heart. Quick, uplifting notes you can read or share anytime you need a boost.",
        badge: "SHARE",
        badgeColor: "bg-purple-500",
      }, // Row 1, Col 2
      {
        id: "rink-philosopher-motivators",
        name: "Rink Philosopher",
        emoji: "🎓",
        href: "/rink-philosopher",
        description:
          "Wisdom and mindset lessons from the Rink Philosopher. Thoughtful takes to reset, refocus, and level up your game.",
        badge: "SHARE",
        badgeColor: "bg-indigo-500",
      }, // Row 1, Col 3
      null, // Row 1, Col 4
      null, // Row 2, Col 0
      null, // Row 2, Col 1
      null, // Row 2, Col 2
      null, // Row 2, Col 3
      null, // Row 2, Col 4
    ],
  },

  // Card 4: Store Card
  {
    id: 4,
    title: "Store",
    cells: [
      null, // Row 0, Col 0
      null, // Row 0, Col 1
      null, // Row 0, Col 2
      null, // Row 0, Col 3
      null, // Row 0, Col 4
      null, // Row 1, Col 0
      null, // Row 1, Col 1
      {
        id: "shop-store",
        name: "STORE",
        emoji: "🛍️",
        href: "/shop",
        description:
          "Browse our collection of hockey merchandise and gear. Show your love for the game with official OnlyHockey products!",
        badge: "COMING SOON",
        badgeColor: "bg-gray-500",
      }, // Row 1, Col 2 (center)
      null, // Row 1, Col 3
      null, // Row 1, Col 4
      null, // Row 2, Col 0
      null, // Row 2, Col 1
      null, // Row 2, Col 2
      null, // Row 2, Col 3
      null, // Row 2, Col 4
    ],
  },
];
