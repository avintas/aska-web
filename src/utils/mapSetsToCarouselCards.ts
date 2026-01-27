import { CarouselCard } from "@/config/carousel-cards";
import { HubCell, TriviaQuestionData } from "@/components/HubGrid";
import { getSequentialImage, hasValidTheme } from "@/config/image-mappings";
import { isVisualAnchorIndex } from "@/utils/visualAnchor";

/**
 * Source Content Set Item Structure
 * Different set_types use different field names for their main content:
 * - Trivia types use: question_text
 * - All other types use: content
 */
interface SourceContentSetItem {
  // Common fields
  theme?: string;
  source_id?: number;
  difficulty?: string;
  attribution?: string | null;

  // ID fields (varies by type)
  fact_id?: string; // factoid
  question_id?: string; // trivia
  message_id?: string; // motivational, supportive, advisory, slogans, shareables

  // Content fields (TYPE-SPECIFIC - this is the key!)
  content?: string; // factoid, motivational, supportive, advisory, slogans, shareables
  question_text?: string; // trivia_multiple_choice, trivia_true_false, trivia_who_am_i

  // Trivia-specific fields
  question_type?: string;
  correct_answer?: string;
  wrong_answers?: string[];
  is_true?: boolean;
  explanation?: string;
  points?: number;
  time_limit?: number;
  tags?: string[] | null;

  [key: string]: unknown;
}

interface SourceContentSet {
  id: number;
  set_title: string;
  set_summary: string | null;
  set_items: SourceContentSetItem[];
  set_type: string[] | null;
  set_theme: string | null;
  set_category: string | null;
  set_difficulty: string | null;
  set_attribution: string | null;
}

/**
 * Extracts the main content text from an item based on set_type
 * CRITICAL: Different types use different field names!
 */
function extractContentFromItem(
  item: SourceContentSetItem,
  setType: string[] | null,
): string {
  // Trivia types use question_text
  if (
    setType?.includes("trivia_multiple_choice") ||
    setType?.includes("trivia_true_false") ||
    setType?.includes("trivia_who_am_i")
  ) {
    return item.question_text || "Question unavailable";
  }

  // All other types (factoid, motivational, supportive, advisory, slogans, shareables) use content
  return item.content || "Content unavailable";
}

/**
 * Maps set_items to HubCell tiles for a carousel card
 * Each item in the set becomes one tile
 */
