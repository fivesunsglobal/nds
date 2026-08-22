# New Democracy Studio site

Production-ready static site for GitHub Pages.

## Visual preview
`preview-standalone.html` is a fully self-contained copy of the homepage with the CSS, logos, illustrations, and photos embedded directly into the file. Download it and open it in any browser to review the design without needing a web server or asset folder.

## Before launch
1. Open `assets/site.js`.
2. Formspree is already connected to form ID `xzepwgqk` (`https://formspree.io/f/xzepwgqk`) for both the September request form and the general contact form.
3. Replace the September date/time placeholder once confirmed.
4. Review `privacy.html` and `terms.html` and update any contact details you want included.
5. Upload the CONTENTS of this folder to the root of your GitHub Pages repository. Do not upload only `index.html`; the `assets/` folder is required.
6. In GitHub Pages settings, add your Porkbun custom domain and follow GitHub's DNS instructions.

## Files
- `index.html` - homepage
- `privacy.html` - privacy policy
- `terms.html` - terms of use
- `assets/styles.css` - all site design
- `assets/site.js` - request-modal behavior
- Formspree AJAX is loaded from `@formspree/ajax` via CDN in `index.html`; both forms also include a normal HTML `action`/`POST` fallback
- `assets/*.svg` - logo system/favicon
- `assets/*.webp` - New Democracy Studio illustrations and real field photography
- `preview-standalone.html` - self-contained design preview; not needed in production

## Important
The normal `index.html` is intentionally split from its assets for good web practice. If it is opened or previewed somewhere that does not serve sibling files, it may appear unstyled. On GitHub Pages it will render correctly as long as the full folder structure is uploaded.
