// Rebuilds site/demo.js from the settings in apps-script/Code.gs.
// Demo mode lets anyone try the training page with no Google or Cloudflare setup.
// Run: node tools/build-demo.js
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8');
const cfg = new Function(src + '; return { SESSIONS, LANGUAGES, PASS_PERCENT, MAX_ATTEMPTS, TRAINING_URL };')();
// demo.js holds the answers in plain view. That's fine for the sample sessions, never for your real ones.
if (!/YOUR-PROJECT/.test(cfg.TRAINING_URL) && process.argv.indexOf('--force') === -1) {
  console.error('Stopped: Code.gs has your real settings, and demo.js would publish your answer key.');
  console.error('Demo mode is only for the sample sessions. Use --force only for a private test copy.');
  process.exit(1);
}
delete cfg.TRAINING_URL;
const template = fs.readFileSync(path.join(__dirname, 'demo-template.js'), 'utf8');
const out = template.replace('/*CONFIG*/', JSON.stringify(cfg, null, 1));
fs.writeFileSync(path.join(__dirname, '..', 'site', 'demo.js'), out);
console.log('Wrote site/demo.js with ' + cfg.SESSIONS.length + ' sessions.');
