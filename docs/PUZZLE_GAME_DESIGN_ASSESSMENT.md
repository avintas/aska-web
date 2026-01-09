# Puzzle Game Design Assessment
## "Did You Know?" Matching Memory Game

**Date:** January 3, 2026  
**Status:** Planning & Design Phase  
**Current Implementation:** Prototype exists but needs redesign

---

## Game Structure

### Physical Layout
- **5 Game Boards** (carousel slides)
- **20 Card Positions** per board (4 rows × 5 columns)
- **100 Total Card Positions** across all boards

### Display Format
- Game Boy-style device container
- Carousel navigation between boards
- Modal popup for fact details
- Dark mode support

---

## Recommended Approach: Image-to-Text Matching

### Game Concept
A classic educational matching game where players connect hockey images with their corresponding text descriptions. Players flip cards to reveal either an image or a fact, then find the matching pair.

### Why This Approach?

**Advantages:**
- ✅ **More Educational** - Players learn by connecting visual and textual information
- ✅ **More Engaging** - Two different types of stimuli (visual vs. text) keeps it interesting  
- ✅ **Better for Hockey Content** - Showcase player photos, historic moments, team logos
- ✅ **Clearer Win Condition** - Players know they matched correctly because the connection makes sense
- ✅ **More Replayable** - Even if you remember positions, you still learn the associations

**Current Implementation Issues:**
- ❌ **Confusing:** Current code tries to match facts by category, which is arbitrary
- ❌ **Hard to Verify:** Players can't easily tell if their match was correct
- ❌ **Less Satisfying:** Matching "Player stat" with another "Player stat" feels arbitrary

---

## Content Requirements

### 1. 50 Hockey Images
Examples of image categories:

**Players (15-20 images)**
- Wayne Gretzky in Oilers jersey
- Mario Lemieux with Penguins
- Sidney Crosby with Stanley Cup
- Alex Ovechkin celebrating goal
- Bobby Orr "flying through the air"
- Gordie Howe in Red Wings jersey
- Connor McDavid action shot

**Team Logos (10-12 images)**
- Original Six teams (Canadiens, Maple Leafs, Bruins, Rangers, Red Wings, Blackhawks)
- Modern expansion teams
- Historic team logos

**Historic Moments (8-10 images)**
- 1980 "Miracle on Ice"
- Paul Henderson's 1972 Summit Series goal
- Bobby Orr's 1970 Cup-winning goal
- 2010 Olympic gold medal game

**Trophies & Awards (5-8 images)**
- Stanley Cup
- Hart Trophy
- Vezina Trophy
- Conn Smythe Trophy
- Art Ross Trophy

**Venues & Equipment (5-8 images)**
- Montreal Forum
- Maple Leaf Gardens
- Vintage hockey equipment
- Modern arenas
- Outdoor Classic venues

### 2. 50 Corresponding Text Facts
Each text must:
- Clearly relate to ONE specific image
- Be short enough to fit on a card (50-80 characters recommended)
- Be instantly recognizable when matched
- Provide educational value

**Example Pairs:**

| Image | Matching Text Fact |
|-------|-------------------|
| Photo of Wayne Gretzky | "Known as 'The Great One', holds 61 NHL records" |
| Stanley Cup trophy | "Awarded annually to NHL playoff champion since 1893" |
| Montreal Canadiens logo | "Most Stanley Cup wins with 24 championships" |
| 1980 USA Olympic team | "Miracle on Ice: USA defeated USSR in 1980 Olympics" |
| Bobby Orr flying | "Scored Stanley Cup-winning goal while flying through air" |
| Original Six teams collage | "NHL's first six teams from 1942-1967" |
| Hart Trophy | "NHL MVP award named after Dr. David Hart" |

### 3. Card Back Images (Already Available)
- Currently have: `hcip-1.png` through `hcip-52.png` in `/public` folder
- These serve as card backs (face-down state)
- Can continue using these for visual variety

---

## Database Structure

### Recommended Table: `puzzle_pairs`

```sql
CREATE TABLE puzzle_pairs (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,           -- Path to hockey image (face-up)
  fact_text TEXT NOT NULL,           -- Matching description
  category TEXT,                     -- "Players", "Teams", "History", "Trophies"
  difficulty_level TEXT,             -- "easy", "medium", "hard"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'published'    -- "published", "unpublished"
);
```

**Alternative: Use existing table**
Could extend `collection_hockey_facts` table with an `image_url` column if you want to keep all facts in one place.

---

## Game Logic Requirements

### 1. Shuffle Algorithm
- Randomize 50 images + 50 texts = 100 cards
- Distribute across 5 boards (20 cards each)
- Ensure each board has a mix of images and text
- Prevent same pair from appearing on same board

### 2. State Tracking
Track the following in component state:

```typescript
interface GameState {
  flippedCards: Set<string>;        // Card IDs currently face-up
  matchedPairs: Set<string>;        // Card IDs that have been matched
  firstCard: CardSelection | null;  // First card selected
  secondCard: CardSelection | null; // Second card selected
  isProcessing: boolean;            // Prevent clicks during match check
  attempts: number;                 // Total match attempts
  successfulMatches: number;        // Correct pairs found
  gameComplete: boolean;            // All 50 pairs matched
}

interface CardSelection {
  cardId: string;
  type: 'image' | 'text';
  pairId: number;                   // Links image to its matching text
}
```

### 3. Match Validation Logic

**When player clicks second card:**
1. Check if `firstCard.pairId === secondCard.pairId`
2. Check if `firstCard.type !== secondCard.type` (one image, one text)
3. If both true → **Match!**
   - Keep both cards flipped
   - Add to matchedPairs
   - Show success animation (green border, checkmark)
   - Increment successfulMatches
