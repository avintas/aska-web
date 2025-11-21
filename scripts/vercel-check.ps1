# Vercel Build Check Script (PowerShell)
# Runs the same checks that Vercel runs during deployment

Write-Host "🚀 Running Vercel build checks..." -ForegroundColor Cyan
Write-Host ""

# Step 1: TypeScript type checking
Write-Host "📝 Step 1: TypeScript type checking..." -ForegroundColor Yellow
npm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ TypeScript errors found! Fix them before deploying." -ForegroundColor Red
    exit 1
}
Write-Host "✅ TypeScript check passed" -ForegroundColor Green
Write-Host ""

# Step 2: Pattern-based checks
Write-Host "🔍 Step 2: Pattern-based type checks..." -ForegroundColor Yellow
npm run type-check:patterns
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Pattern checks failed! Fix them before deploying." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Pattern checks passed" -ForegroundColor Green
Write-Host ""

# Step 3: Full Next.js build (same as Vercel)
Write-Host "🏗️  Step 3: Running Next.js build (same as Vercel)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! This is what Vercel will see." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 All checks passed! Safe to deploy to Vercel." -ForegroundColor Green

