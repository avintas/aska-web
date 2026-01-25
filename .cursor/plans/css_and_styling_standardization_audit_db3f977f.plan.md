---
name: CSS and Styling Standardization Audit
overview: Audit and standardize all CSS, Tailwind classes, spacing, typography, and layout patterns across all pages using the landing page (src/app/page.tsx) as the golden standard. This will ensure consistent fonts, spacing, title positioning, and subtitle styling while preserving existing fonts and colors.
todos:
  - id: analyze-landing-standard
    content: Document landing page styling standards (container, title, subtitle, spacing patterns)
    status: completed
  - id: standardize-containers
    content: "Update all page containers to use consistent padding: pt-16 pb-12 px-4 md:px-6 lg:px-8 (except landing page)"
    status: completed
  - id: standardize-title-sections
    content: Update all title sections to use mb-16 md:mb-20 container spacing
    status: completed
  - id: standardize-h1-typography
    content: "Update all H1 elements to: text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6"
    status: completed
  - id: standardize-subtitles
    content: Update all subtitle containers to max-w-2xl mx-auto with text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center
    status: completed
  - id: standardize-navigation-spacing
    content: Ensure PageNavigationButtons spacing is mb-6 md:mb-8 on all pages
    status: completed
  - id: add-newsletter-motivators
    content: Add newsletter signup component to motivators page with state management and API handler
    status: completed
  - id: add-newsletter-did-you-know
    content: Add newsletter signup component to did-you-know page with state management and API handler
    status: completed
  - id: verify-responsive-breakpoints
    content: Test all pages at mobile, tablet, and desktop breakpoints to ensure consistency
    status: pending
isProject: false
---

# CSS and Styling Standardization Audit Plan

## Golden Standard: Landing Page (`src/app/page.tsx`)

The landing page establishes the following standards:

### Container Structure

- **Outer container**: `min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-8 pb-12 px-4 md:px-6 lg:px-8`
- **Inner container**: `max-w-7xl mx-auto`
- **PageNavigationButtons spacing**: `mb-6 md:mb-8`

### Title Section

- **Container**: `text-center mb-16 md:mb-20`
- **H1**: `text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6`
- **Emoji container** (if present): `flex items-center justify-center gap-2 mb-4 md:mb-6` with emojis `text-5xl md:text-6xl lg:text-7xl`
- **Subtitle container**: `max-w-2xl mx-auto`
- **Subtitle text**: `text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center`

### Font Standards

- **Font family**: Inter (from `layout.tsx` - already universal)
- **Font weights**: `font-black` for H1, `font-semibold` for H2, `font-medium` for body emphasis
- **No font changes needed** - Inter is already applied globally

### Color Standards

- **Text colors**: `text-gray-900 dark:text-white` for headings, `text-gray-700 dark:text-gray-300` for body
- **Backgrounds**: Gradient for main pages, solid for content pages
- **No color changes needed** - preserve existing color scheme

## Inconsistencies Identified

### 1. Background Patterns

**Issue**: Mixed use of gradient vs solid backgrounds

- **Landing, Did You Know, Motivators, Trivia Arena**: Use gradient `bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950`
- **All other pages**: Use solid `bg-white dark:bg-gray-900`

**Decision**: Keep gradients for main feature pages (landing, trivia, motivators, did-you-know), solid for content pages (about, faq, support, etc.)

### 2. Padding Top

**Issue**: Inconsistent top padding

- **Landing**: `pt-8` (no navbar offset needed)
- **Most pages**: `pt-16` (navbar offset)
- **Did You Know/Motivators/Trivia Arena**: `pt-20`

**Standard**: Use `pt-8` for landing page, `pt-16` for all other pages (accounts for navbar height)

### 3. Padding Bottom

**Issue**: Inconsistent bottom padding

- **Landing**: `pb-12`
- **Most pages**: `pb-8`
- **Some pages**: `pb-8 md:pb-12`

**Standard**: Use `pb-12` consistently (matches landing page)

