# State Restoration Feature

## Overview

**Problem:** When users refresh the page, they're sent back to home instead of staying on their current section.

**Solution:** Automatic state restoration that remembers:
- Main section (e.g., Personal Details, Employment, etc.)
- Sub-section (e.g., Address History, Dependants)
- Fact Find ID (which applicant)
- Scroll position

---

## How It Works

### 1. **Auto-Save State**
Every time user navigates:
```
User clicks → State saved to:
- localStorage (persists across refresh)
- URL parameters (for bookmarking)
```

### 2. **Auto-Restore on Refresh**
When page loads:
```
Page loads → Check for saved state → Restore position
```

### 3. **URL Support**
URLs are bookmarkable:
```
/my/bvs/home?section=%23personal-details&subsection=%23address-history&ffid=123
```

---

## What Gets Saved

| Item | Where Stored | Example |
|------|--------------|---------|
| **Main Section** | localStorage + URL | `#personal-details` |
| **Sub-section** | localStorage + URL | `#address-history` |
| **Fact Find ID** | localStorage + URL | `123` |
| **Scroll Position** | localStorage only | `450` (pixels) |

---

## Usage

### **For Users:**
Nothing changes! It just works:
1. Navigate to any section
2. Fill out forms
3. Refresh page (accidentally or intentionally)
4. ✅ Returns to same spot

### **For Developers:**
State is automatically tracked. No code changes needed in other files.

---

## Implementation Details

### **Files:**
- `state_restoration.js` - New enhancement module
- `__manifest__.py` - Updated to load after main widget

### **Load Order:**
```python
1. Core utilities (storage-manager, error-handler, etc.)
2. bvs_homebuyer_portal.js (original widget)
3. state_restoration.js (enhancement) ← NEW
4. Other modules
```

### **Integration:**
Uses Odoo's `publicWidget.registry.bvsHomebuyerPortal.include()` to extend existing widget without modifying original file.

---

## How State Restoration Works

### **On Navigation:**
```javascript
// User clicks sidebar item
User clicks "Personal Details"
  ↓
State saved:
  - Main: "#personal-details"
  - Sub: null
  - FF ID: current
  ↓
URL updated: ?section=%23personal-details&ffid=123
```

### **On Page Refresh:**
```javascript
// Page loads
Browser refreshes
  ↓
Check URL parameters
  ↓
If found: Restore from URL (for bookmarks)
If not: Restore from localStorage
  ↓
Show saved section
  ↓
Show saved sub-section (if exists)
  ↓
Scroll to saved position
```

---

## Testing

### **Test 1: Basic Restoration**
1. Navigate to Personal Details → Address History
2. Refresh page (F5)
3. ✅ Should stay on Address History

### **Test 2: Bookmark Support**
1. Navigate to any section
2. Copy URL
3. Open in new tab
4. ✅ Should go directly to that section

### **Test 3: Fact Find Switching**
1. Switch to different applicant
2. Navigate to Employment
3. Refresh
4. ✅ Should stay on same applicant's Employment page

### **Test 4: Scroll Position**
1. Navigate to long section
2. Scroll down
3. Refresh
4. ✅ Should restore scroll position

### **Test 5: Home Button**
1. Navigate to any section
2. Click "Home" button
3. ✅ State should clear
4. Refresh
5. ✅ Should go to home (not saved section)

---

## Console Messages

When working correctly, you'll see:

```javascript
// On page load:
"State Restoration: Initializing..."
"State Restoration: State tracking initialized"
"State Restoration: Scroll tracking initialized"

// If state exists:
"State restored from URL: { mainSection: '#personal-details', ... }"
// OR
"State restored from storage: { mainSection: '#personal-details', ... }"

// When restoring:
"State Restoration: Main section restored: #personal-details"
"State Restoration: Sub-section restored: #address-history"

// On navigation:
"State saved - Main: #personal-details"
"State saved - Sub: #address-history"
"State saved - FF ID: 123"
```

---

## Configuration

