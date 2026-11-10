// Runs apps-script/Code.gs against an in-memory fake of the Google services it uses.
// No Google account needed. Used by the tests in this folder.
const fs = require('fs');
const crypto = require('crypto');
const sheets = {};
const mail = [];
function makeSheet(name) {
  const rows = [];
  return {
    name, rows,
    appendRow: r => rows.push(r.slice()),
    getLastRow: () => rows.length,
    getLastColumn: () => Math.max(0, ...rows.map(r => r.length)),
    setFrozenRows() {}, setFrozenColumns() {}, getMaxRows: () => 1000, setColumnWidth() {}, setConditionalFormatRules() {},
    getRange(a, b, c, d) {
      if (typeof a === 'string') return { setFontWeight() {}, setDataValidation() {}, setNumberFormat() {} };
      const row = a, col = b, nr = c || 1, nc = d || 1;
      return {
        setFontWeight() {}, setNumberFormat() {},
        setValues: vals => vals.forEach((v, i) => { while (rows.length < row + i) rows.push([]); rows[row - 1 + i] = rows[row - 1 + i] || []; v.forEach((x, j) => { rows[row - 1 + i][col - 1 + j] = x; }); }),
        getValues: () => rows.slice(row - 1, row - 1 + nr).map(r => { const o = []; for (let i = 0; i < nc; i++) o.push(r[col - 1 + i] === undefined ? '' : r[col - 1 + i]); return o; }),
        setValue: v => { rows[row - 1][col - 1] = v; },
        createTextFinder: (val) => ({ matchEntireCell() { return this; }, findNext() {
          for (let i = row - 1; i < row - 1 + nr; i++) if (String(rows[i][col - 1]) === val) return { getRow: () => i + 1 };
          return null; } })
      };
    }
  };
}
const ss = {
  getSheetByName: n => sheets[n] || null,
  insertSheet: n => (sheets[n] = makeSheet(n)), setActiveSheet() {}, moveActiveSheet() {}
};
const toSigned = buf => Array.from(buf).map(b => b > 127 ? b - 256 : b);
global.SpreadsheetApp = {
  getActiveSpreadsheet: () => ss,
  newDataValidation: () => { const b = { requireValueInList: () => b, requireNumberBetween: () => b, setAllowInvalid: () => b, build: () => ({}) }; return b; },
  newConditionalFormatRule: () => { const b = { whenFormulaSatisfied: () => b, whenTextEqualTo: () => b, whenTextStartsWith: () => b, setBackground: () => b, setRanges: () => b, build: () => ({}) }; return b; },
  getUi: () => ui
};
// Sheet menus and dialogs: tests set ui.answer and read ui.shown.
const ui = { answer: '', shown: [], menu: [],
  ButtonSet: { OK_CANCEL: 'OK_CANCEL' }, Button: { OK: 'OK', CANCEL: 'CANCEL' },
  prompt: () => ({ getSelectedButton: () => (ui.answer === null ? 'CANCEL' : 'OK'), getResponseText: () => ui.answer || '' }),
  alert: m => ui.shown.push({ alert: m }),
  showModalDialog: (h, title) => ui.shown.push({ dialog: h.html, title }),
  createMenu: () => { const m = { addItem: (l, f) => { ui.menu.push([l, f]); return m; }, addToUi: () => {} }; return m; } };
global.HtmlService = { createHtmlOutput: html => { const o = { html, setWidth: () => o, setHeight: () => o }; return o; } };
global.Session = { getScriptTimeZone: () => 'America/Chicago' };
const lockState = { busy: false };
const cacheStore = {};
global.CacheService = { getScriptCache: () => ({ get: k => (k in cacheStore ? cacheStore[k] : null), put: (k, v) => { cacheStore[k] = v; } }) };
global.LockService = { getScriptLock: () => ({ waitLock() {}, tryLock() { return !lockState.busy; }, releaseLock() {} }) };
global.MailApp = { sendEmail: m => mail.push(m), getRemainingDailyQuota: () => 1500 };
const fetchLog = [];
global.UrlFetchApp = { getRequest() {}, fetch(url, opts) {
  fetchLog.push(url);
  if (url.includes('turnstile/v0/siteverify')) {
    const r = opts.payload.response, good = (r === 'tt-ok' || r === 'tt-resend') && opts.payload.secret === 'turnstile-secret';
    return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ success: good, action: r === 'tt-resend' ? 'resend' : 'register' }) };
  }
  if (/\.vtt\?/.test(url)) return { getResponseCode: () => 200, getContentText: () => 'WEBVTT\n\n1\n00:00:00.000 --> 00:00:02.000\nSample caption\n' };
  return { getResponseCode: () => 200, getContentText: () => '' };
} };
const props = { R2_ACCESS_KEY_ID: 'AKIDTEST', R2_SECRET_ACCESS_KEY: 'secret', TURNSTILE_SECRET: 'turnstile-secret' };
global.PropertiesService = { getScriptProperties: () => ({ getProperty: k => props[k] === undefined ? null : props[k], setProperty: (k, v) => { props[k] = String(v); } }) };
global.ContentService = { createTextOutput: t => ({ setMimeType: () => JSON.parse(t) }), MimeType: { JSON: 'json' } };
global.Utilities = {
  getUuid: () => crypto.randomUUID(),
  newBlob: s => ({ getBytes: () => toSigned(Buffer.from(s, 'utf8')) }),
  computeHmacSha256Signature: (msg, key) => toSigned(crypto.createHmac('sha256', Buffer.from(key.map(x => x & 255))).update(Buffer.from(msg.map(x => x & 255))).digest()),
  computeDigest: (_a, s) => toSigned(crypto.createHash('sha256').update(s, 'utf8').digest()),
  formatDate: d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''),
  DigestAlgorithm: {}, Charset: {}
};
global.console = console;
const src = fs.readFileSync(require('path').join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8');
const G = new Function(src + '; return { doPost, doGet, setup, COURSES, SESSIONS, LANGUAGES, clean, refreshSummary, onEdit, onOpen, checkSettings, testVideoLinks, lookupPerson, personReport };')();
const call = body => G.doPost({ postData: { contents: JSON.stringify(body) } });
module.exports = { ui, G, call, sheets, mail, props, lockState, fetchLog, cacheStore };
