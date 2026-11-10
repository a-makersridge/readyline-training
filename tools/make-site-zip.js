// Builds readyline-site.zip for Cloudflare Pages: index.html, _headers, and robots.txt.
// demo.js is left out on purpose. Your live site doesn't need it.
// Run: node tools/make-site-zip.js   (needs the "zip" command, which macOS and Linux include)
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const site = path.join(__dirname, '..', 'site');
const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
if (/SCRIPT_URL:\s*""/.test(html)) {
  console.error('Stopped: SCRIPT_URL in site/index.html is empty, so the page would run in demo mode.');
  console.error('Paste your Apps Script web app address there first (docs/SETUP.md, step 6).');
  process.exit(1);
}
if (/TURNSTILE_SITE_KEY:\s*""/.test(html)) {
  console.error('Stopped: TURNSTILE_SITE_KEY in site/index.html is empty (docs/SETUP.md, step 3).');
  process.exit(1);
}
const out = path.join(__dirname, '..', 'readyline-site.zip');
if (fs.existsSync(out)) fs.unlinkSync(out);
execFileSync('zip', ['-qX', out, 'index.html', '_headers', 'robots.txt'], { cwd: site });
console.log('Wrote readyline-site.zip. Upload it in Cloudflare: Workers & Pages > your project > Create deployment.');
