# Plan: Adapting "Did You Know" Page to Game Day Pattern

## Executive Summary

This document outlines a plan to refactor the "Did You Know" page to follow the Game Day page pattern while maintaining its API-driven functionality and features.

### Key Decisions Made ✅

1. **Grid Layout:** Fixed 4×5 grid (20 facts per set)
2. **Emoji Strategy:** Category-based emoji assignment
3. **Set Display:** One set at a time, no pagination within sets
4. **Breadcrumbs:** Display current setId (e.g., "Set #123")
5. **Set Loading:** Default to latest published set
6. **Mobile:** 2×10 grid on mobile, 4×5 on desktop/tablet

## Current State Analysis

### Game Day Page Pattern
**Location:** `src/app/game-day/page.tsx`

**Key Characteristics:**
- ✅ Fixed 4x10 grid layout (40 cells total)
- ✅ Each cell displays a large emoji (text-5xl)
- ✅ Simple, clean visual design
- ✅ Modal with structured layout:
  - Header with emoji + title
  - Quote text (italic, large)
  - Author attribution (optional)
  - Context badge (optional)
  - Share button (centered, prominent)
- ✅ Currently uses hardcoded sample data
- ✅ Simple state management (no pagination, no API calls)
- ✅ Cell size: 150px × 150px fixed

**Data Structure:**
```typescript
interface Motivator {
  emoji: string;
  quote: string;
  author: string | null;
  context: string | null;
}
```

### Current "Did You Know" Page
**Location:** `src/app/did-you-know/page.tsx`

**Key Characteristics:**
- ✅ API-driven (fetches from `/api/did-you-know`)
- ✅ Responsive grid (4 cols mobile, 7 md, 9 lg)
- ✅ Small SVG icons instead of emojis
- ✅ Pagination support (load more button)
- ✅ Archive section (past fact sets)
- ✅ Modal with fact details:
  - Category/Title
  - Fact text
  - Year badge (optional)
  - Share button
- ✅ Loading states
- ✅ Error handling

**Data Structure:**
```typescript
interface FactItem {
  id?: number;
  fact_text: string;
  fact_category?: string;
  year?: number;
  [key: string]: unknown;
}
```

**API Endpoints:**
- `/api/did-you-know` - Latest facts with pagination
- `/api/did-you-know?id={setId}` - Specific fact set with pagination
- `/api/did-you-know?mode=archive` - List of archived sets

## Key Differences & Challenges

### 1. **Visual Representation**
- **Game Day:** Uses emojis (large, text-5xl)
- **Did You Know:** Uses SVG icons (small, responsive sizing)
- **Challenge:** Facts don't have emojis in the database

### 2. **Grid Layout**
- **Game Day:** Fixed 4×10 grid (40 items)
- **Did You Know:** Will use fixed 4×5 grid (20 items per set)
- **Challenge:** Display one set at a time, show breadcrumbs for setId

### 3. **Data Volume**
- **Game Day:** 40 items (hardcoded)
- **Did You Know:** Sets of up to 20 facts, multiple sets available
- **Challenge:** Display one set at a time, allow switching between sets

### 4. **Modal Structure**
- **Game Day:** Quote-focused with author/context
- **Did You Know:** Fact-focused with category/year
- **Challenge:** Different content structure

## Proposed Solution

### Option A: Pure Game Day Pattern (Recommended)
**Approach:** Adopt Game Day pattern exactly, adapting facts to fit

**Changes Required:**

1. **Grid Layout**
   - Use fixed 4×5 grid (20 cells)
   - Display all facts from current set (one set at a time)
   - Each set contains up to 20 facts
   - No pagination within a set - show all facts in the set

2. **Visual Representation**
   - **Option A1:** Use a single emoji (💡) for all facts
   - **Option A2:** Assign emojis based on fact_category
   - **Option A3:** Use year-based emoji assignment
   - **Recommendation:** Option A2 (category-based emojis) for visual variety

3. **Modal Structure**
   - Adopt Game Day modal layout:
     - Header: Emoji + "Hockey Fact" title
     - Content: Fact text (large, italic quote style)
     - Badge: Category (like context badge)
     - Badge: Year (if available)
     - Share button (centered, Game Day style)

4. **Set Navigation**
   - Remove pagination within sets
   - Display one complete set at a time (all 20 facts)
   - Use archive navigation to switch between sets
   - Show breadcrumbs with current setId

