# Bench Boss Categories

## Final Category List

The following categories belong to **Bench Boss** and should be filtered by `attribution = "Bench Boss"` (or "BenchBoss") in the `collection_hockey_culture` table. These are guaranteed tags that have content:

1. Bounce Back (11 items)
2. Discipline (4 items)
3. Focus (11 items)
4. Grit (20 items)
5. Hard Work (8 items)
6. Leadership (7 items)
7. Pain (2 items)
8. Team (10 items)
9. Teamwork (9 items)

**Total: 9 categories**

---

## Implementation Notes

- These categories are displayed in the category cloud on the Bench Boss page
- Clicking a category filters items from `collection_hockey_culture` where:
  - `attribution = "Bench Boss"`
  - `category = [selected category]`
- Daily Selection comes from `collection_hockey_culture` filtered by `attribution = "Bench Boss"`
- Each category displays first 12 items in a 3×4 grid

---

## Related Documents

- See `CAPTAIN_HEART_CATEGORIES.md` for Captain Heart category list
- See `PENALTY_BOX_PHILOSOPHER_CATEGORIES.md` for Philosopher category list (when created)
