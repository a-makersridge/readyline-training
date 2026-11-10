// Tests for tools/quiz-to-settings.js and tools/build-demo.js.  Run: node tests/tools.test.js
const { execFileSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const ROOT = path.join(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'readyline-'));
let pass = 0, fail = 0;
const ok = (label, cond, extra) => { cond ? pass++ : fail++; console.log((cond ? 'PASS ' : 'FAIL ') + label + (extra ? '  ' + extra : '')); };
const run = (args, cwd = tmp) => { try { return { code: 0, out: execFileSync('node', args, { cwd, encoding: 'utf8', stdio: 'pipe' }) }; } catch (e) { return { code: e.status, out: String(e.stdout) + String(e.stderr) }; } };
const conv = path.join(ROOT, 'tools', 'quiz-to-settings.js');
const S = path.join(ROOT, 'templates', 'sessions.csv'), Q = path.join(ROOT, 'templates', 'questions.csv');

const r = run([conv, S, Q]);
const code = new Function(fs.readFileSync(path.join(ROOT, 'apps-script', 'Code.gs'), 'utf8') + '; return SESSIONS')();
const made = new Function(fs.readFileSync(path.join(tmp, 'sessions-block.js'), 'utf8') + '; return SESSIONS')();
ok('Templates convert to exactly the sample sessions in Code.gs', r.code === 0 && JSON.stringify(code) === JSON.stringify(made));
ok('Converter lists each correct answer in words', r.out.includes('Correct: A. At the front desk'));

const bad = fs.readFileSync(Q, 'utf8').replace(/,A\n/, ',G\n');
fs.writeFileSync(path.join(tmp, 'q.csv'), bad);
const r2 = run([conv, S, path.join(tmp, 'q.csv')]);
ok('A correct letter past the last option is caught', r2.code === 1 && r2.out.includes('correct should be a letter'));

const lines = fs.readFileSync(Q, 'utf8').split('\n');
const cells = lines[1].split(','); cells[4] = ''; lines[1] = cells.join(',');
fs.writeFileSync(path.join(tmp, 'q2.csv'), lines.join('\n'));
const r3 = run([conv, S, path.join(tmp, 'q2.csv')]);
ok('A skipped option letter is caught', r3.code === 1 && r3.out.includes('skip a letter'));

const enOnly = fs.readFileSync(S, 'utf8').split('\n').map((l, i) => { if (!l) return l; const c = l.split(','); if (i > 0) { c[3] = ''; c[5] = ''; c[7] = ''; c[9] = ''; } return c.join(','); }).join('\n');
fs.writeFileSync(path.join(tmp, 's-en.csv'), enOnly);
const r4 = run([conv, path.join(tmp, 's-en.csv'), Q]);
const enMade = new Function(fs.readFileSync(path.join(tmp, 'sessions-block.js'), 'utf8') + '; return SESSIONS')();
ok('English-only templates make English-only sessions', r4.code === 0 && !enMade[0].title.es && !enMade[0].questions[0].es && r4.out.includes('["en"]'));

const r5 = run([path.join(ROOT, 'tools', 'build-demo.js')], ROOT);
ok('Demo builder runs on the sample settings', r5.code === 0);

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
