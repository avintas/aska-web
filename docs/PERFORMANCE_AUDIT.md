# Performance Audit Report
**Date:** January 25, 2026  
**Page:** Landing Page (`/`)  
**Status:** ⚠️ CRITICAL - Unacceptable Load Performance

---

## 🔴 Critical Issues

### 1. **Blocking Client-Side API Calls on Initial Render**

**Problem:**
- `PageSlogan` component makes API call (`/api/collections/shareables`) in `useEffect` on every page load
- `Navbar` component makes **multiple Supabase API calls** on mount:
  - `supabase.auth.getSession()` - blocks render
  - `supabase.from("user_profiles").select()` - blocks render  
  - `supabase.from("user_stats").select()` - blocks render
- These calls happen **synchronously** and block the initial page render

**Impact:** 
- **Waterfall loading**: Page waits for API responses before showing content
- **Poor First Contentful Paint (FCP)**: Content appears delayed
- **Poor Largest Contentful Paint (LCP)**: Main content delayed by API calls
- **Double API calls**: React StrictMode causes PageSlogan to fetch twice in dev

**Evidence:**
```typescript
// src/components/PageSlogan.tsx:13-35
useEffect(() => {
  async function fetchSlogan() {
    const response = await fetch("/api/collections/shareables"); // BLOCKS RENDER
    // ...
  }
  fetchSlogan();
}, []);

// src/components/Navbar.tsx:28-62
useEffect(() => {
  checkAuth(); // Multiple Supabase calls
  // ...
}, []);
```

**Why it's slow:**
- Network latency adds 100-500ms+ per API call
- Multiple sequential calls compound the delay
- No caching means every page load repeats these calls

---

### 2. **Heavy Components Loading Immediately**

**Problem:**
- `LandingCarousel` loads **Embla Carousel library** (~50KB) immediately
- `HubGrid` renders **all 15 cells** immediately (even inactive ones)
- **40+ inactive images** referenced in `carousel-cards.ts` that may load
- Carousel initializes on mount with complex state management

**Impact:**
- **Large JavaScript bundle** loaded upfront
- **Multiple DOM elements** rendered before needed
- **Animation libraries** initialized immediately
- **Memory overhead** from carousel state

**Evidence:**
```typescript
// src/components/LandingCarousel.tsx:4
import useEmblaCarousel from "embla-carousel-react"; // ~50KB library

// src/config/carousel-cards.ts
// 40+ inactive images referenced: hcip-1.png through hcip-40.png
createInactiveCell(1), createInactiveCell(2), // ... 40+ times
```

**Why it's slow:**
- Embla library adds ~50KB to initial bundle
- Carousel initialization runs synchronously
- All cells rendered even if not visible

---

### 3. **Unoptimized Image Loading**

**Problem:**
- Using `<img>` tags instead of Next.js `<Image>` component
- **No lazy loading** for images
- **No image optimization** (no WebP/AVIF conversion)
- **No width/height attributes** causing layout shift
- **40+ images** potentially loading simultaneously

**Impact:**
- **Poor Core Web Vitals**: Layout shifts (CLS)
- **Large file sizes**: PNGs not optimized
- **Bandwidth waste**: Loading images not in viewport
- **No responsive images**: Same image for all screen sizes

**Evidence:**
```typescript
// src/components/HubGrid.tsx:84-88
<img
  src={cell.inactiveImage}
  alt=""
  className="w-full h-full object-cover opacity-10"
/>
// ❌ No Next.js Image component
// ❌ No lazy loading
// ❌ No optimization
```

**Why it's slow:**
- Images load synchronously blocking render
- No compression/optimization
- Large file sizes (PNG format)
- All images load even if not visible

---

### 4. **No Code Splitting or Lazy Loading**

**Problem:**
- All components imported **synchronously**
- No `dynamic()` imports for heavy components
- No route-based code splitting
- Carousel, modals, and heavy components load immediately

**Impact:**
- **Large initial bundle**: All JavaScript loaded upfront
- **Slow Time to Interactive (TTI)**: JavaScript parsing blocks interactivity
- **Wasted bandwidth**: Loading code not immediately needed

