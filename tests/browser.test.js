// Browser tests for site/index.html, run with Playwright (npm install, then npm run test:browser).
// Part 1 runs the page in demo mode. Part 2 runs it against the real Code.gs through the test harness.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const H = require('./harness.js');
const { G, call, sheets, mail } = H;
console.warn = () => {};
G.setup();

const ROOT = path.join(__dirname, '..');
const SHORT = path.join(__dirname, 'fixtures', 'short.mp4');
const SCRIPT = 'https://script.google.com/macros/s/TEST/exec';
const KEY = id => G.SESSIONS.find(s => s.id === id).questions.map(q => q.answer);
const WRONG = id => KEY(id).map((k, i) => (i === 0 ? (k + 1) % 2 : k));
let pass = 0, fail = 0;
const ok = (label, cond, extra) => { cond ? pass++ : fail++; console.log((cond ? 'PASS ' : 'FAIL ') + label + (extra ? '  ' + extra : '')); };
const TS = "window.turnstile={render:function(el,o){setTimeout(function(){o.callback(o.action==='resend'?'tt-resend':'tt-ok')},60);return 'w1'},reset:function(){}};";

async function newPage(browser, html, { realVideos } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.route('http://test.local/**', r => {
    const u = new URL(r.request().url());
    if (u.pathname === '/site/index.html' && html) return r.fulfill({ body: html, contentType: 'text/html' });
    if (u.pathname.startsWith('/sample-videos/') && !realVideos) return r.fulfill({ path: SHORT, contentType: 'video/mp4' });
    const f = path.join(ROOT, decodeURIComponent(u.pathname));
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) return r.fulfill({ status: 404, body: 'not found' });
    const type = f.endsWith('.js') ? 'application/javascript' : f.endsWith('.mp4') ? 'video/mp4' : 'text/html';
    return r.fulfill({ path: f, contentType: type });
  });
  await ctx.route(SCRIPT, r => r.fulfill({ body: JSON.stringify(call(JSON.parse(r.request().postData()))), contentType: 'application/json' }));
  await ctx.route('https://*.r2.cloudflarestorage.com/**', r => r.fulfill({ path: SHORT, contentType: 'video/mp4' }));
  await ctx.route('https://challenges.cloudflare.com/**', r => r.fulfill({ body: TS, contentType: 'application/javascript' }));
  await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  const pg = await ctx.newPage();
  const errors = [], csp = [];
  pg.on('pageerror', e => errors.push(String(e)));
  pg.on('console', m => { if (m.text().startsWith('CSP ')) csp.push(m.text()); });
  await ctx.addInitScript(() => document.addEventListener('securitypolicyviolation', e => console.log('CSP ' + e.violatedDirective + ' ' + e.blockedURI)));
  return { ctx, pg, errors, csp };
}

const watch = async pg => {
  await pg.waitForFunction(() => document.querySelector('#vid') && document.querySelector('#vid').duration > 0);
  await pg.click('#playBtn');
  await pg.waitForSelector('#quizBtn:not([hidden])', { timeout: 60000 });
  await pg.click('#quizBtn'); await pg.waitForSelector('#quiz');
};
const answer = async (pg, a) => { for (let i = 0; i < a.length; i++) await pg.check(`input[name=q${i}][value='${a[i]}']`); await pg.click('#submit'); };
const register = async (pg, email) => {
  for (const [s, v] of [['#first', 'Ana'], ['#last', 'Diaz'], ['#email', email], ['#code', 'change-me']]) await pg.fill(s, v);
  await pg.waitForTimeout(150); await pg.click('#go');
};

