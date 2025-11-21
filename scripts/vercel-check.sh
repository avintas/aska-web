#!/bin/bash
# Vercel Build Check Script
# Runs the same checks that Vercel runs during deployment

set -e  # Exit on any error

echo "🚀 Running Vercel build checks..."
echo ""

# Step 1: TypeScript type checking
echo "📝 Step 1: TypeScript type checking..."
npm run type-check || {
  echo "❌ TypeScript errors found! Fix them before deploying."
  exit 1
}
echo "✅ TypeScript check passed"
echo ""

# Step 2: Pattern-based checks
echo "🔍 Step 2: Pattern-based type checks..."
npm run type-check:patterns || {
  echo "❌ Pattern checks failed! Fix them before deploying."
  exit 1
}
echo "✅ Pattern checks passed"
echo ""

# Step 3: Full Next.js build (same as Vercel)
echo "🏗️  Step 3: Running Next.js build (same as Vercel)..."
npm run build || {
  echo "❌ Build failed! This is what Vercel will see."
  exit 1
}
echo "✅ Build successful!"
echo ""
echo "🎉 All checks passed! Safe to deploy to Vercel."

