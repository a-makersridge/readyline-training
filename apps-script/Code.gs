/** @OnlyCurrentDoc */

/*
 * ReadyLine by Makersridge
 * Free video training, quizzes, and proof of completion for small teams.
 * https://github.com/a-makersridge/readyline-training
 *
 * ============================ YOUR SETTINGS ============================
 * Edit everything in this section, then Save. Nothing below it needs to change.
 * After any change: Deploy > Manage deployments > pencil > New version > Deploy.
 * Full guide: docs/SETUP.md and docs/CUSTOMIZE.md
 */

// The name people see on the page and in the email, in each language you offer.
const TRAINING_NAME = { en: "Sample Company Training", es: "Capacitación de Sample Company" };

// The sender name on the email that delivers each person's link.
const SENDER_NAME = "Sample Company Training";

// Your training page's address on Cloudflare Pages. Keep the slash at the end.
const TRAINING_URL = "https://YOUR-PROJECT.pages.dev/";

// The code people type to register. Give it out in your onboarding paperwork.
// Use something long and hard to guess, like three random words. Not case-sensitive.
const ONBOARDING_CODE = "CHANGE-ME";

// Languages you offer: ["en"], ["es"], or ["en", "es"]. The first one is the default.
const LANGUAGES = ["en", "es"];

// Who people should contact for help. Shown in the email.
const SUPPORT_CONTACTS = [
  { name: "Jordan", email: "jordan@example.com" }
];

// Quiz rules.
const PASS_PERCENT = 100;
const MAX_ATTEMPTS = 2;

// Cloudflare R2, where your videos are stored privately.
// The access keys go in Project Settings > Script Properties, never here.
const R2_ACCOUNT_ID = "PASTE-YOUR-CLOUDFLARE-ACCOUNT-ID";
const R2_BUCKET = "readyline-videos";
const VIDEO_LINK_HOURS = 12;

// Limits that protect your email account from floods.
const MAX_REGISTRATION_EMAILS_PER_HOUR = 60;
const MAX_REGISTRATION_EMAILS_PER_DAY = 300;
const MAX_LINK_SENDS = 5;

// Your sessions, in the order people take them. Each one opens when the one before it is passed.
//   id:        short name with no spaces. Used in the Sheet and the Overrides dropdown.
//   version:   raise it (v1 to v2) when you replace the video or change the quiz.
//   title:     the session's name in each language.
//   minutes:   video length in each language, shown before the video starts.
//   videos:    the file names in your R2 bucket.
//   captions:  optional. Caption files (.vtt) in your R2 bucket, one per language.
//              Leave this line out if you don't have captions. See docs/CAPTIONS.md.
//   questions: each question in each language, and "answer" = the correct option,
//              counted from 0 (0 = first option, 1 = second, and so on).
//              Keep the options in the same order in every language.
// The answers stay in Google. People taking the quiz never see them.
const SESSIONS = [
  {
    id: "session-1", version: "v1",
    title: { en: "Welcome to the team", es: "Bienvenido al equipo" },
    minutes: { en: 1, es: 1 },
    videos: { en: "session-1-en.mp4", es: "session-1-es.mp4" },
    captions: { en: "session-1-en.vtt", es: "session-1-es.vtt" },
    questions: [
      { answer: 0,
        en: { q: "Where do you check in at the start of every shift?", a: ["At the front desk", "In the parking lot", "With any coworker", "You don't need to check in"] },
        es: { q: "¿Dónde se registra al inicio de cada turno?", a: ["En la recepción", "En el estacionamiento", "Con cualquier compañero", "No necesita registrarse"] } },
      { answer: 2,
        en: { q: "When should you report an injury?", a: ["Only if it's serious", "At the end of the week", "Right away, even if it's small", "Only if someone saw it happen"] },
        es: { q: "¿Cuándo debe reportar una lesión?", a: ["Solo si es grave", "Al final de la semana", "De inmediato, aunque sea pequeña", "Solo si alguien la vio"] } },
      { answer: 1,
        en: { q: "How long is your lunch break?", a: ["15 minutes", "30 minutes", "45 minutes", "60 minutes"] },
        es: { q: "¿Cuánto dura su descanso para comer?", a: ["15 minutos", "30 minutos", "45 minutos", "60 minutos"] } }
    ]
  },
  {
    id: "session-2", version: "v1",
    title: { en: "Safety on the floor", es: "Seguridad en el área de trabajo" },
    minutes: { en: 1, es: 1 },
    videos: { en: "session-2-en.mp4", es: "session-2-es.mp4" },
    captions: { en: "session-2-en.vtt", es: "session-2-es.vtt" },
    questions: [
      { answer: 3,
        en: { q: "What do you wear on the work floor?", a: ["Sandals", "Headphones", "Your own choice of shoes", "Safety glasses and closed-toe shoes"] },
        es: { q: "¿Qué debe usar en el área de trabajo?", a: ["Sandalias", "Audífonos", "Los zapatos que usted elija", "Lentes de seguridad y zapatos cerrados"] } },
      { answer: 1,
        en: { q: "Who has the right of way in the walkways?", a: ["You do", "Forklifts", "Visitors", "Whoever is moving faster"] },
        es: { q: "¿Quién tiene el derecho de paso en los pasillos?", a: ["Usted", "Los montacargas", "Los visitantes", "Quien vaya más rápido"] } },
      { answer: 0,
        en: { q: "You see a spill. What do you do?", a: ["Stay with it and call for cleanup", "Walk around it", "Wipe it with a paper towel and keep going", "Tell someone at the end of your shift"] },
        es: { q: "Ve un derrame. ¿Qué hace?", a: ["Se queda junto a él y pide que lo limpien", "Lo rodea", "Lo seca con una toalla de papel y sigue", "Le avisa a alguien al final de su turno"] } }
    ]
  },
  {
    id: "session-3", version: "v1",
    title: { en: "Getting help", es: "Cómo pedir ayuda" },
    minutes: { en: 1, es: 1 },
    videos: { en: "session-3-en.mp4", es: "session-3-es.mp4" },
    captions: { en: "session-3-en.vtt", es: "session-3-es.vtt" },
    questions: [
      { answer: 1,
        en: { q: "Who is your first contact for questions?", a: ["A customer", "Your supervisor", "Anyone in the break room", "The front desk only"] },
        es: { q: "¿Quién es su primer contacto para preguntas?", a: ["Un cliente", "Su supervisor", "Cualquiera en el comedor", "Solo la recepción"] } },
      { answer: 2,
        en: { q: "What color are the emergency exit signs?", a: ["Red", "Blue", "Green", "Yellow"] },
        es: { q: "¿De qué color son los letreros de salida de emergencia?", a: ["Rojo", "Azul", "Verde", "Amarillo"] } },
      { answer: 1,
        en: { q: "How many emergency exits should you know from your work area?", a: ["One", "The two closest to you", "Only the main entrance", "None, follow the crowd"] },
        es: { q: "¿Cuántas salidas de emergencia debe conocer desde su área de trabajo?", a: ["Una", "Las dos más cercanas", "Solo la entrada principal", "Ninguna, siga a la gente"] } }
    ]
  }
];

