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
    inactiveImage: `/hcip-${imageNumber}.png`, // Adjust extension if needed (.jpg, .webp, etc.)
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
    title: "Explore",
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

  // Card 2: Trivia Arena - 15 trivia games (populated from source_content_sets)
  // This card will be dynamically populated with sets where set_type contains trivia types
  {
    id: 2,
    title: "Trivia Arena",
    cells: [
      // Placeholder cells - will be populated dynamically from database
      // Query: source_content_sets where set_type contains 'multiple_choice_trivia' or 'true_false_trivia' and active = true
      createInactiveCell(12), // Row 0, Col 0
      createInactiveCell(13), // Row 0, Col 1
      createInactiveCell(14), // Row 0, Col 2
      createInactiveCell(15), // Row 0, Col 3
      createInactiveCell(16), // Row 0, Col 4
      createInactiveCell(17), // Row 1, Col 0
      createInactiveCell(18), // Row 1, Col 1
      createInactiveCell(19), // Row 1, Col 2
      createInactiveCell(20), // Row 1, Col 3
      createInactiveCell(21), // Row 1, Col 4
      createInactiveCell(22), // Row 2, Col 0
      createInactiveCell(23), // Row 2, Col 1
      createInactiveCell(24), // Row 2, Col 2
      createInactiveCell(25), // Row 2, Col 3
      createInactiveCell(26), // Row 2, Col 4
    ],
  },

  // Card 3: Factoids (Did You Know) - 15 factoid sets (populated from source_content_sets)
  // This card will be dynamically populated with sets where set_type = 'factoid' and active = true
  {
    id: 3,
    title: "Did You Know?",
    cells: [
      // Placeholder cells - will be populated dynamically from database
      // Query: source_content_sets where set_type contains 'factoid' and active = true
      createInactiveCell(27), // Row 0, Col 0
      createInactiveCell(28), // Row 0, Col 1
      createInactiveCell(29), // Row 0, Col 2
      createInactiveCell(30), // Row 0, Col 3
      createInactiveCell(31), // Row 0, Col 4
      createInactiveCell(32), // Row 1, Col 0
      createInactiveCell(33), // Row 1, Col 1
      createInactiveCell(34), // Row 1, Col 2
      createInactiveCell(35), // Row 1, Col 3
      createInactiveCell(36), // Row 1, Col 4
      createInactiveCell(37), // Row 2, Col 0
      createInactiveCell(38), // Row 2, Col 1
      createInactiveCell(39), // Row 2, Col 2
      createInactiveCell(40), // Row 2, Col 3
      createInactiveCell(1), // Row 2, Col 4 (cycling back)
    ],
  },

  // Card 4: Motivators (Motivational Messages) - 15 sets (populated from source_content_sets)
  // This card will be dynamically populated with sets where set_type contains 'motivational_messages' and active = true
  {
    id: 4,
    title: "Motivators",
    cells: [
      // Placeholder cells - will be populated dynamically from database
      createInactiveCell(2), // Row 0, Col 0 (cycling back)
      createInactiveCell(3), // Row 0, Col 1
      createInactiveCell(4), // Row 0, Col 2
      createInactiveCell(5), // Row 0, Col 3
      createInactiveCell(6), // Row 0, Col 4
      createInactiveCell(7), // Row 1, Col 0
      createInactiveCell(8), // Row 1, Col 1
      createInactiveCell(9), // Row 1, Col 2
      createInactiveCell(10), // Row 1, Col 3
      createInactiveCell(11), // Row 1, Col 4
      createInactiveCell(12), // Row 2, Col 0
      createInactiveCell(13), // Row 2, Col 1
      createInactiveCell(14), // Row 2, Col 2
      createInactiveCell(15), // Row 2, Col 3
      createInactiveCell(16), // Row 2, Col 4
    ],
  },

  // Card 5: Supportive Messages (H.U.G.s) - 15 sets (populated from source_content_sets)
  // This card will be dynamically populated with sets where set_type contains 'supportive_messages' and active = true
  {
    id: 5,
    title: "Supportive Messages",
    cells: [
      // Placeholder cells - will be populated dynamically from database
      createInactiveCell(17), // Row 0, Col 0
      createInactiveCell(18), // Row 0, Col 1
      createInactiveCell(19), // Row 0, Col 2
      createInactiveCell(20), // Row 0, Col 3
      createInactiveCell(21), // Row 0, Col 4
      createInactiveCell(22), // Row 1, Col 0
      createInactiveCell(23), // Row 1, Col 1
      createInactiveCell(24), // Row 1, Col 2
      createInactiveCell(25), // Row 1, Col 3
      createInactiveCell(26), // Row 1, Col 4
      createInactiveCell(27), // Row 2, Col 0
      createInactiveCell(28), // Row 2, Col 1
      createInactiveCell(29), // Row 2, Col 2
      createInactiveCell(30), // Row 2, Col 3
      createInactiveCell(31), // Row 2, Col 4
    ],
  },

  // Card 6: Advisory Messages - 15 sets (populated from source_content_sets)
  // This card will be dynamically populated with sets where set_type contains 'advisory_messages' and active = true
  {
    id: 6,
    title: "Advisory Messages",
    cells: [
      // Placeholder cells - will be populated dynamically from database
      createInactiveCell(32), // Row 0, Col 0
      createInactiveCell(33), // Row 0, Col 1
      createInactiveCell(34), // Row 0, Col 2
      createInactiveCell(35), // Row 0, Col 3
      createInactiveCell(36), // Row 0, Col 4
      createInactiveCell(37), // Row 1, Col 0
      createInactiveCell(38), // Row 1, Col 1
      createInactiveCell(39), // Row 1, Col 2
      createInactiveCell(40), // Row 1, Col 3
      createInactiveCell(1), // Row 1, Col 4 (cycling back)
      createInactiveCell(2), // Row 2, Col 0
      createInactiveCell(3), // Row 2, Col 1
      createInactiveCell(4), // Row 2, Col 2
      createInactiveCell(5), // Row 2, Col 3
      createInactiveCell(6), // Row 2, Col 4
    ],
  },

  // Card 7: Shareables - 15 sets (populated from source_content_sets)
  // This card will be dynamically populated with sets where set_type contains 'shareables' and active = true
  {
    id: 7,
    title: "Shareables",
    cells: [
      // Placeholder cells - will be populated dynamically from database
      createInactiveCell(7), // Row 0, Col 0
      createInactiveCell(8), // Row 0, Col 1
      createInactiveCell(9), // Row 0, Col 2
      createInactiveCell(10), // Row 0, Col 3
      createInactiveCell(11), // Row 0, Col 4
      createInactiveCell(12), // Row 1, Col 0
      createInactiveCell(13), // Row 1, Col 1
      createInactiveCell(14), // Row 1, Col 2
      createInactiveCell(15), // Row 1, Col 3
      createInactiveCell(16), // Row 1, Col 4
      createInactiveCell(17), // Row 2, Col 0
      createInactiveCell(18), // Row 2, Col 1
      createInactiveCell(19), // Row 2, Col 2
      createInactiveCell(20), // Row 2, Col 3
      createInactiveCell(21), // Row 2, Col 4
    ],
  },

  // Card 8: Slogans - 15 sets (populated from source_content_sets)
  // This card will be dynamically populated with sets where set_type contains 'slogans' and active = true
  {
    id: 8,
    title: "Slogans",
    cells: [
      // Placeholder cells - will be populated dynamically from database
      createInactiveCell(22), // Row 0, Col 0
      createInactiveCell(23), // Row 0, Col 1
      createInactiveCell(24), // Row 0, Col 2
      createInactiveCell(25), // Row 0, Col 3
      createInactiveCell(26), // Row 0, Col 4
      createInactiveCell(27), // Row 1, Col 0
      createInactiveCell(28), // Row 1, Col 1
      createInactiveCell(29), // Row 1, Col 2
      createInactiveCell(30), // Row 1, Col 3
      createInactiveCell(31), // Row 1, Col 4
      createInactiveCell(32), // Row 2, Col 0
      createInactiveCell(33), // Row 2, Col 1
      createInactiveCell(34), // Row 2, Col 2
      createInactiveCell(35), // Row 2, Col 3
      createInactiveCell(36), // Row 2, Col 4
    ],
  },

  // Card 9: Pro Shop - Store card
  {
    id: 9,
    title: "Pro Shop",
    cells: [
      createInactiveCell(37), // Row 0, Col 0
      createInactiveCell(38), // Row 0, Col 1
      createInactiveCell(39), // Row 0, Col 2
      createInactiveCell(40), // Row 0, Col 3
      createInactiveCell(1), // Row 0, Col 4 (cycling back)
      createInactiveCell(2), // Row 1, Col 0
      createInactiveCell(3), // Row 1, Col 1
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
      createInactiveCell(4), // Row 1, Col 3
      createInactiveCell(5), // Row 1, Col 4
      createInactiveCell(6), // Row 2, Col 0
      createInactiveCell(7), // Row 2, Col 1
      createInactiveCell(8), // Row 2, Col 2
      createInactiveCell(9), // Row 2, Col 3
      createInactiveCell(10), // Row 2, Col 4
    ],
  },
];