### 4. Horizontal Padding

**Issue**: Some pages missing responsive padding

- **Landing**: `px-4 md:px-6 lg:px-8` ✓
- **Some pages**: `px-4` only

**Standard**: Use `px-4 md:px-6 lg:px-8` on all pages

### 5. Max Width Container

**Issue**: Inconsistent max-width values

- **Landing**: `max-w-7xl` ✓
- **Content pages**: `max-w-4xl` (About, FAQ, Ethos, Shop, Support, Privacy, Terms, The Code)
- **Feature pages**: `max-w-7xl` (Bench Boss, Captain Heart, Rink Philosopher, Game Plan, Pre-Game, My Records, Trivia Arena, Did You Know, Motivators)

**Decision**: Keep `max-w-7xl` for feature pages, `max-w-4xl` for content pages (this is intentional for readability)

### 6. Title Section Spacing

**Issue**: Inconsistent margin-bottom

- **Landing**: `mb-16 md:mb-20` ✓
- **Most pages**: `mb-12`
- **Some pages**: `mb-6 md:mb-8` (Bench Boss, Captain Heart, Rink Philosopher)

**Standard**: Use `mb-16 md:mb-20` for all pages (matches landing page)

### 7. H1 Typography

**Issue**: Inconsistent sizes and weights

- **Landing**: `text-3xl md:text-4xl lg:text-5xl font-black` ✓
- **Most pages**: `text-4xl md:text-5xl font-black`
- **Some pages**: `text-2xl md:text-3xl font-black` (Bench Boss, Captain Heart, Rink Philosopher)
- **Some pages**: Missing `tracking-tight`

**Standard**: Use `text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6` for all H1s

### 8. Subtitle Typography

**Issue**: Inconsistent sizes and spacing

- **Landing**: `text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center` with `max-w-2xl mx-auto` container ✓
- **Most pages**: `text-lg md:text-xl text-gray-700 dark:text-gray-300` without container wrapper
- **Some pages**: Missing `leading-relaxed` and `text-center`

**Standard**: Use `text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center` with `max-w-2xl mx-auto` container for all subtitles

### 9. PageNavigationButtons Spacing

**Issue**: Mostly consistent, but verify all pages

- **Landing**: `mb-6 md:mb-8` ✓
- **All pages**: Should match this

**Standard**: Use `mb-6 md:mb-8` consistently

## Implementation Plan

### Phase 1: Standardize Container Structure

1. Update all pages to use consistent padding: `pt-16 pb-12 px-4 md:px-6 lg:px-8` (except landing page which uses `pt-8`)
2. Ensure all pages have proper max-width containers (`max-w-7xl` for features, `max-w-4xl` for content)

### Phase 2: Standardize Title Sections

1. Update all title section containers to: `text-center mb-16 md:mb-20`
2. Standardize all H1 elements to: `text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6`
3. Standardize emoji containers (if present) to match landing page pattern
4. Standardize subtitle containers and text to match landing page pattern

### Phase 3: Verify Spacing Consistency

1. Ensure PageNavigationButtons spacing is `mb-6 md:mb-8` on all pages
2. Verify consistent spacing between sections throughout all pages

### Phase 4: Component-Level Standardization

1. Review shared components (Navbar, Footer, PageNavigationButtons) for consistency
2. Ensure modal components follow consistent spacing patterns
3. Standardize button and card spacing

### Phase 5: Add Newsletter Signup Component

1. Add newsletter signup component to `src/app/motivators/page.tsx`

- Add state management (email, isSubmitting, message)
- Add handleNewsletterSubmit function (same as landing page)
- Insert newsletter card component after ContentCarousel, before Call to Action
- Adapt card title/subtitle for motivators context if needed

2. Add newsletter signup component to `src/app/did-you-know/page.tsx`

- Add state management (email, isSubmitting, message)
- Add handleNewsletterSubmit function (same as landing page)
- Insert newsletter card component after ContentCarousel, before Call to Action
- Adapt card title/subtitle for did-you-know context if needed

