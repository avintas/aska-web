# Windows Development Fixes

## Problem

Repeated `Cannot find module './[number].js'` errors during development on Windows. This happens every time files are changed due to Next.js webpack module resolution issues on Windows.

## Root Causes

1. **Next.js 15.x + Windows** - Hot reload regression bugs
2. **Webpack file watching** - Windows file system slower than Unix
3. **Module chunking** - Dynamic chunk files get corrupted during hot reload
4. **Cache corruption** - `.next` folder state becomes inconsistent

## Solutions Implemented

### 1. **Turbopack Enabled (Primary Fix)**

Changed dev script from:
```json
"dev": "next dev -p 3001"
```

To:
```json
"dev": "next dev --turbo -p 3001"
```

**Why this helps:**
- Turbopack is Next.js's new bundler (Rust-based)
- Much faster and more stable on Windows
- Better file watching
- Less prone to cache corruption
- Native support in Next.js 15

### 2. **Enhanced Webpack Configuration**

Added to `next.config.ts`:

```typescript
experimental: {
  webpackMemoryOptimizations: true,
},

webpack: (webpackConfig, { dev, isServer }) => {
  if (dev) {
    // Disable caching
    webpackConfig.cache = false;

    // Better file watching for Windows
    webpackConfig.watchOptions = {
      poll: 1000, // Check every second
      aggregateTimeout: 300, // Wait 300ms before rebuild
      ignored: /node_modules/,
    };

    // Prevent chunk splitting in dev
    if (!isServer) {
      webpackConfig.optimization = {
        runtimeChunk: false,
        splitChunks: false,
      };
    }
  }
}
```

**What this does:**
- **Poll mode**: Actively checks for file changes (more reliable on Windows)
- **No code splitting in dev**: Prevents dynamic chunk issues
- **No caching**: Trades speed for stability
- **Memory optimizations**: Reduces memory pressure

### 3. **Clean Restart Scripts**

#### PowerShell Script: `clean-dev.ps1`
```powershell
.\clean-dev.ps1
```

#### NPM Script:
```bash
npm run dev:clean
```

Both do the same thing:
- Delete `.next` folder
- Delete `tsconfig.tsbuildinfo`
- Restart dev server fresh

## How to Use

### Normal Development
```bash
npm run dev
```

This now uses Turbopack and should work smoothly without errors.

### If You Still Get Errors (Rare)
```bash
npm run dev:clean
```

Or on PowerShell:
```powershell
.\clean-dev.ps1
```

This forces a complete clean restart.

## Expected Behavior

### Before Fix:
- ❌ Error after every file change
- ❌ Need to manually restart server constantly
- ❌ Delete `.next` folder manually

### After Fix:
- ✅ Hot reload works smoothly
- ✅ File changes update without errors
- ✅ Rare need to clean restart (maybe once per week max)

## If Problems Persist

### Try These in Order:

1. **Clean node_modules** (if not done in a while):
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

2. **Check file permissions**: Ensure your user has full read/write access to the project folder

3. **Disable antivirus scanning** on the project folder (can interfere with file watching)

4. **Check disk space**: Low disk space can cause cache corruption

5. **Update Node.js**: Ensure you're on Node 18+ LTS

## Technical Details

### Why Windows is Affected More:

- **File watching**: Windows uses different file watching APIs (ReadDirectoryChangesW) vs Linux (inotify)
- **File locking**: Windows locks files being read/written more aggressively
- **Path separators**: Backslash vs forward slash can cause issues in module resolution
- **Case sensitivity**: Windows is case-insensitive, can cause caching issues

### Why Turbopack Helps:

- Written in Rust (not JavaScript)
- Better cross-platform file watching
- Simpler architecture = fewer edge cases
- Native to Next.js 15 (well-tested)

## Monitoring Success

Track if the fix worked:
- **Before**: Errors every single file change
- **After**: Maybe 1-2 clean restarts per week at most

If you still get errors constantly, there may be a deeper system issue (antivirus, permissions, disk).

---

**Last Updated**: December 2024
**Next.js Version**: 15.5.7
**Status**: ✅ Implemented

