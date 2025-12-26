/**
 * IMAGE MAPPINGS CONFIGURATION
 * ============================
 *
 * This file serves as the central registry for all image-to-content mappings
 * used throughout the OnlyHockey application. Each collection defines a set
 * of images associated with a specific display type or component.
 *
 * PURPOSE:
 * - Centralize all image mappings in one maintainable location
 * - Provide consistent image associations across components
 * - Make it easy to update or swap images without modifying component code
 *
 * USAGE:
 * Import the getImage helper function and call it with the collection name
 * and the key you want to look up:
 *
 *   import { getImage } from "@/config/image-mappings";
 *   const imagePath = getImage("motivationalCategories", "grit");
 *
 * ADDING NEW COLLECTIONS:
 * 1. Add a new entry to IMAGE_COLLECTIONS with a descriptive name
 * 2. Add a default fallback image to COLLECTION_DEFAULTS
 * 3. Document the collection's purpose in the comments
 */

// =============================================================================
// IMAGE COLLECTIONS
// =============================================================================

export const IMAGE_COLLECTIONS = {
  // ---------------------------------------------------------------------------
  // COLLECTION: Motivational Categories
  // ---------------------------------------------------------------------------
  // Used by: Motivators page (/motivators)
  // Component: MotivatorsCarousel, MotivatorsGrid
  // Purpose: Maps motivational quote categories to their thumbnail images.
  //          Each category in the pub_shareables_sets table has an associated
  //          image that displays on the swipeable grid cards.
  // Image Set: MCIP (Motivational Category Image Pack) - labeled category images
  // ---------------------------------------------------------------------------
  motivationalCategories: {
    // Categories with dedicated MCIP images (labeled graphics)
    "bounce back": "/mcip-1.png",
    celebration: "/mcip-2.png",
    discipline: "/mcip-3.png",
    focus: "/mcip-4.png",
    glory: "/mcip-5.png",
    "good luck": "/mcip-6.png",
    leadership: "/mcip-7.png",
    team: "/mcip-8.png",
    grit: "/mcip-9.png",

    // Categories using HCIP fallback images (hockey player graphics)
    // TODO: Create dedicated MCIP images for these categories
    "hard work": "/hcip-3.png",
    "i'm proud": "/hcip-4.png",
    mindset: "/hcip-5.png",
    perseverance: "/hcip-6.png",
    resilience: "/hcip-7.png",
    teamwork: "/hcip-8.png",
    "the code": "/hcip-9.png",
    "the flow": "/hcip-10.png",
    "the grind": "/hcip-11.png",
    "the room": "/hcip-12.png",
  } as Record<string, string>,

  // ---------------------------------------------------------------------------
  // COLLECTION: [Future collections will be added here]
  // ---------------------------------------------------------------------------
  // Example: hubCells, setAttributions, factCategories, etc.
  // ---------------------------------------------------------------------------
};

// =============================================================================
// DEFAULT IMAGES
// =============================================================================
// Fallback images used when a key is not found in a collection

export const COLLECTION_DEFAULTS: Record<string, string> = {
  motivationalCategories: "/hcip-21.png",
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get an image path from a specific collection.
 *
 * @param collection - The name of the image collection to search
 * @param key - The key to look up (e.g., category name, set title)
 * @returns The image path, or the collection's default if not found
 *
 * @example
 * getImage("motivationalCategories", "grit") // Returns "/mcip-9.png"
 * getImage("motivationalCategories", "unknown") // Returns "/hcip-21.png" (default)
 */
export function getImage(
  collection: keyof typeof IMAGE_COLLECTIONS,
  key: string | null,
): string {
  if (!key) {
    return COLLECTION_DEFAULTS[collection] || "/hcip-1.png";
  }

  const normalizedKey = key.toLowerCase().trim();
  const collectionMap = IMAGE_COLLECTIONS[collection];

  if (collectionMap && normalizedKey in collectionMap) {
    return collectionMap[normalizedKey];
  }

  return COLLECTION_DEFAULTS[collection] || "/hcip-1.png";
}

/**
 * Check if a key exists in a collection.
 *
 * @param collection - The name of the image collection to search
 * @param key - The key to check
 * @returns True if the key exists in the collection
 */
export function hasImage(
  collection: keyof typeof IMAGE_COLLECTIONS,
  key: string | null,
): boolean {
  if (!key) return false;

  const normalizedKey = key.toLowerCase().trim();
  const collectionMap = IMAGE_COLLECTIONS[collection];

  return collectionMap ? normalizedKey in collectionMap : false;
}

/**
 * Get all keys in a collection.
 *
 * @param collection - The name of the image collection
 * @returns Array of all keys in the collection
 */
export function getCollectionKeys(
  collection: keyof typeof IMAGE_COLLECTIONS,
): string[] {
  const collectionMap = IMAGE_COLLECTIONS[collection];
  return collectionMap ? Object.keys(collectionMap) : [];
}