/* ======================= END OF YOUR SETTINGS ======================= */

const LANG_NAMES = { en: "English", es: "Spanish" };
const COURSES = {};
SESSIONS.forEach(s => { COURSES[s.id] = { videos: s.videos, captions: s.captions || {}, key: s.questions.map(q => q.answer) }; });
const READYLINE_VERSION = "1.0.0";
const SESSION_ORDER = SESSIONS.map(s => s.id);

const REG_SHEET = "Registrations";
const REG_HEADERS = ["Registered", "First name", "Last name", "Email", "Language", "Registration ID", "Links sent"];
const RES_SHEET = "Results";
const RES_HEADERS = [
  "Submitted", "First name", "Last name", "Email", "Language", "Course", "Version",
  "Attempt", "Score", "Percent", "Result", "Video started", "Video finished",
  "Answers", "Registration ID"
];
const OVR_SHEET = "Overrides";
const OVR_HEADERS = ["Email", "Session", "Extra attempts", "Note (who approved and why)", "Date"];
const SUM_SHEET = "Summary";
const SUM_HEADERS = ["Registered", "First name", "Last name", "Email", "Language", "Overall"]
  .concat(...SESSION_ORDER.map((id, i) => ["Session " + (i + 1), "S" + (i + 1) + " attempts", "S" + (i + 1) + " score", "S" + (i + 1) + " passed on"]))
  .concat(["Completed on", "Registration ID", "Notes"]);
const SUM_ID_COL = SUM_HEADERS.length - 1;
const SUM_WRITE_COLS = SUM_HEADERS.length - 1;

function doPost(e) {
  let d;
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 20000) return reply({ ok: false, error: "bad_request" });
    d = JSON.parse(raw);
    if (!d || typeof d !== "object" || Array.isArray(d)) return reply({ ok: false, error: "bad_request" });
  } catch (err) {
    return reply({ ok: false, error: "bad_request" });
  }
  try {
    if (d.action === "register") return reply(register(d));
    if (d.action === "resend") return reply(resend(d));
    if (["lookup", "video", "submit"].indexOf(d.action) !== -1 && !withinRate(d.token)) return reply({ ok: false, error: "busy" });
    if (d.action === "lookup") return reply(lookup(d));
    if (d.action === "video") return reply(video(d));
    if (d.action === "submit") return reply(withLock(() => submit(d)));
    return reply({ ok: false, error: "bad_request" });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: "server" });
  }
}

function doGet() {
  return ContentService.createTextOutput("Not available.");
}

function withinRate(token) {
  if (typeof token !== "string" || !/^[0-9a-f-]{36}$/i.test(token)) return true;
  const cache = CacheService.getScriptCache();
  const key = "rate:" + token;
  const n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), 600);
  return n <= 60;
}

function withLock(fn) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { ok: false, error: "busy" };
  try { return fn(); } finally { lock.releaseLock(); }
}

