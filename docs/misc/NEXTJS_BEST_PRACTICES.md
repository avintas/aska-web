# Next.js Best Practices & Known Gotchas

This document outlines known Next.js gotchas and best practices to proactively address during development.

## CSS Imports

### ❌ DON'T: Use Path Aliases for CSS Imports
```typescript
// This may not work reliably in Next.js CSS processing pipeline
import "@/global.css";
```

### ✅ DO: Use Relative Paths for CSS Imports
```typescript
// Always use relative paths for CSS imports
import "../global.css";
```

**Why:** Next.js's CSS processor (PostCSS/Tailwind) doesn't always resolve TypeScript path aliases correctly. Relative paths work consistently across all Next.js versions.

---

## Image Imports

### ✅ DO: Use Path Aliases for Image Imports
```typescript
// Path aliases work fine for image imports
import logo from "@/assets/logo.png";
```

### ✅ DO: Use Next.js Image Component
```typescript
import Image from "next/image";
<Image src="/images/logo.png" alt="Logo" width={100} height={100} />
```

---

## File Structure

### ✅ DO: Follow App Router Structure
```
src/
  app/           # App Router pages (Next.js 13+)
  components/    # React components
  utils/         # Utility functions
  shared/        # Shared types/utilities
```

### ❌ DON'T: Mix Pages Router with App Router
- Use either `src/app/` (App Router) OR `src/pages/` (Pages Router)
- Don't use both simultaneously

---

## TypeScript Path Aliases

### ✅ DO: Use Aliases for TypeScript/JavaScript Imports
```typescript
// These work fine for .ts, .tsx, .js, .jsx files
import { Component } from "@/components/Component";
import { utility } from "@/utils/utility";
```

### Configuration
- Defined in `tsconfig.json` under `compilerOptions.paths`
- Example: `"@/*": ["./src/*"]`

---

## Environment Variables

### ✅ DO: Use `.env.local` for Local Development
```bash
# .env.local (gitignored)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### ✅ DO: Prefix Public Variables
- Use `NEXT_PUBLIC_` prefix for client-side accessible variables
- Server-only variables don't need the prefix

### ❌ DON'T: Commit `.env.local`
- Already in `.gitignore` by default
- Use `.env.example` for documentation

---

## Metadata & SEO

### ✅ DO: Export Metadata from Layout/Page
```typescript
export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};
```

### ✅ DO: Use Dynamic Metadata When Needed
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `Page ${params.id}`,
  };
}
```

---

## Server Components vs Client Components

### ✅ DO: Use Server Components by Default
```typescript
// Server Component (default)
export default function Page() {
  return <div>Server rendered</div>;
}
```

### ✅ DO: Mark Client Components Explicitly
```typescript
"use client";
// Client Component (needed for hooks, interactivity)
export default function InteractiveComponent() {
  const [state, setState] = useState();
  return <div>Client rendered</div>;
}
```

---

## Font Loading

### ✅ DO: Use Next.js Font Optimization
```typescript
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// In layout.tsx
<html className={inter.variable}>
  <body className={inter.className}>
```

---

## Tailwind CSS Configuration

### ✅ DO: Configure Content Paths Correctly
```typescript
// tailwind.config.ts
content: [
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
],
```

### ✅ DO: Import CSS in Root Layout
```typescript
// src/app/layout.tsx
import "../global.css"; // Use relative path!
```

---

## API Routes

### ✅ DO: Use Route Handlers in App Router
```typescript
// src/app/api/example/route.ts
export async function GET(request: Request) {
  return Response.json({ data: "example" });
}
```

### ❌ DON'T: Use Pages Router API Routes with App Router
- Use Route Handlers (`route.ts`) in App Router
- Use API Routes (`pages/api/`) only in Pages Router

---

## Data Fetching

### ✅ DO: Use Async Components in App Router
```typescript
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### ✅ DO: Handle Errors with Error Boundaries
```typescript
// src/app/error.tsx
"use client";
export default function Error({ error, reset }) {
  return <div>Error: {error.message}</div>;
}
```

---

## Checklist for New Pages/Components

When creating new pages or components, verify:

- [ ] CSS imports use relative paths (not aliases)
- [ ] TypeScript/JavaScript imports use path aliases (`@/`)
- [ ] Server components are used by default
- [ ] Client components have `"use client"` directive
- [ ] Metadata is exported if needed
- [ ] Images use Next.js `Image` component
- [ ] Environment variables use correct prefix
- [ ] Tailwind classes are in content paths
- [ ] Error handling is implemented

---

## Common Issues & Solutions

### Issue: Styles Not Applying
**Solution:** Check CSS import uses relative path, not alias

### Issue: Path Alias Not Resolving
**Solution:** Verify `tsconfig.json` paths configuration

### Issue: Build Errors with CSS
**Solution:** Ensure PostCSS config includes Tailwind and Autoprefixer

### Issue: Images Not Loading
**Solution:** Use Next.js `Image` component or place in `public/` folder

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)











