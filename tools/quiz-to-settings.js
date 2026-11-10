// Turns the two quiz templates into the SESSIONS block for apps-script/Code.gs.
//
//   node tools/quiz-to-settings.js templates/sessions.csv templates/questions.csv
//       Checks both files and writes sessions-block.js to paste into Code.gs.
//   node tools/quiz-to-settings.js templates/sessions.csv templates/questions.csv --write
//       Same checks, then replaces the SESSIONS block in apps-script/Code.gs directly.
//
// Fill the templates in Excel or Google Sheets, then save or download each one as CSV (UTF-8).
// See docs/QUIZ-TEMPLATE.md.
const fs = require('fs');
const path = require('path');

function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some(v => v.trim() !== '')) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell); if (row.some(v => v.trim() !== '')) rows.push(row);
  const head = rows.shift().map(h => h.trim().toLowerCase());
  return rows.map((r, n) => { const o = { _line: n + 2 }; head.forEach((h, i) => { o[h] = (r[i] || '').trim(); }); return o; });
}

const [sessFile, qFile] = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!sessFile || !qFile) {
  console.error('Usage: node tools/quiz-to-settings.js templates/sessions.csv templates/questions.csv [--write]');
  process.exit(1);
}
const sessRows = parseCsv(fs.readFileSync(sessFile, 'utf8'));
const qRows = parseCsv(fs.readFileSync(qFile, 'utf8'));
const LANGS = ['en', 'es'].filter(l => sessRows.some(r => r['title_' + l]));
const LETTERS = 'ABCDEF'.split('');
const problems = [];
const sessions = sessRows.map(r => {
  const where = `sessions.csv line ${r._line} (${r.session_id || 'no id'})`;
  if (!/^[a-z0-9-]{1,30}$/.test(r.session_id)) problems.push(`${where}: session_id should be lowercase letters, numbers, and hyphens.`);
  const s = { id: r.session_id, version: r.version || 'v1', title: {}, minutes: {}, videos: {} };
  const caps = {};
  LANGS.forEach(l => {
    s.title[l] = r['title_' + l];
    s.minutes[l] = Number(r['minutes_' + l]);
    s.videos[l] = r['video_' + l];
    if (r['captions_' + l]) caps[l] = r['captions_' + l];
    if (!s.title[l]) problems.push(`${where}: missing title_${l}.`);
    if (!(s.minutes[l] > 0)) problems.push(`${where}: minutes_${l} should be a number of minutes.`);
    if (!s.videos[l]) problems.push(`${where}: missing video_${l}.`);
  });
  if (Object.keys(caps).length) s.captions = caps;
  s.questions = [];
  return s;
});
qRows.forEach(r => {
  const where = `questions.csv line ${r._line}`;
  const s = sessions.find(x => x.id === r.session_id);
  if (!s) { problems.push(`${where}: session_id "${r.session_id}" isn't in sessions.csv.`); return; }
  const q = {};
  const counts = LANGS.map(l => {
    const opts = LETTERS.map(L => r[`option_${L.toLowerCase()}_${l}`]);
    const last = opts.map(Boolean).lastIndexOf(true);
    const used = opts.slice(0, last + 1);
    if (used.some(o => !o)) problems.push(`${where}: options for ${l} skip a letter. Fill them in order from A.`);
    q[l] = { q: r['question_' + l], a: used };
    if (!q[l].q) problems.push(`${where}: missing question_${l}.`);
    if (used.length < 2) problems.push(`${where}: needs at least two options in ${l}.`);
    return used.length;
  });
  if (counts.some(c => c !== counts[0])) problems.push(`${where}: each language needs the same number of options.`);
  const ans = LETTERS.indexOf(String(r.correct || '').toUpperCase());
  if (ans < 0 || ans >= counts[0]) problems.push(`${where}: correct should be a letter from A to ${LETTERS[counts[0] - 1] || 'B'}.`);
  s.questions.push(Object.assign({ answer: ans }, q));
});
sessions.forEach(s => { if (!s.questions.length) problems.push(`Session ${s.id} has no questions in questions.csv.`); });
if (new Set(sessions.map(s => s.id)).size !== sessions.length) problems.push('sessions.csv uses the same session_id twice.');

if (problems.length) {
  console.error('Fix these, then run it again:\n- ' + problems.join('\n- '));
  process.exit(1);
}

const lit = v => JSON.stringify(v);
const obj = o => '{ ' + Object.keys(o).map(k => `${k}: ${lit(o[k])}`).join(', ') + ' }';
const block = 'const SESSIONS = [\n' + sessions.map(s => [
  '  {',
  `    id: ${lit(s.id)}, version: ${lit(s.version)},`,
  `    title: ${obj(s.title)},`,
  `    minutes: ${obj(s.minutes)},`,
  `    videos: ${obj(s.videos)},`,
  s.captions ? `    captions: ${obj(s.captions)},` : null,
  '    questions: [',
  s.questions.map(q => `      { answer: ${q.answer},\n` + LANGS.map(l => `        ${l}: { q: ${lit(q[l].q)}, a: ${lit(q[l].a)} }`).join(',\n') + ' }').join(',\n'),
  '    ]',
  '  }'
].filter(x => x !== null).join('\n')).join(',\n') + '\n];';

if (process.argv.includes('--write')) {
  const gs = path.join(__dirname, '..', 'apps-script', 'Code.gs');
  const src = fs.readFileSync(gs, 'utf8');
  const a = src.indexOf('const SESSIONS = ['), b = src.indexOf('\n];', a);
  if (a < 0 || b < 0) { console.error('Could not find the SESSIONS block in Code.gs.'); process.exit(1); }
  fs.writeFileSync(gs, src.slice(0, a) + block + src.slice(b + 3));
  console.log('Updated the SESSIONS block in apps-script/Code.gs.');
} else {
  fs.writeFileSync('sessions-block.js', block + '\n');
  console.log('Wrote sessions-block.js. Paste it into Code.gs in place of the existing "const SESSIONS = [ ... ];".');
}
if (LANGS.join() !== 'en,es') console.log(`Languages found: ${LANGS.join(', ')}. Set LANGUAGES to ${JSON.stringify(LANGS)} in Code.gs and index.html.`);
console.log('\nCheck each answer against your video:');
sessions.forEach((s, i) => {
  console.log(`\nSession ${i + 1}: ${s.title[LANGS[0]]}`);
  s.questions.forEach((q, j) => console.log(`  ${j + 1}. ${q[LANGS[0]].q}\n     Correct: ${LETTERS[q.answer]}. ${q[LANGS[0]].a[q.answer]}`));
});