function getCourse(id) {
  return typeof id === "string" && Object.prototype.hasOwnProperty.call(COURSES, id) ? COURSES[id] : null;
}

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'\u2019-]{0,39}$/u;
const EMAIL_RE = /^[A-Za-z0-9._%+'-]{1,64}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,24}$/;

function register(d) {
  const first = String(d.firstName || "").trim().replace(/\s+/g, " ");
  const last = String(d.lastName || "").trim().replace(/\s+/g, " ");
  const email = String(d.email || "").trim().toLowerCase();
  if (!first || !last) return { ok: false, error: "missing_name" };
  if (!NAME_RE.test(first) || !NAME_RE.test(last) || /\.\p{L}/u.test(first + " " + last)) return { ok: false, error: "bad_name" };
  if (email.length > 100 || !EMAIL_RE.test(email)) return { ok: false, error: "bad_email" };
  const lang = pickLang(d.language);

  if (!verifyHuman(d.human, "register")) return { ok: false, error: "bot_check" };
  if (norm(d.code) !== norm(ONBOARDING_CODE)) return { ok: false, error: "bad_code" };

  return withLock(() => saveRegistration(first, last, email, lang));
}

function saveRegistration(first, last, email, lang) {
  const sheet = getSheet(REG_SHEET, REG_HEADERS);
  const existing = findRow(sheet, 4, email);
  let id;

  if (existing) {
    const row = existing.values;
    id = row[5];
    const sent = Number(row[6]) || 1;
    if (sent >= MAX_LINK_SENDS) return { ok: true, sent: true };
    if (!takeEmailSlot()) return { ok: false, error: "busy" };
    sheet.getRange(existing.rowNum, 7).setValue(sent + 1);
  } else {
    if (!takeEmailSlot()) return { ok: false, error: "busy" };
    id = Utilities.getUuid();
    const row = [new Date(), clean(first), clean(last), clean(email), LANG_NAMES[lang], id, 1];
    sheet.appendRow(row);
    writeSummary([regFromRow(row)], readLog());
  }

  sendLink(email, id, lang);
  return { ok: true, sent: true };
}

function resend(d) {
  const email = String(d.email || "").trim().toLowerCase();
  if (email.length > 100 || !EMAIL_RE.test(email)) return { ok: false, error: "bad_email" };
  if (!verifyHuman(d.human, "resend")) return { ok: false, error: "bot_check" };
  const lang = pickLang(d.language);
  return withLock(() => {
    const sheet = getSheet(REG_SHEET, REG_HEADERS);
    const existing = findRow(sheet, 4, email);
    if (!existing) return { ok: true };
    const sent = Number(existing.values[6]) || 1;
    if (sent >= MAX_LINK_SENDS) { console.warn("Resend limit reached for a registered email"); return { ok: true }; }
    if (!takeEmailSlot()) return { ok: true };
    sheet.getRange(existing.rowNum, 7).setValue(sent + 1);
    sendLink(email, existing.values[5], lang);
    return { ok: true };
  });
}

function contactText(joiner) {
  return SUPPORT_CONTACTS.map(c => c.name + " (" + c.email + ")").join(" " + joiner + " ");
}

function verifyHuman(token, action) {
  const secret = PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET");
  if (!secret) throw new Error("TURNSTILE_SECRET missing from Script Properties");
  if (!token || typeof token !== "string" || token.length > 2048) return false;
  const res = UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "post", payload: { secret: secret, response: token }, muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) return false;
  const result = JSON.parse(res.getContentText());
  return result.success === true && (!result.action || result.action === action);
}

function takeEmailSlot() {
  const props = PropertiesService.getScriptProperties();
  const now = new Date();
  const hour = Utilities.formatDate(now, "UTC", "yyyyMMddHH");
  const day = hour.slice(0, 8);
  let c = {};
  try { c = JSON.parse(props.getProperty("EMAIL_COUNTS") || "{}"); } catch (e) {}
  if (c.hour !== hour) { c.hour = hour; c.hourCount = 0; }
  if (c.day !== day) { c.day = day; c.dayCount = 0; }
  if (c.hourCount >= MAX_REGISTRATION_EMAILS_PER_HOUR || c.dayCount >= MAX_REGISTRATION_EMAILS_PER_DAY) {
    console.warn("Registration email cap reached", c);
    return false;
  }
  c.hourCount++; c.dayCount++;
  props.setProperty("EMAIL_COUNTS", JSON.stringify(c));
  return true;
}