**Evidence:**
```typescript
// src/app/page.tsx:4-7
import { LandingCarousel } from "@/components/LandingCarousel"; // ❌ Synchronous
import { PageNavigationButtons } from "@/components/PageNavigationButtons";
import { StoreModal } from "@/components/StoreModal";
import { PageSlogan } from "@/components/PageSlogan";
```

**Why it's slow:**
- All components bundled together
- No lazy loading for below-the-fold content
- Carousel library loaded even if user doesn't scroll

---

### 5. **Multiple Re-renders and Unnecessary Effects**

**Problem:**
- `Navbar` has **multiple useEffect hooks** that run on every mount
- `PageSlogan` fetches on **every page load** (no caching)
- `LandingCarousel` has complex state management with multiple effects
- No memoization of expensive computations

**Impact:**
- **Unnecessary API calls**: Repeated on every navigation
- **Re-renders**: Components update multiple times
- **CPU overhead**: Effects running unnecessarily

**Evidence:**
```typescript
// src/components/Navbar.tsx
useEffect(() => { checkAuth(); }, []); // Runs on every mount
useEffect(() => { /* auth listener */ }, []); // Another effect

// src/components/PageSlogan.tsx
useEffect(() => { fetchSlogan(); }, []); // No caching, runs every time
```

**Why it's slow:**
- Effects trigger re-renders
- API calls repeated unnecessarily
- No memoization means recalculations

---

### 6. **No API Response Caching**

**Problem:**
- API routes have **no caching headers**
- Client-side fetch has **no caching strategy**
- Same data fetched repeatedly
- No service worker or browser cache utilization

**Impact:**
- **Repeated network requests**: Same data fetched multiple times
- **Wasted bandwidth**: Redundant API calls
- **Slow subsequent loads**: No benefit from previous fetches

**Evidence:**
```typescript
// src/app/api/collections/shareables/route.ts
// ❌ No cache headers
// ❌ No revalidate configuration
export async function GET(): Promise<NextResponse> {
  // ...
}
```

**Why it's slow:**
- Every page load = new API call
- No browser cache utilization
- Network latency on every request

---

## 📊 Performance Metrics (Estimated)

Based on the issues identified:

| Metric | Current (Estimated) | Target | Status |
|--------|-------------------|--------|--------|
| **First Contentful Paint (FCP)** | 2.5-4.0s | < 1.8s | 🔴 Poor |
| **Largest Contentful Paint (LCP)** | 3.5-5.0s | < 2.5s | 🔴 Poor |
| **Time to Interactive (TTI)** | 4.0-6.0s | < 3.8s | 🔴 Poor |
| **Total Blocking Time (TBT)** | 800-1200ms | < 300ms | 🔴 Poor |
| **Cumulative Layout Shift (CLS)** | 0.15-0.25 | < 0.1 | 🟡 Needs Work |
| **Initial Bundle Size** | ~250-350KB | < 200KB | 🟡 Needs Work |

---

## 🎯 Recommended Solutions (Priority Order)

### **Priority 1: Critical (Immediate Impact)**

#### 1.1 Move API Calls to Server-Side
- **Convert `PageSlogan` to Server Component** or use Server-Side Rendering
- **Pre-fetch slogan data** in page component or layout
- **Pass data as props** instead of client-side fetching
- **Expected improvement**: 500-1000ms faster FCP

#### 1.2 Optimize Navbar Auth Checks
- **Move auth check to server-side** (Server Component)
- **Use middleware** for auth state
- **Defer user profile/stats loading** (load after initial render)
- **Expected improvement**: 300-600ms faster TTI

#### 1.3 Implement Image Optimization
- **Replace `<img>` with Next.js `<Image>` component**
- **Add `loading="lazy"`** for below-the-fold images
- **Convert PNGs to WebP/AVIF** format
- **Add width/height attributes** to prevent layout shift
- **Expected improvement**: 200-400ms faster LCP, better CLS

#### 1.4 Add API Response Caching
- **Add `Cache-Control` headers** to API routes
- **Implement `revalidate`** for stale-while-revalidate
- **Use browser cache** for static data
- **Expected improvement**: 300-500ms faster on subsequent loads

