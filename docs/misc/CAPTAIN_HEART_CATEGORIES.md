# Captain Heart Categories

## Final Category List

The following categories belong to **Captain Heart** and should be filtered by `attribution = "Captain Heart"` (or "CaptainHeart", "Captain Hart") in the `collection_hockey_culture` table. These are guaranteed tags that have content:

1. Celebration (11 items)
2. Glory (5 items)
3. Good Luck (11 items)
4. Im Proud (14 items) - Note: Database stores as "Im Proud", frontend displays as "I'm proud"
5. Mindset (12 items)
6. Perseverance (5 items)
7. Resilience (5 items)
8. Vision (1 item)

**Total: 8 categories**

---

## Implementation Notes

- These categories are displayed in the category cloud on the Captain Heart page
- Clicking a category filters items from `collection_hockey_culture` where:
  - `attribution = "Captain Heart"` (or "CaptainHeart", "Captain Hart")
  - `category = [selected category]`
- Daily Selection comes from `collection_hockey_culture` filtered by `attribution = "Captain Heart"`
- Each category displays first 12 items in a 3×4 grid

---

## Remaining Categories (Bench Boss)

The following categories belong to **Bench Boss**:

- Hard work
- Teamwork
- (Any others not listed above)