function sendLink(email, id, lang) {
  const link = TRAINING_URL + "?t=" + encodeURIComponent(id);
  const n = SESSIONS.length, name = TRAINING_NAME[lang] || TRAINING_NAME[LANGUAGES[0]];
  const en = {
    subject: "Your " + name + " link",
    body: "Hello,\n\nHere is your personal link for " + name + ". " +
      (n > 1 ? "There are " + n + " sessions, each with a short video and a quiz. When you pass one, the next one opens." : "It has a short video and a quiz.") +
      "\n\n" + link + "\n\nKeep this email. Use the same link if you need to come back later. Don't share it, because your results are recorded under your name.\n\nPlease don't reply to this email. If you have questions about your registration, contact " + contactText("or") + ".\n\nIf you didn't register for this training, you can ignore this email."
  };
  const es = {
    subject: "Su enlace para " + name,
    body: "Hola,\n\nEste es su enlace personal para " + name + ". " +
      (n > 1 ? "Hay " + n + " sesiones, cada una con un video corto y un examen. Cuando apruebe una, se abre la siguiente." : "Tiene un video corto y un examen.") +
      "\n\n" + link + "\n\nGuarde este correo. Use el mismo enlace si necesita regresar más tarde. No lo comparta, porque sus resultados se registran a su nombre.\n\nPor favor, no responda a este correo. Si tiene preguntas sobre su registro, comuníquese con " + contactText("o") + ".\n\nSi usted no se registró para esta capacitación, puede ignorar este correo."
  };
  const m = lang === "es" ? es : en;
  let html = esc(m.body).replace(esc(link), '<a href="' + link + '">' + esc(link) + "</a>");
  SUPPORT_CONTACTS.forEach(c => {
    html = html.replace(esc(c.email), '<a href="mailto:' + c.email + '">' + esc(c.email) + "</a>");
  });
  html = html.replace(/\n/g, "<br>");
  MailApp.sendEmail({ to: email, subject: m.subject, body: m.body, htmlBody: html, name: SENDER_NAME });
}

function pickLang(v) {
  return LANGUAGES.indexOf(v) !== -1 ? v : LANGUAGES[0];
}

function langFromName(name) {
  const hit = Object.keys(LANG_NAMES).filter(k => LANG_NAMES[k] === name)[0];
  return hit && LANGUAGES.indexOf(hit) !== -1 ? hit : LANGUAGES[0];
}

function sessionsFor(lang) {
  return SESSIONS.map(s => ({
    id: s.id, version: s.version, title: s.title[lang], minutes: s.minutes[lang],
    questions: s.questions.map(q => ({ q: q[lang].q, a: q[lang].a }))
  }));
}

function lookup(d) {
  const reg = getRegistration(d.token);
  if (!reg) return { ok: false, error: "bad_link" };
  const lang = pickLang(d.language);
  return {
    ok: true, firstName: reg.first, lastName: reg.last, language: reg.lang,
    passPercent: PASS_PERCENT, sessions: sessionsFor(lang), statuses: forClient(allStatuses(reg))
  };
}

function video(d) {
  const reg = getRegistration(d.token);
  if (!reg) return { ok: false, error: "bad_link" };
  const course = getCourse(d.courseId);
  if (!course) return { ok: false, error: "unknown_course" };
  if (!isUnlocked(allStatuses(reg), d.courseId)) return { ok: false, error: "locked" };
  const lang = pickLang(d.language);
  const out = { ok: true, videoUrl: videoLink(course.videos[lang]), expiresInSeconds: VIDEO_LINK_HOURS * 3600 };
  const cap = captionText(course.captions[lang]);
  if (cap) out.captions = cap;
  return out;
}

// Captions are fetched here and handed to the page, so the bucket needs no extra setup.
function captionText(fileName) {
  if (!fileName) return "";
  try {
    const res = UrlFetchApp.fetch(videoLink(fileName), { muteHttpExceptions: true });
    const text = res.getResponseCode() < 300 ? res.getContentText("UTF-8") : "";
    if (!/^\uFEFF?WEBVTT/.test(text) || text.length > 200000) {
      console.warn("Captions skipped for " + fileName + ": missing, too large, or not a WebVTT file.");
      return "";
    }
    return text;
  } catch (e) {
    console.warn("Captions skipped for " + fileName + ": " + e);
    return "";
  }
}

function readLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const read = (name, cols) => {
    const sh = ss.getSheetByName(name);
    return sh && sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, cols).getValues() : [];
  };
  return { res: read(RES_SHEET, RES_HEADERS.length), ovr: read(OVR_SHEET, 3) };
}

function allStatuses(reg, log) {
  log = log || readLog();
  const out = {};
  SESSION_ORDER.forEach(id => { out[id] = { attempts: 0, passed: false, extra: 0, best: null, passedOn: null }; });
  log.res.forEach(r => {
    const st = out[r[5]];
    if (!st || r[14] !== reg.id) return;
    st.attempts++;
    if (st.best === null || Number(r[9]) >= Number(st.best[0])) st.best = [r[9], r[8]];
    if (r[10] === "Pass" && !st.passed) { st.passed = true; st.passedOn = r[0]; }
  });
  log.ovr.forEach(r => {
    const st = out[String(r[1]).trim()];
    if (st && norm(r[0]) === norm(reg.email)) st.extra += Math.max(0, Math.floor(Number(r[2]) || 0));
  });
  SESSION_ORDER.forEach(id => {
    const st = out[id];
    st.allowed = MAX_ATTEMPTS + st.extra;
    st.remaining = st.passed ? 0 : Math.max(0, st.allowed - st.attempts);
    st.unlocked = isUnlocked(out, id);
    delete st.extra;
  });
  return out;
}