(async () => {
  const browser = await chromium.launch();

  console.log('-- Demo mode (no setup)');
  {
    const { ctx, pg, errors, csp } = await newPage(browser, null, { realVideos: true });
    await pg.goto('http://test.local/site/index.html');
    await pg.click('text=English');
    ok('Demo banner is shown', (await pg.innerText('.demo')).includes('Demo mode'));
    ok('Header uses the sample training name', (await pg.innerText('.course')).includes('Sample Company Training'));
    ok('Demo form comes filled in, so no real email is needed', (await pg.inputValue('#email')) === 'test@gmail.com' && (await pg.inputValue('#first')) === 'Alex' && (await pg.inputValue('#code')) === 'DEMO');
    await register(pg, 'demo@example.com');
    await pg.waitForSelector('text=Open my training link (demo)');
    await pg.click('text=Open my training link (demo)');
    await pg.click('text=English'); await pg.waitForSelector('#go');
    ok('Session 1 start shows its title', (await pg.innerText('.wrap')).includes('Welcome to the team'));
    await pg.click('#go');
    await pg.waitForFunction(() => document.querySelector('#vid') && document.querySelector('#vid').duration > 0);
    const dur = await pg.evaluate(() => document.querySelector('#vid').duration);
    ok('Real sample video loads (about 26 seconds)', dur > 20 && dur < 30, dur.toFixed(1) + 's');
    await pg.waitForFunction(() => { const v = document.querySelector('#vid'); return v.textTracks[0] && v.textTracks[0].cues && v.textTracks[0].cues.length > 0; });
    ok('Captions load and show by default', await pg.evaluate(() => document.querySelector('#vid').textTracks[0].mode === 'showing' && document.querySelector('#ccBtn').getAttribute('aria-pressed') === 'true'));
    await pg.click('#ccBtn');
    ok('Captions button turns them off', await pg.evaluate(() => document.querySelector('#vid').textTracks[0].mode === 'hidden'));
    await pg.click('#ccBtn');
    ok('Demo mode has no errors or blocked loads', errors.length === 0 && csp.length === 0, errors.concat(csp).join(' | '));
    await ctx.close();
  }
  {
    const { ctx, pg, errors } = await newPage(browser);
    await pg.goto('http://test.local/site/index.html'); await pg.click('text=Español');
    await pg.waitForTimeout(150); await pg.click('#go');
    await pg.click('text=Abrir mi enlace de capacitación (demostración)');
    await pg.click('text=Español'); await pg.waitForSelector('#go');
    for (const id of ['session-1', 'session-2', 'session-3']) {
      await pg.click('#go');
      await pg.waitForSelector('#demoSkip'); await pg.click('#demoSkip');
      await pg.waitForSelector('#quizBtn:not([hidden])'); await pg.click('#quizBtn'); await pg.waitForSelector('#quiz');
      await answer(pg, KEY(id)); await pg.waitForSelector('.result.pass');
      if (id !== 'session-3') { await pg.click('#nextBtn'); await pg.waitForSelector('#go'); }
    }
ok('Demo: Skip the video lets you flip through all 3 sessions', (await pg.innerText('.wrap')).includes('Completó las 3 sesiones'));
    ok('Demo: no page errors', errors.length === 0, errors.join(' | '));
    await ctx.close();
  }

  console.log('-- Live mode (real Code.gs through the harness)');
  const live = fs.readFileSync(path.join(ROOT, 'site', 'index.html'), 'utf8')
    .replace('SCRIPT_URL: ""', `SCRIPT_URL: "${SCRIPT}"`).replace('TURNSTILE_SITE_KEY: ""', 'TURNSTILE_SITE_KEY: "test-key"');
  {
    const { ctx, pg, errors, csp } = await newPage(browser, live);
    await pg.goto('http://test.local/site/index.html'); await pg.click('text=English');
    ok('No demo banner in live mode', !(await pg.$('.demo')));
    await register(pg, 'ana@example.com'); await pg.waitForSelector('text=Check your email');
    ok('No demo link in live mode', !(await pg.$('text=Open my training link (demo)')));
    const tok = mail.at(-1).body.match(/\?t=([0-9a-f-]{36})/)[1];
    ok('Email names the training and the session count', mail.at(-1).subject === 'Your Sample Company Training link' && mail.at(-1).body.includes('There are 3 sessions'));
    const link = `http://test.local/site/index.html?t=${tok}`;
    await pg.goto(link); await pg.click('text=English'); await pg.waitForSelector('#go');
    ok('Header: Session 1 of 3', (await pg.innerText('.course')) === 'Sample Company Training, Session 1 of 3', await pg.innerText('.course'));
    await pg.click('#go');
    await pg.waitForSelector('#vid');
    ok('No skip button in live mode', !(await pg.$('#demoSkip')));
    await pg.waitForFunction(() => { const v = document.querySelector('#vid'); return v && v.textTracks[0] && v.textTracks[0].cues && v.textTracks[0].cues.length > 0; });
    ok('Live mode: captions from the script show on the video', await pg.evaluate(() => document.querySelector('#vid track').src.startsWith('blob:')));
    await watch(pg);
    ok('Quiz shows the questions from Code.gs', (await pg.innerText('fieldset.q legend')).includes('Where do you check in'));
    await answer(pg, WRONG('session-1')); await pg.waitForSelector('.result.fail');
    ok('Fail says to watch again (no "unlock")', (await pg.innerText('.wrap')).includes('Watch the full video again to open the quiz'));
    await pg.click('#review'); await watch(pg);
    await answer(pg, KEY('session-1')); await pg.waitForSelector('.result.pass');
    await pg.click('#nextBtn'); await pg.waitForSelector('#go');
    ok('Session 2 start names it', (await pg.innerText('.wrap')).includes('Safety on the floor'));
    for (const id of ['session-2', 'session-3']) {
      if (id === 'session-3') { await pg.click('#nextBtn'); await pg.waitForSelector('#go'); }
      await pg.click('#go'); await watch(pg); await answer(pg, KEY(id)); await pg.waitForSelector('.result.pass');
    }
    ok('Final pass names the training', (await pg.innerText('.wrap')).includes('completed all 3 sessions of Sample Company Training'));
    const sum = sheets.Summary.rows.find(r => r[3] === 'ana@example.com');
    ok('Summary row is Complete', sum && sum[5] === 'Complete');
    await pg.goto(link); await pg.click('text=English');
    await pg.waitForFunction(() => document.querySelector('h1') && !/One moment/.test(document.querySelector('h1').innerText));
    ok('Coming back shows the completed screen', (await pg.innerText('h1')) === "You've completed Sample Company Training");
    // Lockout with contacts
    call({ action: 'register', human: 'tt-ok', code: 'change-me', firstName: 'Luis', lastName: 'Mora', email: 'luis@example.com', language: 'es' });
    const t2 = mail.at(-1).body.match(/\?t=([0-9a-f-]{36})/)[1];
    for (let i = 0; i < 2; i++) call({ action: 'submit', token: t2, courseId: 'session-1', videoFinished: 'y', answers: WRONG('session-1') });
    await pg.goto(`http://test.local/site/index.html?t=${t2}`); await pg.click('text=Español');
    await pg.waitForFunction(() => document.querySelector('h1') && !/Un momento/.test(document.querySelector('h1').innerText));
    ok('Spanish lockout lists the contact', (await pg.innerText('h1')) === 'Ya usó todos sus intentos' && (await pg.innerText('.wrap')).includes('jordan@example.com'));
    // Resend
    await pg.goto('http://test.local/site/index.html'); await pg.click('text=English'); await pg.click('#toResend');
    const before = mail.length;
    await pg.fill('#email', 'ana@example.com'); await pg.waitForTimeout(150); await pg.click('#go');
    await pg.waitForSelector('#rs', { state: 'detached' });
    ok('Resend sends the same link', mail.length === before + 1 && mail.at(-1).body.includes(tok));
    ok('Live mode: no page errors', errors.length === 0, errors.join(' | '));
    ok('Live mode: no blocked loads', csp.length === 0, csp.join(' | '));
    await ctx.close();
  }
  {
    const one = live.replace('LANGUAGES: ["en", "es"],', 'LANGUAGES: ["en"],');
    const { ctx, pg } = await newPage(browser, one);
    await pg.goto('http://test.local/site/index.html');
    await pg.waitForSelector('#reg');
    ok('With one language, the language screen is skipped', !(await pg.$('.langs')));
    await ctx.close();
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