function mapSetItemsToTiles(
  items: SourceContentSet["set_items"],
  setType: string[] | null,
  setId: number,
): (HubCell | null)[] {
  // Determine emoji and badge based on set_type
  let emoji = "📋";
  let badge: string | undefined;
  let badgeColor = "bg-blue-500";

  if (setType?.includes("trivia_multiple_choice")) {
    emoji = "🎯";
    badge = "PLAY";
    badgeColor = "bg-green-500";
  } else if (setType?.includes("trivia_true_false")) {
    emoji = "✅";
    badge = "PLAY";
    badgeColor = "bg-green-500";
  } else if (setType?.includes("trivia_who_am_i")) {
    emoji = "❓";
    badge = "PLAY";
    badgeColor = "bg-green-500";
  } else if (setType?.includes("factoid")) {
    emoji = "💡";
    badge = "FACTS";
    badgeColor = "bg-yellow-500";
  } else if (setType?.includes("motivational")) {
    emoji = ""; // No emoji for motivational
    badge = "SHARE";
    badgeColor = "bg-blue-500";
  } else if (setType?.includes("supportive")) {
    emoji = ""; // No emoji for supportive
    badge = "SHARE";
    badgeColor = "bg-purple-500";
  } else if (setType?.includes("advisory")) {
    emoji = ""; // No emoji for advisory
    badge = "SHARE";
    badgeColor = "bg-indigo-500";
  } else if (setType?.includes("shareables")) {
    emoji = ""; // No emoji for shareables
    badge = "SHARE";
    badgeColor = "bg-teal-500";
  } else if (setType?.includes("slogans")) {
    emoji = ""; // No emoji for slogans
    badge = "SLOGAN";
    badgeColor = "bg-orange-500";
  }

  // Determine content type string for image lookup
  const contentType = setType?.includes("trivia_multiple_choice")
    ? "trivia_multiple_choice"
    : setType?.includes("trivia_true_false")
      ? "trivia_true_false"
      : setType?.includes("trivia_who_am_i")
        ? "trivia_who_am_i"
        : setType?.includes("factoid")
          ? "factoid"
          : setType?.includes("motivational")
            ? "motivational"
            : setType?.includes("supportive")
              ? "supportive"
              : setType?.includes("advisory")
                ? "advisory"
                : setType?.includes("slogans")
                  ? "slogans"
                  : setType?.includes("shareables")
                    ? "shareables"
                    : "unknown";

  // Map up to 15 items to tiles
  const tiles: (HubCell | null)[] = items.slice(0, 15).map((item, index) => {
    // Extract content using the correct field based on type
    const fullContent = extractContentFromItem(item, setType);

    // Truncate long content for tile display (show first 30 chars)
    const displayName =
      fullContent.length > 30 ? `${fullContent.slice(0, 30)}...` : fullContent;

    // Get unique ID for this item
    const itemId =
      item.fact_id || item.question_id || item.message_id || `item-${index}`;

    // Check if this is the visual anchor position (center tile)
    const isAnchor = isVisualAnchorIndex(index);

    // Get sequential background image based on theme and tile index
    let backgroundImage = getSequentialImage(contentType, item.theme, index);

    // For factoids: Always use center-tile.webp for center tile
    // For other factoid tiles: Use center-tile.webp as fallback if no valid theme image
    if (contentType === "factoid") {
      if (isAnchor) {
        // Center tile always uses center-tile.webp
        backgroundImage = "/factoids/center-tile.webp";
      } else if (!hasValidTheme(contentType, item.theme)) {
        // If theme is invalid or missing, use center-tile.webp as fallback
        backgroundImage = "/factoids/center-tile.webp";
      }
      // If theme is valid, getSequentialImage will return the theme image path
      // If that image doesn't exist, we'll handle it with an onError handler in ContentGrid
    }
    // For motivator-related content types: Use center-tile.webp for center tile and as fallback
    else if (
      contentType === "motivational" ||
      contentType === "supportive" ||
      contentType === "advisory" ||
      contentType === "slogans" ||
      contentType === "shareables"
    ) {
      if (isAnchor) {
        // Center tile always uses center-tile.webp
        backgroundImage = "/motivators/center-tile.webp";
      } else if (!hasValidTheme(contentType, item.theme)) {
        // If theme is invalid or missing, use center-tile.webp as fallback
        backgroundImage = "/motivators/center-tile.webp";
      }
      // If theme is valid, getSequentialImage will return the theme image path
      // If that image doesn't exist, we'll handle it with an onError handler in ContentGrid
    }
    // For trivia-related content types: Use center-tile.webp for center tile and as fallback
    else if (
      contentType === "trivia_multiple_choice" ||
      contentType === "trivia_true_false" ||
      contentType === "trivia_who_am_i"
    ) {
      if (isAnchor) {
        // Center tile always uses center-tile.webp
        backgroundImage = "/trivia-arena/center-tile.webp";
      } else if (!hasValidTheme(contentType, item.theme)) {
        // If theme is invalid or missing, use center-tile.webp as fallback
        backgroundImage = "/trivia-arena/center-tile.webp";
      }
      // If theme is valid, getSequentialImage will return the theme image path
      // If that image doesn't exist, we'll handle it with an onError handler in ContentGrid
    }

    // For trivia types, extract full question data
    let questionData: TriviaQuestionData | undefined;
    const isTriviaType =
      setType?.includes("trivia_multiple_choice") ||
      setType?.includes("trivia_true_false") ||
      setType?.includes("trivia_who_am_i");

    if (isTriviaType && item.question_text) {
      questionData = {
        question_text: item.question_text,
        correct_answer: item.correct_answer || "",
        wrong_answers: item.wrong_answers || [],
        is_true: item.is_true,
        explanation: item.explanation || null,
        points: item.points || 10,
        difficulty: item.difficulty || null,
        question_type:
          item.question_type ||
          (setType?.includes("trivia_multiple_choice")
            ? "multiple-choice"
            : setType?.includes("trivia_true_false")
              ? "true-false"
              : "who-am-i"),
      };
    }

    return {
      id: `${setId}-${itemId}`,
      name: displayName.toUpperCase(),
      emoji,
      description: fullContent, // Full content for modal/details
      badge,
      badgeColor,
      inactiveImage: backgroundImage, // Background image for this tile
      theme: item.theme,
      attribution: item.attribution,
      isVisualAnchor: isAnchor, // Mark visual anchor tile
      questionData, // Full trivia question data for game mechanics
    };
  });

  // Pad to exactly 15 tiles with inactive cells if needed
  while (tiles.length < 15) {
    const index = tiles.length;
    const isAnchor = isVisualAnchorIndex(index);
    // Use center-tile.webp as fallback for factoids, motivator-related, and trivia content types
    // For other content types, use hcip fallback
    let inactiveImage: string;
    if (contentType === "factoid") {
      inactiveImage = "/factoids/center-tile.webp";
    } else if (
      contentType === "motivational" ||
      contentType === "supportive" ||
      contentType === "advisory" ||
      contentType === "slogans" ||
      contentType === "shareables"
    ) {
      inactiveImage = "/motivators/center-tile.webp";
    } else if (
      contentType === "trivia_multiple_choice" ||
      contentType === "trivia_true_false" ||
      contentType === "trivia_who_am_i"
    ) {
      inactiveImage = "/trivia-arena/center-tile.webp";
    } else {
      inactiveImage = `/hcip-${(index % 40) + 1}.png`;
    }
    tiles.push({
      id: `inactive-${setId}-${index}`,
      name: "",
      emoji: "",
      inactiveImage,
      isVisualAnchor: isAnchor, // Mark visual anchor if this is the center position
    });
  }

  // Randomly select two tile positions for bonus and sponsored ad (only for factoid content)
  // Exclude center tile and visual anchors
  if (contentType === "factoid") {
    const CENTER_TILE_INDEX = 7;
    const availableIndices = tiles
      .map((_, index) => index)
      .filter(
        (index) =>
          index !== CENTER_TILE_INDEX &&
          !isVisualAnchorIndex(index) &&
          tiles[index] !== null &&
          tiles[index]?.description !== undefined, // Only replace tiles with actual content
      );

    // Shuffle and pick two random positions (ensure they're different)
    const shuffled = [...availableIndices].sort(() => Math.random() - 0.5);
    const bonusIndex = shuffled[0];
    const sponsoredIndex =
      shuffled.length > 1
        ? shuffled[1]
        : shuffled[0] !== undefined
          ? (shuffled[0] + 1) % 15
          : undefined;

    // Replace tile with bonus tile
    if (
      bonusIndex !== undefined &&
      tiles[bonusIndex] &&
      bonusIndex !== sponsoredIndex
    ) {
      const originalTile = tiles[bonusIndex];
      tiles[bonusIndex] = {
        ...originalTile,
        id: `bonus-${setId}-${bonusIndex}`,
        name: "",
        emoji: "",
        description: "BONUS\n\n15 points", // Special content for bonus tile
        isBonus: true,
        inactiveImage:
          originalTile?.inactiveImage || "/factoids/center-tile.webp",
      };
    }

    // Replace tile with sponsored tile
    if (
      sponsoredIndex !== undefined &&
      tiles[sponsoredIndex] &&
      sponsoredIndex !== bonusIndex
    ) {
      const originalTile = tiles[sponsoredIndex];
      tiles[sponsoredIndex] = {
        ...originalTile,
        id: `sponsored-${setId}-${sponsoredIndex}`,
        name: "",
        emoji: "",
        description: "This is a sponsored ad", // Special content for sponsored tile
        isSponsored: true,
        inactiveImage:
          originalTile?.inactiveImage || "/factoids/center-tile.webp",
      };
    }
  }

  return tiles;
}

/**
 * Maps an array of database sets to CarouselCard array
 * Each set becomes one complete carousel card with 15 tiles from set_items
 */
export function mapSetsToCarouselCards(
  sets: SourceContentSet[],
): CarouselCard[] {
  return sets.map((set) => ({
    id: set.id,
    title: set.set_title, // Use set_title as the card title
    cells: mapSetItemsToTiles(set.set_items, set.set_type, set.id).map(
      (cell) => {
        // Add set_title to each cell for modal display
        if (cell && "description" in cell) {
          return {
            ...cell,
            set_title: set.set_title,
          };
        }
        return cell;
      },
    ),
  }));
}