function forClient(statuses) {
  const out = {};
  SESSION_ORDER.forEach(id => {
    const s = statuses[id];
    out[id] = { attempts: s.attempts, passed: s.passed, allowed: s.allowed, remaining: s.remaining, unlocked: s.unlocked };
  });
  return out;
}

function isUnlocked(statuses, id) {
  const i = SESSION_ORDER.indexOf(id);
  return i === 0 || (i > 0 && statuses[SESSION_ORDER[i - 1]].passed);
}

function courseStatus(reg, courseId) {
  return allStatuses(reg)[courseId];
}

function videoLink(fileName) {
  const props = PropertiesService.getScriptProperties();
  const keyId = props.getProperty("R2_ACCESS_KEY_ID");
  const secret = props.getProperty("R2_SECRET_ACCESS_KEY");
  if (!keyId || !secret) throw new Error("R2 keys missing from Script Properties");
  return presignUrl({
    host: R2_ACCOUNT_ID + ".r2.cloudflarestorage.com",
    path: "/" + R2_BUCKET + "/" + fileName,
    region: "auto",
    keyId: keyId,
    secret: secret,
    expires: VIDEO_LINK_HOURS * 3600,
    date: new Date()
  });
}

function presignUrl(o) {
  const amzDate = Utilities.formatDate(o.date, "UTC", "yyyyMMdd'T'HHmmss'Z'");
  const day = amzDate.slice(0, 8);
  const scope = day + "/" + o.region + "/s3/aws4_request";
  const path = o.path.split("/").map(encodeRfc3986).join("/");
  const params = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": o.keyId + "/" + scope,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(o.expires),
    "X-Amz-SignedHeaders": "host"
  };
  const query = Object.keys(params).sort()
    .map(k => encodeRfc3986(k) + "=" + encodeRfc3986(params[k])).join("&");
  const canonical = ["GET", path, query, "host:" + o.host, "", "host", "UNSIGNED-PAYLOAD"].join("\n");
  const toSign = ["AWS4-HMAC-SHA256", amzDate, scope, toHex(sha256(canonical))].join("\n");
  let k = hmac(bytes("AWS4" + o.secret), bytes(day));
  k = hmac(k, bytes(o.region));
  k = hmac(k, bytes("s3"));
  k = hmac(k, bytes("aws4_request"));
  const sig = toHex(hmac(k, bytes(toSign)));
  return "https://" + o.host + path + "?" + query + "&X-Amz-Signature=" + sig;
}

