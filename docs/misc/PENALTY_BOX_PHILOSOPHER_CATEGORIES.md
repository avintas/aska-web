# Penalty Box Philosopher Categories

## Wisdom Themes

**Penalty Box Philosopher** is separate from Facts. It focuses on Wisdom Hockey content with the following themes:

1. Coach Wisdom
2. Player Quotes
3. Mental Game
4. Habits and Routines
5. Leadership Lessons
6. Short Stories
7. Moments

**Total: 7 wisdom themes**

---

## Implementation Notes

- These themes are displayed in the theme cloud on the Penalty Box Philosopher page
- Clicking a theme filters items from `collection_hockey_motivate` where:
  - `attribution = "Penalty Box Philosopher"` (or "Philosopher", "Penalty Box")
  - `category = [selected theme]`
- Daily Set comes from `pub_shareables_motivational` table (special construct)
- Each theme displays first 12 items in a 3×4 grid

---

## Note: Facts Are Separate

Facts (Rules and penalties, History, Records and stats, NHL vs. youth vs. college, Goalie facts, Equipment, Tech, Fun trivia) are a separate category and should NOT be combined with Penalty Box Philosopher content.

---

## Related Documents

- See `CAPTAIN_HEART_CATEGORIES.md` for Captain Heart category list
- See `BENCH_BOSS_CATEGORIES.md` for Bench Boss category list
