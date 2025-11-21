# Scripts

This directory contains utility scripts for development and CI/CD.

## Type Checking Scripts

### `type-check.ts`

A pattern-based type checker that identifies common TypeScript anti-patterns that might pass locally but fail in strict CI/CD environments (like Vercel).

**What it checks:**
- Supabase query variable reassignment with `.single()` or `.maybeSingle()`
- Other query reassignment patterns that can cause type errors

**Usage:**
```bash
# Run pattern checker
npm run type-check:patterns

# Run full TypeScript compiler check
npm run type-check

# Run both checks
npm run type-check:all
```

**When it runs:**
- Automatically on every commit (via pre-commit hook)
- Can be run manually before pushing to catch issues early

**Example output:**
```
🔍 Running type check for common TypeScript issues...

❌ Found potential type issues:

📄 src/app/api/public/shareables/facts/route.ts:
   Line 46: query reassignment with .single()/.maybeSingle()
   ⚠️  Reassigning a query variable after calling .single() or .maybeSingle() 
       changes the return type and causes TypeScript errors in strict mode. 
       Use a ternary operator or separate variables instead.
```

## Pre-commit Hook

The `.husky/pre-commit` hook automatically runs:
1. Pattern-based type checking (`type-check:patterns`)
2. ESLint and Prettier (via `lint-staged`)

To bypass the hook (not recommended):
```bash
git commit --no-verify
```

