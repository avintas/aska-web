# Clean restart script for Windows development
# Run this if you encounter module resolution errors

Write-Host "🧹 Cleaning Next.js cache..." -ForegroundColor Cyan

# Remove .next folder
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✓ Removed .next folder" -ForegroundColor Green
}

# Remove TypeScript build info
if (Test-Path "tsconfig.tsbuildinfo") {
    Remove-Item -Force "tsconfig.tsbuildinfo"
    Write-Host "✓ Removed TypeScript build cache" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Cache cleaned! Starting dev server..." -ForegroundColor Green
Write-Host ""

# Start dev server
npm run dev

