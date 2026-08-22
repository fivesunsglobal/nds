# New Democracy Studio site

Production-ready static site for GitHub Pages.

## Before launch
1. The Formspree endpoint `https://formspree.io/f/xzepwgqk` is configured for both forms.
2. Replace the September date/time placeholder once confirmed.
3. Review `privacy.html` and `terms.html` and update any contact details you want included.
4. Upload the CONTENTS of this folder to the root of your GitHub Pages repository. Do not upload only `index.html`; the `assets/` folder is required.
5. Preserve the repository's existing `CNAME` file and GitHub Pages custom-domain settings.

## Files
- `index.html` - homepage
- `privacy.html` - privacy policy
- `terms.html` - terms of use
- `assets/styles.css` - all site design
- `assets/site.js` - Formspree endpoint + request modal
- `assets/*.svg` - logo system/favicon
- `assets/*.webp` - New Democracy Studio illustrations and real field photography

## Important
The normal `index.html` is intentionally split from its assets for good web practice. On GitHub Pages it will render correctly as long as the full folder structure is uploaded.
