# W06 Project Rubric Completion Checklist

## Current Status: 85-90/100 Points Expected

### ✅ COMPLETED CRITERIA (No Action Needed)

1. **✅ Form Action Page (5/5 pts)**
   - Form data displayed using URLSearchParams on form-result.html

2. **✅ Displayed Data (5/5 pts)**
   - 20+ products from Fakestore API
   - Each product has: title, price, category, description, image

3. **✅ Local Storage (3/3 pts)**
   - Cart items stored in localStorage
   - Persists across page refreshes

4. **✅ Modal Dialog (4/4 pts)**
   - Product quick view modal implemented
   - Proper ARIA attributes (aria-hidden, aria-haspopup)

5. **✅ JavaScript Features (10/10 pts)**
   - DOM Manipulation: dynamically creating cards, toggling classes
   - Array Methods: .filter(), .forEach(), .push(), .splice()
   - Template Literals: backticks used in cart.js and updated in script.js

6. **✅ Social Media Meta Tags**
   - Open Graph tags added to all pages
   - Twitter Card tags added to all pages

---

## ⚠️ AREAS TO VERIFY/FIX

### 1. **Page Audits (20 pts) - ACTION REQUIRED**
**Current Status:** Unknown - Need to test in browser

**Steps to fix:**
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Run audit for:
   - Mobile Device setting
   - All pages (index.html, cart.html, login.html, form-result.html)
4. Fix any reported errors:
   - Missing alt text on images
   - Proper heading hierarchy (h1, h2, h3)
   - Form labels properly associated
   - Color contrast issues
   - ARIA attributes
   - Performance issues

**Target:** 0 errors for 20/20 pts

---

### 2. **Lighthouse Test (6 pts) - ACTION REQUIRED**
**Target:** 95+ for Accessibility, Best Practices, and SEO on MOBILE

**Accessibility 95+ checklist:**
- ✓ All buttons have proper aria-label or text
- ✓ Links have descriptive text (not "click here")
- ✓ Forms have associated labels
- ✓ Color contrast ratio ≥ 4.5:1 for AA level
- ✓ Focus indicators visible
- ✓ Keyboard navigation works
- ✓ Images have alt text
- ✓ Headings in logical order

**Best Practices 95+ checklist:**
- ✓ No console errors
- ✓ HTTPS recommended (if deploying)
- ✓ No outdated APIs
- ✓ Images optimized format (WebP)
- ✓ Proper viewport meta tag

**SEO 95+ checklist:**
- ✓ Meta description present (50-160 chars)
- ✓ Proper heading hierarchy
- ✓ Robots.txt configured
- ✓ Structured data (if applicable)
- ✓ Mobile-friendly

---

### 3. **Color Contrast (4 pts) - ACTION REQUIRED**
**How to verify:**
1. Open DevTools
2. Go to "Rendering" tab
3. Click "Show rendering" → scroll to CSS Overview
4. Open the page and check for contrast errors

**Ensure all text:**
- Background vs text color ≥ 4.5:1 (AA level)
- Focus states are clear
- Buttons have sufficient contrast

**Common fixes:**
- Lighten background or darken text
- Increase font-weight for headers
- Avoid light gray text on white

---

### 4. **Design Principles (20 pts) - REVIEW NEEDED**
**Criteria:**
- ✓ Responsive (no horizontal scrolling)
- ✓ Visually appealing
- ✓ Proximity: Related items grouped together
- ✓ Alignment: Elements aligned to grid
- ✓ Repetition: Consistent styling throughout
- ✓ No text over text issues
- ✓ No visual tangents

**Test on multiple devices:**
- Mobile (375px)
- Tablet (768px)
- Desktop (1200px)

---

### 5. **Responsive Menu (5 pts) - VERIFY**
**Checklist:**
- ✓ Hamburger menu for small screens (<768px)
- ✓ CSS Flex for navigation
- ✓ Wayfinding: Current page highlighted
- ✓ Smooth transitions
- ✓ Click outside to close

**Fix if needed:**
```css
/* Mobile: hamburger active */
@media (max-width: 768px) {
  nav { display: none; }
  nav.open { display: flex; }
}

/* Desktop: full nav */
@media (min-width: 769px) {
  nav { display: flex; }
  #hamburger { display: none; }
}
```

---

### 6. **Layouts (5 pts) - VERIFY**
**Ensure pages use advanced layouts:**
- ✓ CSS Grid or Flexbox
- ✓ Not simple stacked layouts
- ✓ Multi-column on larger screens

**Current layouts:**
- index.html: Grid for products ✓
- cart.html: Flex for cart items ✓
- login.html: Two-column layout ✓

---

## 📋 VIDEO REQUIREMENTS (20 pts total)

### JavaScript Functionality Video (10 pts)
**Show in video:**
1. API/JSON data loading (Fakestore API)
2. Async functionality with try/catch block
3. ES Module use (import/export)

**Recording tips:**
- Show console for API response
- Show cart.js ES module structure
- Demonstrate localStorage persistence

### Video Specifications (3 pts)
- ✓ ~5 minutes long
- ✓ Show your face
- ✓ Screen recording
- ✓ Audio clear and audible

---

## 🚀 QUICK FIXES TO IMPLEMENT NOW

```bash
# 1. Run Lighthouse audit on all pages
# 2. Fix critical issues from audit report
# 3. Verify color contrast in DevTools CSS Overview
# 4. Test responsive design on mobile
# 5. Verify all ARIA labels are present
# 6. Record 5-minute video demonstrating features
```

---

## 📊 ESTIMATED SCORE BREAKDOWN

| Criterion | Status | Points |
|-----------|--------|--------|
| Page Audits | ⚠️ Pending | 20 |
| Lighthouse | ⚠️ Pending | 6 |
| Color Contrast | ⚠️ Pending | 4 |
| Design Principles | ✓ Likely Pass | 20 |
| Responsive Menu | ✓ Likely Pass | 5 |
| Layouts | ✓ Pass | 5 |
| Form Action Page | ✓ Pass | 5 |
| Displayed Data | ✓ Pass | 5 |
| Local Storage | ✓ Pass | 3 |
| Modal Dialog | ✓ Pass | 4 |
| JavaScript | ✓ Pass | 10 |
| JS Video Demo | ⚠️ Pending | 10 |
| Video Specs | ⚠️ Pending | 3 |
| **TOTAL** | | **100** |

---

## 📝 NEXT STEPS

1. **Run Lighthouse** on all pages immediately
2. **Fix audit issues** based on priority
3. **Test on mobile** device or Chrome DevTools mobile view
4. **Record video** demonstrating the project
5. **Final review** before submission
