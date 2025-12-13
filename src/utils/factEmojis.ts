/**
 * Emoji mapping utility for fact categories
 * Maps fact_category values to appropriate emojis
 */

interface FactItem {
  fact_category?: string;
  [key: string]: unknown;
}

const CATEGORY_EMOJI_MAP: Record<string, string> = {
  player_records: "🏒",
  team_history: "🏆",
  championships: "🥇",
  statistics: "📊",
  trivia: "💡",
  year_events: "📅",
  records: "📈",
  milestones: "⭐",
  achievements: "🎖️",
  history: "📜",
  legends: "👑",
  moments: "⚡",
  // Add more mappings as needed
};

const DEFAULT_EMOJI = "💡";

/**
 * Get emoji for a fact based on its category
 * @param fact - The fact item with optional fact_category
 * @returns Emoji string for the fact
 */
export function getEmojiForFact(fact: FactItem): string {
  if (!fact.fact_category) {
    return DEFAULT_EMOJI;
  }

  const category = fact.fact_category.toLowerCase().trim();
  return CATEGORY_EMOJI_MAP[category] || DEFAULT_EMOJI;
}

/**
 * Format category label for display
 * Converts snake_case to Title Case
 * @param category - Category string (e.g., "player_records")
 * @returns Formatted label (e.g., "Player Records")
 */
export function formatCategoryLabel(
  category: string | null | undefined,
): string {
  if (!category) {
    return "Hockey Fact";
  }

  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
