/**
 * Visual Anchor Utility
 *
 * Determines if a cell index is the visual anchor (center tile) based on viewport.
 *
 * Desktop/Tablet (5 columns × 3 rows):
 *   - Center: Row 2, Column 3 (1-indexed) = Row 1, Column 2 (0-indexed) = index 7
 *
 * Mobile Vertical (3 columns × 5 rows):
 *   - Center: Row 3, Column 2 (1-indexed) = Row 2, Column 1 (0-indexed) = index 7
 *
 * Note: Both layouts happen to use index 7, but we keep this utility for clarity
 * and future flexibility if layouts change.
 */

/**
 * Checks if a cell index is the visual anchor position
 * @param index - The cell index (0-14 for a 15-cell grid)
 * @returns true if this index is the visual anchor position
 */
export function isVisualAnchorIndex(index: number): boolean {
  // Desktop: 5 columns × 3 rows, center at row 1 (0-indexed), column 2 (0-indexed) = index 7
  // Mobile: 3 columns × 5 rows, center at row 2 (0-indexed), column 1 (0-indexed) = index 7
  // Both layouts use index 7 as the center
  return index === 7;
}
