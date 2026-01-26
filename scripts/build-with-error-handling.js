#!/usr/bin/env node
/**
 * Build script wrapper that handles unhandled rejections
 * This is needed because Next.js 15 sometimes throws unhandled rejections
 * for internal checks (like _document) that don't actually fail the build
 */

const { execSync } = require('child_process');

// Handle unhandled rejections - these are often non-fatal Next.js internal checks
process.on('unhandledRejection', (reason, promise) => {
  // Log but don't fail if it's a PageNotFoundError for _document
  // (this is a known Next.js App Router quirk)
  if (reason && reason.code === 'ENOENT' && reason.message && reason.message.includes('_document')) {
    console.warn('⚠️  Warning: Next.js internal _document check (non-fatal)');
    return;
  }
  // For other unhandled rejections, log them but continue
  console.warn('⚠️  Unhandled rejection:', reason);
});

try {
  console.log('🏗️  Running Next.js build...\n');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--no-warnings' }
  });
  console.log('\n✅ Build completed successfully');
  process.exit(0);
} catch (error) {
  // If build actually failed (exit code), exit with that code
  if (error.status !== null && error.status !== undefined) {
    process.exit(error.status);
  }
  // Otherwise exit with error code 1
  process.exit(1);
}