function encodeRfc3986(s) {
  return encodeURIComponent(s).replace(/[!'()*]/g, c => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}
function bytes(s) { return Utilities.newBlob(s).getBytes(); }
function hmac(key, msg) { return Utilities.computeHmacSha256Signature(msg, key); }
function sha256(s) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8); }
function toHex(b) { return b.map(x => ((x < 0 ? x + 256 : x).toString(16)).padStart(2, "0")).join(""); }

function testVideoLinks() {
  Object.keys(COURSES).forEach(id => {
    const files = Object.keys(COURSES[id].videos).map(l => COURSES[id].videos[l])
      .concat(Object.keys(COURSES[id].captions).map(l => COURSES[id].captions[l]));
    files.forEach(file => {
      const res = UrlFetchApp.fetch(videoLink(file), { headers: { Range: "bytes=0-1023" }, muteHttpExceptions: true });
      const okType = !/\.vtt$/i.test(file) || /^\uFEFF?WEBVTT/.test(res.getContentText("UTF-8"));
      console.log(file + ": " + (res.getResponseCode() < 300 && okType ? "OK" : "FAILED (" + res.getResponseCode() + ") " + res.getContentText().slice(0, 200)));
    });
  });
}

function submit(d) {
  const reg = getRegistration(d.token);
  if (!reg) return { ok: false, error: "bad_link" };
  const course = getCourse(d.courseId);
  if (!course) return { ok: false, error: "unknown_course" };
  const key = course.key;
  if (!d.videoFinished) return { ok: false, error: "video_not_finished" };
  if (!Array.isArray(d.answers) || d.answers.length !== key.length) return { ok: false, error: "bad_answers" };

  const log = readLog();
  const statuses = allStatuses(reg, log);
  if (!isUnlocked(statuses, d.courseId)) return { ok: false, error: "locked" };
  const before = forClient(statuses)[d.courseId];
  if (before.passed) return { ok: false, error: "already_passed", status: before };
  if (before.remaining <= 0) return { ok: false, error: "no_attempts", status: before };

  let score = 0;
  key.forEach((correct, i) => { if (Number(d.answers[i]) === correct) score++; });
  const percent = Math.round((score / key.length) * 100);
  const passed = percent >= PASS_PERCENT;

  const sheet = getSheet(RES_SHEET, RES_HEADERS);
  const attempt = before.attempts + 1;
  const texts = Array.isArray(d.answerText) ? d.answerText.slice(0, key.length) : [];
  const answerLog = key.map((correct, i) =>
    (i + 1) + ". " + clean(String(texts[i] == null ? d.answers[i] : texts[i]).slice(0, 200)) +
    (Number(d.answers[i]) === correct ? " (correct)" : " (wrong)")
  ).join(" | ");

  const resultRow = [
    new Date(), reg.first, reg.last, reg.email,
    LANG_NAMES[pickLang(d.language)],
    d.courseId, clean(String(d.courseVersion || "").slice(0, 20)),
    attempt, score + " / " + key.length, percent, passed ? "Pass" : "Fail",
    clean(String(d.videoStarted || "").slice(0, 40)), clean(String(d.videoFinished).slice(0, 40)), answerLog, reg.id
  ];
  sheet.appendRow(resultRow);
  log.res.push(resultRow);
  try { writeSummary([reg], log); } catch (err) { console.error("Summary update failed", err); }

  const remaining = passed ? 0 : before.remaining - 1;
  return {
    ok: true, score: score, total: key.length, percent: percent, passed: passed, attempt: attempt,
    status: { attempts: attempt, allowed: before.allowed, remaining: remaining, passed: passed, unlocked: true }
  };
}

function getRegistration(token) {
  if (!token || !/^[0-9a-f-]{36}$/i.test(String(token))) return null;
  const sheet = getSheet(REG_SHEET, REG_HEADERS);
  const found = findRow(sheet, 6, String(token));
  if (!found) return null;
  return regFromRow(found.values);
}

function regFromRow(r) {
  return { registered: r[0], first: r[1], last: r[2], email: r[3], lang: langFromName(r[4]), id: r[5] };
}

function summaryValues(reg, log) {
  const st = allStatuses(reg, log);
  const row = [reg.registered || "", reg.first, reg.last, reg.email, LANG_NAMES[reg.lang], ""];
  SESSION_ORDER.forEach(id => {
    const s = st[id];
    let result;
    if (s.passed) result = "Pass";
    else if (!s.unlocked) result = "Not open yet";
    else if (s.attempts === 0) result = "Not started";
    else if (s.remaining > 0) result = "Failed, " + s.remaining + " left";
    else result = "Out of attempts";
    row.push(result, s.attempts + " of " + s.allowed, s.best ? s.best[1] : "", s.passedOn || "");
  });
  const k = SESSION_ORDER.findIndex(id => !st[id].passed);
  let overall, completed = "";
  if (k === -1) { overall = "Complete"; completed = st[SESSION_ORDER[SESSION_ORDER.length - 1]].passedOn; }
  else if (st[SESSION_ORDER[k]].remaining === 0) overall = "Out of attempts (Session " + (k + 1) + ")";
  else if (k === 0 && st[SESSION_ORDER[0]].attempts === 0) overall = "Not started";
  else overall = "In progress (Session " + (k + 1) + ")";
  row[5] = overall;
  row.push(completed, reg.id);
  return row;
}

function writeSummary(regs, log) {
  const sheet = getSheet(SUM_SHEET, SUM_HEADERS);
  const n = sheet.getLastRow() - 1;
  const ids = n > 0 ? sheet.getRange(2, SUM_ID_COL, n, 1).getValues().map(r => String(r[0])) : [];
  const appends = [];
  regs.forEach(reg => {
    const values = summaryValues(reg, log);
    const at = ids.indexOf(String(reg.id));
    if (at === -1) { appends.push(values); ids.push(String(reg.id)); }
    else sheet.getRange(at + 2, 1, 1, SUM_WRITE_COLS).setValues([values]);
  });
  if (appends.length) sheet.getRange(sheet.getLastRow() + 1, 1, appends.length, SUM_WRITE_COLS).setValues(appends);
}

function refreshSummary() {
  return withLock(() => {
    const sheet = getSheet(REG_SHEET, REG_HEADERS);
    const n = sheet.getLastRow() - 1;
    if (n < 1) return;
    const regs = sheet.getRange(2, 1, n, REG_HEADERS.length).getValues().filter(r => r[5]).map(regFromRow);
    writeSummary(regs, readLog());
  });
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu("ReadyLine")
    .addItem("Look up a person", "lookupPerson")
    .addItem("Refresh summary", "refreshSummary")
    .addToUi();
}

function onEdit(e) {
  const sheet = e && e.range && e.range.getSheet();
  if (!sheet || sheet.getName() !== OVR_SHEET || e.range.getRow() < 2) return;
  const emails = sheet.getRange(e.range.getRow(), 1, e.range.getNumRows(), 1).getValues().map(r => norm(r[0])).filter(String);
  if (!emails.length) return;
  withLock(() => {
    const reg = getSheet(REG_SHEET, REG_HEADERS);
    const n = reg.getLastRow() - 1;
    if (n < 1) return;
    const regs = reg.getRange(2, 1, n, REG_HEADERS.length).getValues()
      .filter(r => r[5] && emails.indexOf(norm(r[3])) !== -1).map(regFromRow);
    if (regs.length) writeSummary(regs, readLog());
  });
}

function findRow(sheet, col, value) {
  const n = sheet.getLastRow() - 1;
  if (n < 1) return null;
  const hit = sheet.getRange(2, col, n, 1).createTextFinder(String(value)).matchEntireCell(true).findNext();
  if (!hit) return null;
  const rowNum = hit.getRow();
  return { rowNum: rowNum, values: sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0] };
}

function getSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}

function clean(v) {
  const s = String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, 500);
  return /^[\s]*[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function norm(v) { return String(v || "").trim().toLowerCase(); }

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function setup() {
  const reg = getSheet(REG_SHEET, REG_HEADERS);
  const res = getSheet(RES_SHEET, RES_HEADERS);
  const ovr = getSheet(OVR_SHEET, OVR_HEADERS);
  const sum = getSheet(SUM_SHEET, SUM_HEADERS);

  ovr.getRange("B2:B").setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(Object.keys(COURSES), true).setAllowInvalid(false).build());
  ovr.getRange("C2:C").setDataValidation(
    SpreadsheetApp.newDataValidation().requireNumberBetween(1, 10).setAllowInvalid(false).build());
  ovr.getRange("E2:E").setNumberFormat("yyyy-mm-dd");
  ovr.setColumnWidth(1, 240); ovr.setColumnWidth(4, 320);

  const dupRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($B2<>"",COUNTIFS($B:$B,$B2,$C:$C,$C2)>1)')
    .setBackground("#FCE8B2").setRanges([reg.getRange("A2:G")]).build();
  reg.setConditionalFormatRules([dupRule]);

  const r = res.getRange("K2:K");
  res.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Pass").setBackground("#D9EAD3").setRanges([r]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Fail").setBackground("#F4CCCC").setRanges([r]).build()
  ]);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(sum); ss.moveActiveSheet(1);
  sum.setFrozenColumns(3);
  sum.getRange(2, 1, sum.getMaxRows() - 1, SUM_HEADERS.length).setNumberFormat("@");
  sum.getRange("A2:A").setNumberFormat("yyyy-mm-dd");
  SESSION_ORDER.forEach((id, i) => sum.getRange(2, 10 + i * 4, sum.getMaxRows() - 1, 1).setNumberFormat("yyyy-mm-dd"));
  sum.getRange(2, SUM_HEADERS.length - 2, sum.getMaxRows() - 1, 1).setNumberFormat("yyyy-mm-dd");
  const resultCols = SESSION_ORDER.map((id, i) => sum.getRange(2, 7 + i * 4, sum.getMaxRows() - 1, 1));
  const overallCol = [sum.getRange("F2:F")];
  sum.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Pass").setBackground("#D9EAD3").setRanges(resultCols).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Complete").setBackground("#D9EAD3").setRanges(overallCol).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextStartsWith("Out of attempts").setBackground("#F4CCCC").setRanges(resultCols.concat(overallCol)).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextStartsWith("Failed").setBackground("#FCE8B2").setRanges(resultCols).build()
  ]);
  refreshSummary();

  MailApp.getRemainingDailyQuota();
  UrlFetchApp.getRequest("https://" + R2_ACCOUNT_ID + ".r2.cloudflarestorage.com");
  const props = PropertiesService.getScriptProperties();
  ["R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "TURNSTILE_SECRET"].forEach(k => {
    if (!props.getProperty(k)) console.warn("Missing Script Property: " + k);
  });
  if (/change-me/i.test(ONBOARDING_CODE) || ONBOARDING_CODE.length < 10) {
    console.warn("ONBOARDING_CODE is short or guessable. Use something longer, like three random words.");
  }
  if (/YOUR-PROJECT/.test(TRAINING_URL)) console.warn("TRAINING_URL still has the placeholder. Put your Cloudflare Pages address there.");
  if (/PASTE-YOUR/.test(R2_ACCOUNT_ID)) console.warn("R2_ACCOUNT_ID still has the placeholder. Copy your Account ID from Cloudflare.");
  if (SUPPORT_CONTACTS.some(c => /example\.com$/.test(c.email))) console.warn("SUPPORT_CONTACTS still has the sample contact.");
  const problems = checkSettings();
  if (problems.length) throw new Error("Fix these in YOUR SETTINGS, then run setup again:\n- " + problems.join("\n- "));
  console.log("Setup finished. ReadyLine " + READYLINE_VERSION + ", " + SESSIONS.length + " sessions, languages: " + LANGUAGES.join(", ") + ".");
}