5. **Archive Section**
   - Keep archive section but style it to match Game Day aesthetic
   - Use button pills similar to current design

6. **Cell Size**
   - Use fixed 150px × 150px cells (like Game Day)
   - Ensure responsive behavior on mobile (maybe 2×10 grid?)

### Option B: Hybrid Approach
**Approach:** Keep responsive grid but adopt Game Day modal and styling

**Changes Required:**
- Keep current responsive grid
- Adopt Game Day modal structure
- Use emojis instead of SVG icons
- Apply Game Day styling throughout

### Option C: Enhanced Game Day Pattern
**Approach:** Extend Game Day pattern with additional features

**Changes Required:**
- Use Game Day pattern as base
- Add pagination controls
- Add archive section
- Keep API integration

## Recommended Approach: Option A (Pure Game Day Pattern)

### Rationale
1. **Consistency:** Users get familiar UI pattern across shareable content
2. **Visual Appeal:** Large emojis are more engaging than small icons
3. **Simplicity:** Fixed grid is easier to scan and navigate
4. **Shareability:** Game Day modal is optimized for sharing

### Implementation Plan

#### Phase 1: Data Mapping
1. **Emoji Assignment Strategy**
   - Create mapping function: `fact_category → emoji`
   - Default emoji: 💡 (lightbulb for facts)
   - Category examples:
     - `player_records` → 🏒
     - `team_history` → 🏆
     - `championships` → 🥇
     - `statistics` → 📊
     - `trivia` → 💡
     - `year_events` → 📅
   - Store mapping in constants or utility function

2. **Data Transformation**
   - Map `FactItem` to Game Day-like structure:
     ```typescript
     interface FactDisplay {
       emoji: string;
       fact_text: string;
       category: string | null;
       year: number | null;
       id?: number;
     }
     ```

#### Phase 2: Grid Layout
1. **Fixed Grid Implementation**
   - Replace responsive grid with fixed 4×5 grid (20 cells)
   - Use `grid-cols-4` with fixed cell sizes
   - Mobile: Consider 2×10 grid or keep 4×5 with smaller cells
   - Display all facts from the current set (no pagination within set)

2. **Set Loading Logic**
   - Load latest published set by default
   - Display all facts from the set (up to 20)
   - Show breadcrumbs with setId (e.g., "Set #123")
   - Allow switching sets via archive navigation

#### Phase 3: Modal Refactoring
1. **Adopt Game Day Modal Structure**
   - Header section with emoji + title
   - Fact text as quote (italic, large)
   - Category badge (like context badge)
   - Year badge (if available)
   - Share button (Game Day style)

2. **Styling Consistency**
   - Match Game Day modal colors and spacing
   - Use same button styles
   - Apply same hover effects

#### Phase 4: Archive Section & Breadcrumbs
1. **Breadcrumbs Implementation**
   - Display current setId prominently (e.g., "Set #123")
   - Show set creation date if available
   - Style to match Game Day aesthetic

2. **Archive Navigation**
   - Keep archive section but update styling
   - Match Game Day aesthetic
   - Ensure consistent button styles
   - Allow switching between sets

#### Phase 5: Mobile Responsiveness
1. **Responsive Grid**
   - Mobile (< md): 2 columns × 10 rows (20 cells total)
   - Tablet (md): 4 columns × 5 rows (20 cells total)
   - Desktop: 4 columns × 5 rows (20 cells total)

2. **Cell Sizing**
   - Mobile: Smaller cells (maybe 100px × 100px)
   - Tablet+: 150px × 150px

## Technical Considerations

### 1. Emoji Assignment
**Decision Needed:** How to assign emojis to facts?
- **Option 1:** Category-based mapping (recommended)
- **Option 2:** Year-based mapping
- **Option 3:** Random assignment
- **Option 4:** Single emoji for all

**Recommendation:** Category-based with fallback to default emoji

### 2. Set Display & Navigation
**Decision Needed:** How to handle sets?
- **Option 1:** Show all facts in set (up to 20), no pagination within set
- **Option 2:** Paginate if set has more than 20 facts
- **Recommendation:** Option 1 - One set at a time, all facts displayed

**Breadcrumbs Format:**
- Display setId prominently (e.g., "Set #123")
- Optionally show date: "Set #123 - Nov 21, 2024"
- Style to match Game Day aesthetic