---

### **Priority 2: High Impact**

#### 2.1 Implement Code Splitting
- **Lazy load `LandingCarousel`** with `dynamic()`
- **Lazy load `StoreModal`** (only when needed)
- **Split carousel library** into separate chunk
- **Expected improvement**: 100-200KB smaller initial bundle

#### 2.2 Defer Non-Critical Components
- **Load carousel after initial render** (intersection observer)
- **Defer inactive images** loading
- **Load modals on-demand**
- **Expected improvement**: 200-400ms faster TTI

#### 2.3 Optimize Carousel Loading
- **Load only first card initially**
- **Lazy load other carousel cards**
- **Defer Embla initialization** until needed
- **Expected improvement**: 150-300ms faster initial load

---

### **Priority 3: Medium Impact**

#### 3.1 Add Memoization
- **Memoize expensive computations**
- **Use `useMemo` for derived state**
- **Cache API responses** in component state
- **Expected improvement**: Reduced re-renders, smoother interactions

#### 3.2 Optimize Bundle Size
- **Tree-shake unused code**
- **Remove unused dependencies**
- **Split vendor chunks**
- **Expected improvement**: 50-100KB smaller bundle

#### 3.3 Implement Service Worker
- **Cache API responses**
- **Cache static assets**
- **Offline support**
- **Expected improvement**: Instant loads on repeat visits

---

## 🔧 Implementation Examples

### Example 1: Server-Side PageSlogan
```typescript
// src/app/page.tsx (Server Component)
import { createServerClient } from "@/utils/supabase/server";

export default async function Home() {
  // Fetch on server - no client-side delay
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("source_content_shareables")
    .select("content")
    .eq("content_type", "slogans")
    .limit(100);
  
  const randomSlogan = data?.[Math.floor(Math.random() * data.length)]?.content;
  
  return <PageSlogan initialSlogan={randomSlogan} />;
}
```

### Example 2: Lazy Load Carousel
```typescript
// src/app/page.tsx
import dynamic from "next/dynamic";

const LandingCarousel = dynamic(
  () => import("@/components/LandingCarousel").then(mod => ({ default: mod.LandingCarousel })),
  { 
    loading: () => <div>Loading...</div>,
    ssr: false // Client-side only
  }
);
```

### Example 3: Optimized Images
```typescript
// src/components/HubGrid.tsx
import Image from "next/image";

<Image
  src={cell.inactiveImage}
  alt=""
  width={128}
  height={128}
  loading="lazy"
  className="w-full h-full object-cover opacity-10"
/>
```

### Example 4: API Caching
```typescript
// src/app/api/collections/shareables/route.ts
export async function GET() {
  // ...
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  });
}
```

---

## 📈 Expected Performance Improvements

After implementing Priority 1 solutions:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **FCP** | 2.5-4.0s | 1.2-1.8s | **50-60% faster** |
| **LCP** | 3.5-5.0s | 2.0-2.8s | **40-45% faster** |
| **TTI** | 4.0-6.0s | 2.5-3.5s | **35-40% faster** |
| **Bundle Size** | 250-350KB | 180-250KB | **30-40% smaller** |

---

## 🚨 Why It's Currently Slow - Summary

1. **Waterfall Loading**: API calls block render → content appears delayed
2. **Large Bundle**: All JavaScript loaded upfront → slow parsing
3. **Unoptimized Images**: Large PNGs, no lazy loading → slow LCP
4. **No Caching**: Repeated API calls → wasted time
5. **Heavy Components**: Carousel/library loaded immediately → blocks TTI
6. **Multiple Re-renders**: Unnecessary effects → CPU overhead

**Root Cause**: Client-side data fetching + heavy components + no optimization = slow initial load

---

## ✅ Next Steps

1. **Immediate**: Implement Priority 1 solutions (server-side data fetching)
2. **Short-term**: Add image optimization and code splitting
3. **Medium-term**: Implement caching and service worker
4. **Long-term**: Monitor and optimize based on real user metrics

---

**Note**: This audit identifies the issues. Implementation should be done incrementally with performance testing after each change.