## Files to Update

### Pages Requiring Updates (in order of priority):

1. **High Priority - Title/Subtitle Issues:**

- `src/app/bench-boss/page.tsx` - Title size, spacing
- `src/app/captain-heart/page.tsx` - Title size, spacing
- `src/app/rink-philosopher/page.tsx` - Title size, spacing
- `src/app/about/page.tsx` - Subtitle container, spacing
- `src/app/faq/page.tsx` - Subtitle container, spacing
- `src/app/ethos/page.tsx` - Subtitle container, spacing
- `src/app/shop/page.tsx` - Subtitle container, spacing
- `src/app/support/page.tsx` - Subtitle container, spacing
- `src/app/privacy/page.tsx` - Subtitle container, spacing
- `src/app/terms/page.tsx` - Subtitle container, spacing
- `src/app/the-code/page.tsx` - Subtitle container, spacing
- `src/app/game-plan/page.tsx` - Title size, subtitle container
- `src/app/pre-game/page.tsx` - Title size, subtitle container
- `src/app/my-records/page.tsx` - Title size, subtitle container
- `src/app/hockey-culture/page.tsx` - Title size, subtitle container
- `src/app/pbp/page.tsx` - Title size, subtitle container

2. **Medium Priority - Padding/Container Issues:**

- All pages need padding standardization (`pb-12`, `px-4 md:px-6 lg:px-8`)
- Title section spacing (`mb-16 md:mb-20`)

3. **Medium Priority - Newsletter Component:**

- `src/app/motivators/page.tsx` - Add newsletter signup component
- `src/app/did-you-know/page.tsx` - Add newsletter signup component

4. **Low Priority - Background Consistency:**

- Verify gradient vs solid background decisions are intentional

## Testing Checklist

After implementation, verify:

- [ ] All H1 titles have consistent size and weight
- [ ] All subtitles have consistent styling and container
- [ ] All pages have consistent padding (top, bottom, horizontal)
- [ ] Title section spacing is consistent (`mb-16 md:mb-20`)
- [ ] PageNavigationButtons spacing is consistent (`mb-6 md:mb-8`)
- [ ] Responsive breakpoints work correctly on all pages
- [ ] Dark mode styling is consistent
- [ ] Fonts remain unchanged (Inter)
- [ ] Colors remain unchanged

## Newsletter Signup Component Details

The newsletter signup component from the landing page includes:

### Component Structure

- **Card container**: `w-[19.5rem] sm:w-[22.5rem] md:w-[42.5rem] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-4 border-gray-900 dark:border-gray-100`
- **Header section**: "Ready to Play?" title with subtitle
- **Newsletter section**: Email input, subscribe button, success/error messages
- **Positioning**: Centered with `flex justify-center mt-10`

### Required State Management

```typescript
const [email, setEmail] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const [message, setMessage] = useState<{
  type: "success" | "error";
  text: string;
} | null>(null);
```

### Required Function

- `handleNewsletterSubmit` - Handles form submission, calls `/api/newsletter` endpoint

### Placement

- Insert after ContentCarousel component
- Before existing Call to Action section
- Maintain consistent spacing with `mt-10`

### Adaptation Notes

- For Motivators page: Consider adapting title/subtitle to match context (e.g., "Want More Inspiration?" or keep generic "Ready to Play?")
- For Did You Know page: Consider adapting title/subtitle to match context (e.g., "Stay Curious?" or keep generic "Ready to Play?")
- Keep newsletter prompt text consistent: "Want hockey trivia updates?"

## Notes

- **Fonts**: No changes needed - Inter is already universal via `layout.tsx`
- **Colors**: No changes needed - preserve existing color scheme
- **Focus**: Standardize spacing, typography sizes, and layout structure only
- **Preserve**: All functional code, component logic, and content remain unchanged
- **Newsletter Component**: Use exact same implementation as landing page for consistency