### **Enable/Disable:**

**To Disable:**
```python
# In __manifest__.py, comment out:
# 'bvs_homebuyer_portal/static/src/js/state_restoration.js',
```

**To Enable:**
```python
# In __manifest__.py, keep:
'bvs_homebuyer_portal/static/src/js/state_restoration.js',
```

### **Customize Behavior:**

Edit `state_restoration.js`:

```javascript
// Change delay before restoration (milliseconds):
setTimeout(function() {
    self._restoreState();
}, 500); // Change this value

// Change scroll save frequency (milliseconds):
scrollTimeout = setTimeout(function () {
    StateManager.saveScrollPosition();
}, 250); // Change this value
```

---

## Edge Cases Handled

### **1. Missing Sections:**
If saved section doesn't exist (removed/renamed):
```javascript
console.warn('State Restoration: Main section not found: #old-section');
// Falls back to home (graceful degradation)
```

### **2. Invalid Fact Find ID:**
If fact find no longer exists:
```javascript
// State restoration won't break page
// User sees home or current valid state
```

### **3. localStorage Disabled:**
Uses StorageManager with memory fallback:
```javascript
// Works in incognito mode
// Falls back to URL parameters only
```

### **4. Browser Back Button:**
Doesn't interfere with browser history:
```javascript
// Uses history.replaceState() not pushState()
// Back button works normally
```

---

## Troubleshooting

### **Issue: Not restoring state**

**Check:**
```javascript
// Browser console:
localStorage.getItem('bvs_current_main_section')
// Should show something like "#personal-details"
```

**Fix:**
- Clear cache and try again
- Check console for errors
- Verify state_restoration.js is loaded

### **Issue: Wrong section shown**

**Check:**
```javascript
// Browser console:
console.log(StorageManager.getItem('bvs_current_main_section'));
```

**Fix:**
- Click "Home" to clear state
- Navigate to correct section
- Refresh to test

### **Issue: URL not updating**

**Check:**
- Look at browser address bar
- Should show `?section=...` parameters

**Fix:**
- Check browser console for errors
- Verify modern browser (URL API support)

---

## Performance

### **Impact:**
- **Minimal** - Only saves state on navigation (not continuous)
- **Debounced** - Scroll position saved max once per 250ms
- **Async** - State restoration doesn't block page load

### **Storage:**
- ~100 bytes per saved state
- Cleaned up on logout/home
- No accumulation

---

## Browser Compatibility

✅ **Supported:**
- Chrome/Edge 51+
- Firefox 44+
- Safari 10+
- All modern browsers

❌ **Not Supported:**
- IE 11 (but won't break, just won't restore)

---

## Future Enhancements

Potential improvements:

1. **Form Data Persistence:**
   - Save partial form inputs
   - Restore on page refresh

2. **Multi-tab Sync:**
   - Sync state across tabs
   - Use localStorage events

3. **State History:**
   - Navigate back through sections
   - Undo navigation

4. **Smart Scroll:**
   - Remember scroll per section
   - Not just global scroll

---

## Deployment

### **Already Configured:**
✅ File created: `state_restoration.js`
✅ Manifest updated
✅ Uses existing utilities

### **Steps:**
1. Restart Odoo
2. Upgrade module
3. Clear browser cache
4. Test navigation + refresh

### **Rollback:**
If issues occur:
```python
# Comment out in __manifest__.py:
# 'bvs_homebuyer_portal/static/src/js/state_restoration.js',
```

---

## Summary

**What it does:**
- ✅ Remembers user's position
- ✅ Restores on refresh
- ✅ Supports bookmarks
- ✅ Tracks scroll position

**Benefits:**
- ✅ Better UX (no lost work)
- ✅ Fewer support tickets
- ✅ Professional feel
- ✅ No code changes to existing files

**Status:**
✅ Ready to deploy

---

**Created:** 2025-01-14
**Version:** 1.0.0
**Dependencies:** storage-manager.js
**Load Order:** After bvs_homebuyer_portal.js