function checkSettings() {
  const out = [];
  if (!Array.isArray(LANGUAGES) || !LANGUAGES.length || LANGUAGES.some(l => !LANG_NAMES[l])) out.push('LANGUAGES must be ["en"], ["es"], or ["en", "es"].');
  if (!SESSIONS.length) out.push("SESSIONS needs at least one session.");
  const ids = {};
  SESSIONS.forEach((s, i) => {
    const where = "Session " + (i + 1) + " (" + s.id + ")";
    if (!/^[a-z0-9-]{1,30}$/.test(String(s.id))) out.push(where + ": id should be lowercase letters, numbers, and hyphens only.");
    if (ids[s.id]) out.push(where + ": id is used twice.");
    ids[s.id] = true;
    LANGUAGES.forEach(l => {
      if (!s.title || !s.title[l]) out.push(where + ": missing title for " + l + ".");
      if (!s.minutes || !(s.minutes[l] > 0)) out.push(where + ": missing minutes for " + l + ".");
      if (!s.videos || !s.videos[l]) out.push(where + ": missing video file name for " + l + ".");
      if (s.captions && s.captions[l] && !/\.vtt$/i.test(s.captions[l])) out.push(where + ": caption files must be WebVTT (.vtt) for " + l + ".");
    });
    if (!s.questions || !s.questions.length) out.push(where + ": needs at least one question.");
    (s.questions || []).forEach((q, j) => {
      const qw = where + ", question " + (j + 1);
      const counts = LANGUAGES.map(l => q[l] && Array.isArray(q[l].a) ? q[l].a.length : 0);
      LANGUAGES.forEach(l => { if (!q[l] || !q[l].q || !Array.isArray(q[l].a) || q[l].a.length < 2) out.push(qw + ": needs the question and at least two options in " + l + "."); });
      if (counts.some(c => c !== counts[0])) out.push(qw + ": each language needs the same number of options.");
      if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < counts[0])) out.push(qw + ": answer must be an option number from 0 to " + (counts[0] - 1) + ".");
    });
  });
  if (!TRAINING_NAME || LANGUAGES.some(l => !TRAINING_NAME[l])) out.push("TRAINING_NAME needs a name for each language you offer.");
  if (!SUPPORT_CONTACTS.length) out.push("SUPPORT_CONTACTS needs at least one person.");
  return out;
}

// ReadyLine > Look up a person: everything about one learner, with their personal link ready to copy.
function lookupPerson() {
  const ui = SpreadsheetApp.getUi();
  const ask = ui.prompt("Look up a person", "Enter the email they registered with:", ui.ButtonSet.OK_CANCEL);
  if (ask.getSelectedButton() !== ui.Button.OK) return;
  const html = personReport(ask.getResponseText());
  if (!html) {
    ui.alert("No registration found for " + norm(ask.getResponseText()) + ".\n\nCheck the spelling, or search the Registrations tab for their name. They may have registered with a different email.");
    return;
  }
  ui.showModalDialog(HtmlService.createHtmlOutput(html).setWidth(560).setHeight(520), "Look up a person");
}

function personReport(emailText) {
  const email = norm(emailText);
  if (!EMAIL_RE.test(email)) return "";
  const found = findRow(getSheet(REG_SHEET, REG_HEADERS), 4, email);
  if (!found) return "";
  const reg = regFromRow(found.values);
  const sent = Number(found.values[6]) || 1;
  const row = summaryValues(reg, readLog());
  const link = TRAINING_URL + "?t=" + encodeURIComponent(reg.id);
  const date = d => d instanceof Date ? Utilities.formatDate(d, Session.getScriptTimeZone(), "MMM d, yyyy h:mm a") : esc(String(d || ""));
  const sessionRows = SESSIONS.map((s, i) => {
    const c = 6 + i * 4;
    return "<tr><td>" + esc(s.title[reg.lang] || s.id) + "</td><td>" + esc(row[c]) + "</td><td>" + esc(row[c + 1]) + "</td><td>" + date(row[c + 3]) + "</td></tr>";
  }).join("");
  return '<style>body{font:14px/1.45 Arial,sans-serif;color:#1F2328;margin:4px}h2{font-size:18px;margin:0 0 4px}' +
    'p{margin:6px 0}.soft{color:#59636E}table{border-collapse:collapse;width:100%;margin:10px 0}th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #E5E7EB;font-size:13px}' +
    'input{width:100%;box-sizing:border-box;padding:8px;font:13px monospace;border:1px solid #C9CED4;border-radius:6px}button{margin-top:8px;padding:8px 14px;border:0;border-radius:6px;background:#1F2328;color:#fff;font-weight:700;cursor:pointer}</style>' +
    "<h2>" + esc(reg.first + " " + reg.last) + "</h2>" +
    '<p class="soft">' + esc(reg.email) + " &middot; " + esc(LANG_NAMES[reg.lang]) + " &middot; registered " + date(reg.registered) + "</p>" +
    "<p><strong>Overall:</strong> " + esc(row[5]) + "</p>" +
    "<table><tr><th>Session</th><th>Result</th><th>Attempts</th><th>Passed on</th></tr>" + sessionRows + "</table>" +
    "<p><strong>Link emails sent:</strong> " + sent + " of " + MAX_LINK_SENDS +
    (sent >= MAX_LINK_SENDS ? " (limit reached: set Links sent back to 1 on the Registrations tab to allow more)" : "") + "</p>" +
    "<p><strong>Their personal link</strong> (send it only to them; anyone with it takes the training as them):</p>" +
    '<input id="l" readonly value="' + esc(link) + '" onclick="this.select()">' +
    '<button onclick="var l=document.getElementById(\'l\');l.select();document.execCommand(\'copy\');this.textContent=\'Copied\'">Copy link</button>' +
    '<p class="soft">Email not arriving? Ask them to search their email for the training name and check Spam, Junk, and Promotions.</p>';
}

