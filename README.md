# New Democracy Studio site

Launch-ready static site for GitHub Pages. The design and content are unchanged from v5.

## Three values to set before launch

1. **Custom domain:** `CNAME` is already set to the canonical apex domain, `newdemocracystud.io`.
2. **Formspree:** in `assets/site.js`, replace `https://formspree.io/f/REPLACE_ME` with the endpoint shown in Formspree. This single edit powers both production forms.
3. **Program details:** confirm the September date/time text in `index.html`.

Also review the contact details in `privacy.html` and `terms.html`. Those pages are launch drafts, not legal advice.

## Deployment checklist

### 1. Create or use the GitHub repository

- Create an empty repository on GitHub, or use an existing one. A public repository works with GitHub Free.
- Upload the **contents of this folder** to the repository root. `index.html`, `CNAME`, `.nojekyll`, and `assets/` must all be at the root; do not upload only `index.html` or the enclosing folder.
- Commit to `main`. If using Git locally: initialize the repository, add the GitHub remote, commit, and push `main`.
- Do not publish secrets: this site contains only public browser files. A Formspree form endpoint is designed to be used in the page; never add Formspree account credentials or API keys.

### 2. Enable GitHub Pages

- In the repository, open **Settings → Pages**.
- Under **Build and deployment**, choose **Deploy from a branch**.
- Select `main` and `/(root)`, then save.
- Wait for the Pages deployment to complete and test the temporary `https://YOUR-USERNAME.github.io/REPOSITORY/` address.

### 3. Verify ownership of the domain (recommended before DNS cutover)

- In GitHub, open your personal or organization **Settings → Pages → Add a domain**.
- GitHub will provide a TXT record similar to `_github-pages-challenge-USERNAME` and a unique value.
- In Porkbun, open the domain's **DNS** page and add that TXT record exactly as GitHub shows it.
- Return to GitHub and finish verification. Keep the TXT record permanently; it helps prevent domain takeover.

### 4. Add the custom domain in GitHub

- Back in the repository's **Settings → Pages**, enter the exact domain used in `CNAME` and save it **before** changing DNS.
- GitHub may commit or rewrite `CNAME`; if so, keep that version and pull/download it before making later updates.

### 5. Configure Porkbun DNS

For the apex domain `newdemocracystud.io`, remove conflicting parking/forwarding records and add four `A` records. In Porkbun, leave **Host** blank for the apex:

| Type | Host | Answer |
|---|---|---|
| A | blank | `185.199.108.153` |
| A | blank | `185.199.109.153` |
| A | blank | `185.199.110.153` |
| A | blank | `185.199.111.153` |

Also add the recommended `www` record:

| Type | Host | Answer |
|---|---|---|
| CNAME | `www` | `YOUR-USERNAME.github.io` |

Point the `www` CNAME directly to `YOUR-USERNAME.github.io`—do not include the repository name, `https://`, or a path. GitHub will redirect between the apex and `www` version based on the custom domain selected in Pages settings. Optional IPv6 `AAAA` records are documented by GitHub, but are not required for launch.

Porkbun also offers a **Quick DNS Config → GitHub** preset. Review the records it creates and make sure they match the values above and do not conflict with existing parking or forwarding records. Avoid wildcard (`*`) records.

### 6. DNS, cache, and HTTPS expectations

- DNS changes may appear within minutes but can take up to 24 hours. Different networks may update at different times.
- Once GitHub reports the DNS check as successful and the certificate is ready, select **Enforce HTTPS** in **Settings → Pages**. The option can take up to 24 hours to become available.
- After a new site commit, allow several minutes for the Pages deployment and browser/CDN caches. If an old version persists, use a private window or a hard refresh before troubleshooting the files.

### 7. Final smoke tests

- Open both `https://newdemocracystud.io` and `https://www.newdemocracystud.io`; confirm `www` redirects to the canonical apex domain.
- Confirm the browser shows HTTPS with no certificate warning and that an `http://` visit redirects to HTTPS.
- Test desktop and mobile widths, navigation anchors, logo/images, favicon, Privacy, and Terms.
- Submit both forms with test data. Confirm Formspree receives each submission, required fields work, and the correct `form_type` distinguishes the two forms.
- Check that there are no broken assets or browser-console errors.
- Test the temporary GitHub URL as well as the custom domain, then remove test submissions from Formspree if desired.

## Files

- `index.html` — homepage
- `privacy.html` — privacy policy
- `terms.html` — terms of use
- `CNAME` — canonical custom domain (`newdemocracystud.io`)
- `.nojekyll` — serves the static files as-is on GitHub Pages
- `assets/styles.css` — site design
- `assets/site.js` — single production Formspree setting and form behavior
- `assets/*.svg` and `assets/*.webp` — brand graphics and photography
- `preview-standalone.html` — local, self-contained design preview; not required for production and its embedded forms are not part of the one-line production configuration

## References

- GitHub: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- GitHub custom domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GitHub domain verification: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
- Porkbun GitHub Pages setup: https://kb.porkbun.com/article/64-how-to-connect-your-domain-to-github-pages
