# PWA Testing Guide

## ✅ Pre-Testing Checklist

- [x] `manifest.json` created in `public/`
- [x] App icons generated (`icon-192.png`, `icon-512.png`)
- [x] Metadata configured in `src/app/layout.tsx`
- [x] Viewport settings configured
- [x] Theme colors set

---

## 🧪 Testing Methods

### Method 1: Local Testing (Development)

**Step 1: Start Development Server**
```bash
npm run dev
```

**Step 2: Access via Network IP**
- Find your local IP address (e.g., `192.168.1.100`)
- Access from mobile device: `http://YOUR_IP:3001`
- **Important:** Both devices must be on the same Wi-Fi network

**Step 3: Test Installation**
- Follow mobile testing instructions below

---

### Method 2: Production Testing (Recommended)

**Step 1: Deploy to Vercel**
```bash
git add .
git commit -m "Add PWA support with app icons"
git push
```

**Step 2: Wait for Deployment**
- Vercel will deploy automatically
- Wait for deployment to complete (~2-3 minutes)

**Step 3: Test on Mobile Device**
- Visit your production URL on mobile device
- Follow platform-specific instructions below

---

## 📱 Mobile Testing Instructions

### iOS (iPhone/iPad) - Safari

1. **Open Safari** (not Chrome - Safari is required for iOS PWA)
2. **Navigate** to your site URL
3. **Look for Install Prompt:**
   - Tap the **Share button** (square with arrow pointing up)
   - Scroll down and tap **"Add to Home Screen"**
   - Or look for banner at bottom of screen
4. **Customize Name** (optional):
   - Default: "OnlyHockey"
   - Tap "Add" to confirm
5. **Verify Installation:**
   - App icon appears on home screen
   - Tap icon to launch
   - **Check:** No browser UI (address bar, navigation buttons)
   - **Check:** Full-screen experience

**Expected Result:**
- ✅ App opens without Safari UI
- ✅ Icon matches your generated icon
- ✅ App name shows "OnlyHockey"
- ✅ Status bar matches theme color (navy blue)

---

### Android - Chrome

1. **Open Chrome** browser
2. **Navigate** to your site URL
3. **Look for Install Banner:**
   - Banner appears at bottom: "Install OnlyHockey"
   - Or tap **Menu** (3 dots) → **"Install app"**
4. **Confirm Installation:**
   - Tap "Install" in the banner/dialog
   - App installs automatically
5. **Verify Installation:**
   - App icon appears on home screen/app drawer
   - Tap icon to launch
   - **Check:** No browser UI (address bar, navigation buttons)
   - **Check:** Standalone window

**Expected Result:**
- ✅ App opens in standalone window
- ✅ Icon matches your generated icon
- ✅ App name shows "OnlyHockey"
- ✅ No browser chrome visible

---

### Desktop Testing (Chrome/Edge)

1. **Open Chrome or Edge**
2. **Navigate** to your site URL
3. **Look for Install Icon:**
   - Install icon appears in address bar (right side)
   - Or go to **Menu** → **"Install OnlyHockey..."**
4. **Click Install:**
   - Confirm installation dialog
5. **Verify Installation:**
   - App opens in standalone window
   - Check taskbar/dock for app icon
   - **Check:** No browser UI visible

**Expected Result:**
- ✅ App opens in standalone window
- ✅ Window title shows "OnlyHockey"
- ✅ No browser UI visible

---

## 🔍 Verification Checklist

After installation, verify:

### Visual Checks:
- [ ] App icon appears correctly (hockey stick design)
- [ ] App name is "OnlyHockey"
- [ ] No browser address bar visible
- [ ] No browser navigation buttons visible
- [ ] Status bar color matches theme (navy blue on iOS)

### Functional Checks:
- [ ] App opens from home screen icon
- [ ] Navigation works correctly
- [ ] Pages load properly
- [ ] Responsive design works on mobile
- [ ] Dark/light theme switching works

### Technical Checks:
- [ ] Manifest loads correctly (`/manifest.json`)
- [ ] Icons load correctly (`/icon-192.png`, `/icon-512.png`)
- [ ] Theme color applied correctly
- [ ] Viewport settings working

---

## 🐛 Troubleshooting

### Issue: Install prompt doesn't appear

**iOS Safari:**
- Make sure you're using Safari (not Chrome)
- Try clearing Safari cache
- Check that site is accessed via HTTPS (required for PWA)

**Android Chrome:**
- Make sure site is accessed via HTTPS
- Check Chrome version (needs Chrome 67+)
- Try clearing Chrome cache
- Check if "Add to Home Screen" is available in menu

**Desktop:**
- Make sure Chrome/Edge version supports PWA
- Check if site is accessed via HTTPS
- Try incognito/private mode

---

### Issue: Browser UI still visible

**Possible Causes:**
- Manifest not loading correctly
- `display: "standalone"` not set
- Browser doesn't support PWA
- Site not installed correctly

**Solutions:**
- Check browser console for manifest errors
- Verify `manifest.json` is accessible at `/manifest.json`
- Reinstall the app
- Try different browser

---

### Issue: Icons not showing

**Possible Causes:**
- Icon files not found
- Incorrect paths in manifest
- Icons not in `public/` directory

**Solutions:**
- Verify icons exist: `public/icon-192.png`, `public/icon-512.png`
- Check manifest paths are `/icon-192.png` (not `/public/icon-192.png`)
- Clear browser cache
- Regenerate icons: `npm run generate-icons`

---

### Issue: App opens in browser instead of standalone

**Possible Causes:**
- Manifest not properly configured
- Browser cache issue
- Site not installed as PWA

**Solutions:**
- Uninstall and reinstall the app
- Clear browser cache
- Verify `manifest.json` has `"display": "standalone"`
- Check browser console for errors

---

## 📊 Testing Tools

### Chrome DevTools (Desktop)

1. **Open DevTools** (F12)
2. **Go to Application tab**
3. **Check Manifest:**
   - Should show your manifest details
   - Icons should be listed
   - Display mode should be "standalone"
4. **Check Service Workers** (if you add one later)
5. **Test on Mobile:**
   - Click device toolbar icon
   - Select device
   - Test responsive design

### Lighthouse (Chrome)

1. **Open DevTools** (F12)
2. **Go to Lighthouse tab**
3. **Select "Progressive Web App"**
4. **Run audit**
5. **Check results:**
   - Should show PWA score
   - Will highlight any issues

---

## ✅ Success Criteria

Your PWA is working correctly if:

1. ✅ Install prompt appears on mobile devices
2. ✅ App installs successfully
3. ✅ App icon appears on home screen
4. ✅ App opens without browser UI
5. ✅ Navigation works correctly
6. ✅ Theme colors applied correctly
7. ✅ Responsive design works

---

## 🚀 Next Steps After Testing

Once PWA is verified working:

1. **Monitor Analytics:**
   - Track PWA installs
   - Monitor user engagement

2. **Consider Adding:**
   - Service Worker (offline support)
   - Push notifications
   - App shortcuts

3. **Optimize:**
   - Improve loading performance
   - Add offline fallback pages
   - Enhance mobile UX

---

## 📝 Notes

- **HTTPS Required:** PWAs require HTTPS (except localhost)
- **Browser Support:** Not all browsers support all PWA features
- **iOS Limitations:** iOS Safari has some PWA limitations compared to Android
- **Testing:** Always test on real devices, not just emulators

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify manifest.json is valid JSON
3. Test manifest at: https://manifest-validator.appspot.com/
4. Check PWA requirements: https://web.dev/pwa-checklist/