4. If false → **No Match**
   - Wait 1.5 seconds (let player see cards)
   - Flip both cards back
   - Increment attempts
5. Reset selection state

### 4. Win Condition
- When `successfulMatches === 50`
- Show celebration modal
- Display stats: attempts, accuracy percentage
- Option to play again (re-shuffle)

---

## Alternative Approach: Category-Based Matching

If creating 50 unique images is too resource-intensive:

### Simplified Version
- **10 Categories** (Players, Teams, Records, History, Venues, Equipment, etc.)
- **5 Facts per category** = 50 facts total
- **Visual Coding:** Each category has a color or icon
- **Match Rule:** Any two facts from the same category = match

**Pros:**
- Easier content creation (no image sourcing)
- Simpler data structure
- Still educational

**Cons:**
- Less precise matching
- Less visually engaging
- More ambiguous (why do these match?)

---

## Technical Implementation Notes

### Card Component Structure
```typescript
interface PuzzleCard {
  id: string;                    // Unique card ID
  pairId: number;                // Links matching cards (1-50)
  type: 'image' | 'text';        // Card content type
  content: string;               // Image URL or fact text
  isFlipped: boolean;            // Face-up or face-down
  isMatched: boolean;            // Successfully paired
  cardBackImage: string;         // hcip-XX.png for face-down state
}
```

### API Endpoint
**GET `/api/puzzle-game`**
- Fetches 50 puzzle pairs from database
- Returns shuffled array of 100 cards
- Handles RLS (only published pairs)

### Performance Considerations
- Preload all images to prevent flicker on flip
- Use CSS transitions for smooth card flip animation
- Debounce click events during processing
- Consider using React.memo for card components

---

## Content Creation Workflow

### Phase 1: Content Collection
1. Source 50 high-quality hockey images
2. Write 50 corresponding facts
3. Review for accuracy and clarity
4. Get licensing/permissions if needed

### Phase 2: Database Setup
1. Create `puzzle_pairs` table (or extend existing)
2. Upload images to storage (Supabase Storage or CDN)
3. Populate database with pair records
4. Test RLS policies

### Phase 3: Game Implementation
1. Build shuffle algorithm
2. Implement match validation logic
3. Add animations and feedback
4. Test all 50 pairs
5. Add win condition and stats

### Phase 4: Polish
1. Sound effects (flip, match, no-match)
2. Haptic feedback on mobile
3. Progress indicator (X/50 pairs found)
4. Timer/leaderboard (optional)

---

## User Experience Flow

1. **Page Load**
   - Player sees Game Boy-style screen with title
   - "Play Puzzle Game" section appears
   - 5 carousel boards are visible (navigate with arrows)

2. **Gameplay**
   - Player clicks first card → flips to reveal content
   - Player clicks second card → flips to reveal content
   - System checks for match:
     - **Match:** Both cards stay up, green border, checkmark badge
     - **No Match:** Both cards flip back after 1.5 seconds
   - Player can click any card to open modal with full details

3. **Modal Interaction**
   - Shows full fact text or larger image
   - Share button to post on social media
   - Close button returns to game

4. **Game Completion**
   - All 50 pairs matched
   - Celebration modal appears
   - Stats displayed (attempts, accuracy, time)
   - Option to play again

---

## Key Metrics to Track

### Player Analytics
- Average completion time
- Match accuracy rate (successful matches / total attempts)
- Most frequently matched pairs (easy)
- Least frequently matched pairs (hard)
- Drop-off points (which board loses players)

### Content Analytics
- Which pairs are matched fastest (too obvious?)
- Which pairs take most attempts (too obscure?)
- Image vs text first (do players prefer to flip images or text first?)

---

## Future Enhancements

### Difficulty Levels
- **Easy:** Famous players and teams (Gretzky, Original Six)
- **Medium:** Historical moments and trophies
- **Hard:** Obscure records and vintage content

### Multiplayer Mode
- Two players compete on same board
- First to match 25 pairs wins
- Turn-based or simultaneous

### Daily Challenge
- New set of 10 pairs each day
- Leaderboard for fastest completion
- Streak tracking

### Themed Collections
- "Greatest Players" (all player pairs)
- "Stanley Cup History" (all Cup-related pairs)
- "Original Six Era" (vintage content)

---

## Summary: What You Need

✅ **50 unique hockey images** (puzzle content - face-up state)  
✅ **50 matching text descriptions** (paired 1:1 with images)  
✅ **Card back images** (already have hcip-1 to hcip-52)  
✅ **Database table** to store pairs with pair_id linking  
✅ **Shuffle algorithm** to distribute 100 cards across 5 boards  
✅ **Match validation logic** (check if pair_id matches AND types differ)  
✅ **Game state management** (flipped, matched, attempts, score)  
✅ **Win condition** (50 pairs matched = game complete)

**NOT** 50 images + 50 messages as separate pools, but rather **50 image-text pairs** where each image has exactly ONE correct matching text fact.

---

## Next Steps (When Ready)

1. ✍️ Create list of 50 hockey topics to feature
2. 🖼️ Source/create 50 hockey images
3. 📝 Write 50 corresponding facts
4. 🗄️ Set up database structure
5. 💻 Implement game logic
6. 🎨 Polish UX/animations
7. 🧪 Test all pairs
8. 🚀 Launch

---

**Note:** This document serves as a design reference for future implementation. The current prototype in `src/app/did-you-know/page.tsx` attempts category-based matching but should be redesigned using the image-to-text approach outlined here for better player experience.

