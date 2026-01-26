/**
 * IMAGE MAPPINGS CONFIGURATION
 * ============================
 *
 * This file manages background images for content tiles across all content types.
 * Each content type has its own collection of theme-based images.
 *
 * ARCHITECTURE:
 * - Images are organized by content type (factoids, motivational, supportive, etc.)
 * - Each theme can have multiple numbered variants (players-1.png, players-2.png, etc.)
 * - Sequential selection ensures variety within each card (tile 0 uses variant 1, tile 1 uses variant 2, etc.)
 *
 * USAGE:
 *   import { getSequentialImage } from "@/config/image-mappings";
 *   const imagePath = getSequentialImage("motivational", "Players", 0); // First tile
 *   const imagePath2 = getSequentialImage("motivational", "Players", 1); // Second tile
 */

// =============================================================================
// THEME-TO-FOLDER MAPPINGS
// =============================================================================
// Maps theme names to image folder paths and available variant counts

interface ThemeImageConfig {
  folder: string; // Base folder path (e.g., "/factoids")
  prefix: string; // File prefix (e.g., "the-players")
  variants: number; // Number of available variants
}

// Content type → Theme → Image configuration
const THEME_IMAGE_MAP: Record<string, Record<string, ThemeImageConfig>> = {
  factoid: {
    Players: { folder: "/factoids", prefix: "the-players", variants: 20 },
    Geography: {
      folder: "/factoids",
      prefix: "geography-of-hockey",
      variants: 11,
    },
    History: { folder: "/factoids", prefix: "the-wall", variants: 11 },
    Business: { folder: "/factoids", prefix: "the-business", variants: 2 },
    League: { folder: "/factoids", prefix: "the-league", variants: 2 },
    System: { folder: "/factoids", prefix: "the-system", variants: 2 },
    "Game Day": { folder: "/factoids", prefix: "game-day", variants: 3 },
    Lab: { folder: "/factoids", prefix: "the-lab", variants: 1 },
    Legacy: { folder: "/factoids", prefix: "the-legacy", variants: 1 },
  },
  motivational: {
    Players: { folder: "/motivators", prefix: "grit", variants: 1 },
    Focus: { folder: "/motivators", prefix: "focus", variants: 3 },
    "Bounce Back": { folder: "/motivators", prefix: "bounceback", variants: 2 },
    Celebration: { folder: "/motivators", prefix: "celebration", variants: 1 },
    Leadership: { folder: "/motivators", prefix: "leadership", variants: 1 },
    "Good Luck": { folder: "/motivators", prefix: "goodluck", variants: 3 },
    Glory: { folder: "/motivators", prefix: "glory", variants: 1 },
    Team: { folder: "/motivators", prefix: "team", variants: 1 },
    Calm: { folder: "/motivators", prefix: "calm", variants: 1 },
  },
  supportive: {
    // Add your supportive theme mappings here
    // Example: "Players": { folder: "/supportive", prefix: "players", variants: 5 },
  },
  advisory: {
    // Add your advisory theme mappings here
    // Example: "Entertainment": { folder: "/advisory", prefix: "entertainment", variants: 3 },
  },
  slogans: {
    // Add your slogans theme mappings here
    // Example: "Records": { folder: "/slogans", prefix: "records", variants: 4 },
  },
  shareables: {
    // Add your shareables theme mappings here
    // Example: "History": { folder: "/shareables", prefix: "history", variants: 6 },
  },
  trivia_multiple_choice: {
    // Add your trivia theme mappings here
  },
  trivia_true_false: {
    // Add your trivia theme mappings here
  },
  trivia_who_am_i: {
    // Add your trivia theme mappings here
  },
};

// Default fallback images per content type
const CONTENT_TYPE_DEFAULTS: Record<string, string> = {
  factoid: "/factoids/center-tile.webp", // Use center-tile.webp as default fallback for factoids
  motivational: "/motivators/center-tile.webp", // Use center-tile.webp as default fallback for motivational
  supportive: "/motivators/center-tile.webp", // Use center-tile.webp as fallback for supportive (shown on motivators page)
  advisory: "/motivators/center-tile.webp", // Use center-tile.webp as fallback for advisory (shown on motivators page)
  slogans: "/motivators/center-tile.webp", // Use center-tile.webp as fallback for slogans (shown on motivators page)
  shareables: "/motivators/center-tile.webp", // Use center-tile.webp as fallback for shareables (shown on motivators page)
  trivia_multiple_choice: "/trivia-arena/center-tile.webp", // Use center-tile.webp as default fallback for trivia
  trivia_true_false: "/trivia-arena/center-tile.webp", // Use center-tile.webp as default fallback for trivia
  trivia_who_am_i: "/trivia-arena/center-tile.webp", // Use center-tile.webp as default fallback for trivia
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a sequential image for a content tile based on theme and tile index
 *
 * @param contentType - The content type (factoid, motivational, supportive, etc.)
 * @param theme - The theme name (Players, History, Entertainment, etc.)
 * @param tileIndex - The position of the tile in the grid (0-14)
 * @returns The image path for this tile
 *
 * @example
 * getSequentialImage("factoid", "Players", 0) // Returns "/factoids/the-players-1.png"
 * getSequentialImage("factoid", "Players", 1) // Returns "/factoids/the-players-2.png"
 * getSequentialImage("motivational", "Focus", 5) // Returns "/motivators/focus-3.png" (wraps at 3 variants)
 */
export function getSequentialImage(
  contentType: string,
  theme: string | null | undefined,
  tileIndex: number,
): string {
  // Fallback if no theme provided
  if (!theme) {
    return CONTENT_TYPE_DEFAULTS[contentType] || "/hcip-1.png";
  }

  // Get theme config for this content type
  const contentTypeMap = THEME_IMAGE_MAP[contentType];
  if (!contentTypeMap) {
    return CONTENT_TYPE_DEFAULTS[contentType] || "/hcip-1.png";
  }

  const themeConfig = contentTypeMap[theme];
  if (!themeConfig) {
    return CONTENT_TYPE_DEFAULTS[contentType] || "/hcip-1.png";
  }

  // Calculate which variant to use (cycles through available variants)
  const variantNumber = (tileIndex % themeConfig.variants) + 1;

  // For factoids, use .png extension
  const imageExtension = ".png";
  return `${themeConfig.folder}/${themeConfig.prefix}-${variantNumber}${imageExtension}`;
}

/**
 * Check if a theme exists and is valid for a content type
 * @param contentType - The content type (factoid, motivational, etc.)
 * @param theme - The theme name to check
 * @returns true if the theme exists and has a valid config
 */
export function hasValidTheme(
  contentType: string,
  theme: string | null | undefined,
): boolean {
  if (!theme) {
    return false;
  }

  const contentTypeMap = THEME_IMAGE_MAP[contentType];
  if (!contentTypeMap) {
    return false;
  }

  return !!contentTypeMap[theme];
}