### 3. Archive Integration
**Decision Needed:** Where to place archive section?
- **Option 1:** Above grid (current)
- **Option 2:** Below grid
- **Option 3:** Sidebar
- **Option 4:** Dropdown/select

**Recommendation:** Keep above grid, style to match Game Day

### 4. Empty Cells
**Decision Needed:** What to show if less than 20 facts in a set?
- **Option 1:** Show empty cells
- **Option 2:** Don't render empty cells (let grid adjust)
- **Option 3:** Show placeholder content

**Recommendation:** Option 2 - Don't render empty cells, let grid adjust naturally

## Code Structure Changes

### Files to Modify
1. `src/app/did-you-know/page.tsx` - Main page component
   - Replace grid implementation
   - Update modal component
   - Add emoji mapping logic
   - Update pagination UI

### New Utilities (Optional)
1. `src/utils/factEmojis.ts` - Emoji mapping utility
   ```typescript
   export function getEmojiForFact(fact: FactItem): string {
     // Category-based emoji mapping
   }
   ```

### API Changes
- **None required** - Current API supports the pattern

## Styling Changes

### Grid Cells
- From: Responsive sizing with SVG icons
- To: Fixed 150px × 150px with emojis (text-5xl)

### Modal
- From: Current fact modal structure
- To: Game Day modal structure with fact content

### Colors & Spacing
- Match Game Day page styling
- Use same orange accent colors
- Apply same hover effects

## Testing Considerations

1. **Grid Display**
   - Test with exactly 20 facts (full grid)
   - Test with less than 20 facts (partial grid)
   - Test with more than 20 facts (should limit or handle gracefully)
   - Test mobile responsiveness (2×10 on mobile)

2. **Emoji Assignment**
   - Test all category types
   - Test facts without categories
   - Test facts with unknown categories

3. **Modal Functionality**
   - Test opening/closing
   - Test share functionality
   - Test keyboard navigation (Escape key)

4. **Set Navigation**
   - Test loading latest set by default
   - Test switching between sets via archive
   - Test breadcrumbs display
   - Test loading states

## Open Questions

1. **Emoji Strategy:** Should we use category-based emojis or a single emoji?
   - **Recommendation:** Category-based for visual variety

2. **Grid Size:** 4×5 grid (20 facts per set)
   - **Desktop:** 4 columns × 5 rows
   - **Mobile:** 2 columns × 10 rows

3. **Set Navigation:** One set at a time, no pagination within sets
   - **Breadcrumbs:** Show setId (e.g., "Set #123")
   - **Archive:** Allow switching between sets

4. **Archive Placement:** Keep above grid or move?
   - **Recommendation:** Keep above grid, improve styling

5. **Empty States:** How to handle sets with < 20 facts?
   - **Recommendation:** Show available facts, don't pad with empty cells

## Success Criteria

- ✅ Page follows Game Day visual pattern
- ✅ Modal matches Game Day modal structure
- ✅ Facts display with appropriate emojis (category-based)
- ✅ One set displayed at a time (up to 20 facts)
- ✅ Breadcrumbs show current setId
- ✅ Archive section allows set switching
- ✅ Mobile responsive
- ✅ Share functionality works
- ✅ API integration maintained
- ✅ Loading/error states handled

## Next Steps

1. **Review & Approve Plan** - Get stakeholder approval
2. **Decide on Emoji Strategy** - ✅ Category-based emojis (approved)
3. **Create Emoji Mapping** - Build utility function
4. **Refactor Grid** - Implement fixed 4×5 grid layout (20 facts)
5. **Add Breadcrumbs** - Display current setId
6. **Refactor Modal** - Adopt Game Day modal structure
7. **Update Archive Navigation** - Style to match Game Day
8. **Update Styling** - Match Game Day aesthetic
7. **Test & Refine** - Ensure all functionality works
8. **Deploy** - Release updated page

---

## Appendix: Emoji Mapping Examples

```typescript
const CATEGORY_EMOJI_MAP: Record<string, string> = {
  player_records: "🏒",
  team_history: "🏆",
  championships: "🥇",
  statistics: "📊",
  trivia: "💡",
  year_events: "📅",
  records: "📈",
  milestones: "⭐",
  // Add more as needed
};

const DEFAULT_EMOJI = "💡";
```
