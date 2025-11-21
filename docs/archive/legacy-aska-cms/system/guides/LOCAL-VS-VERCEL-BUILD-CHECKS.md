# Why Errors Show Up on Vercel But Not Locally

## The Problem

You write code, it works locally, you commit and push... then Vercel build fails with TypeScript errors. Why?

## Root Causes

### 1. **Different Build Processes**

| Environment | Command | Type Checking? |
|------------|---------|----------------|
| **Local Dev** | `npm run dev` | ❌ No - skips for speed |
| **Local Build** | `npm run build` | ✅ Yes - full check |
| **Vercel** | `npm run build` | ✅ Yes - full check |

**Key Insight:** `next dev` doesn't run full type checking. Only `next build` does.

### 2. **Cached Builds**

- **Local:** TypeScript uses incremental compilation (`.tsbuildinfo` files)
- **Vercel:** Fresh build every time, no cache
- **Result:** Local might miss errors that Vercel catches

### 3. **Pre-commit Hook Limitations**

Your old pre-commit hook only ran:
- Pattern-based checks (fast)
- ESLint
- Prettier

**Missing:** Full TypeScript compiler check (`tsc --noEmit`)

## The Solution

### ✅ What We've Set Up

1. **Updated Pre-commit Hook** - Now runs full TypeScript check
2. **Pre-push Hook** - Backup safety net
3. **Vercel Check Script** - Manual check command

### 🚀 How to Use

#### Before Committing (Automatic)
The pre-commit hook now automatically runs:
```bash
npm run type-check        # Full TypeScript check
npm run type-check:patterns  # Pattern checks
```

#### Before Pushing (Automatic)
The pre-push hook runs:
```bash
npm run vercel-check      # Full build check
```

#### Manual Check (Before Important Commits)
Run the same checks Vercel runs:
```bash
# Windows PowerShell
.\scripts\vercel-check.ps1

# Or use npm script
npm run vercel-check
```

This runs:
1. ✅ TypeScript type checking (`tsc --noEmit`)
2. ✅ Pattern-based checks
3. ✅ Full Next.js build (`next build`)

### 📋 Workflow Recommendations

**Before committing:**
```bash
# Quick check (runs automatically via pre-commit)
npm run type-check

# Full check (before important commits)
npm run vercel-check
```

**If pre-commit hook is bypassed:**
- Pre-push hook will catch errors
- Or run `npm run vercel-check` manually

## Why This Works

### Vercel's Build Process
```bash
npm install
npm run build  # ← This is what catches errors
```

### Our Local Check (Now Matches)
```bash
npm run type-check      # ← Same TypeScript check
npm run build          # ← Same Next.js build
```

**Result:** If it passes locally, it will pass on Vercel! 🎉

## Troubleshooting

### "But it works in dev mode!"
- `next dev` doesn't check types
- Always run `npm run build` before committing

### "Pre-commit hook is slow!"
- First run is slower (no cache)
- Subsequent runs use incremental compilation
- Still faster than waiting for Vercel build to fail

### "I need to bypass the hook!"
```bash
# Not recommended, but if you must:
git commit --no-verify
git push --no-verify
```

**Warning:** This bypasses ALL checks. Vercel will still fail if there are errors.

## Summary

**Before:** Local dev → Commit → Push → Vercel fails ❌

**Now:** Local dev → Run checks → Fix errors → Commit → Push → Vercel succeeds ✅

The key is running `npm run build` (or `npm run vercel-check`) locally before committing!

