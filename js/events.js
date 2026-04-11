// ─────────────────────────────────────────────
// BOUNDLESS FC — events.js
// Set these two values after deploying Apps Script
// ─────────────────────────────────────────────

const BFC_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxK4Yx9p59b51mJWOiXw5UaOHRDzzA_tDYWloqp_-HFXRX0LMiGO00Ut1kx__4r1LtZ/exec';
const BFC_ADMIN_KEY  = 'Takami_0410';

// ─── LOW-LEVEL HELPERS ───────────────────────

async function bfcGet(params = {}) {
  const url = new URL(BFC_SCRIPT_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { redirect: 'follow' });
  return res.json();
}

async function bfcPost(data) {
  const res = await fetch(BFC_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return res.json();
}

// ─── PUBLIC API ───────────────────────────────

async function bfcGetEvents() {
  return bfcGet({ action: 'getEvents' });
}

async function bfcRegister({ eventId, eventName, name, instagram, phone }) {
  return bfcGet({ action: 'register', eventId, eventName, name, instagram, phone });
}

async function bfcAddEvent(adminKey, eventData) {
  return bfcGet({ action: 'addEvent', adminKey, ...eventData });
}

async function bfcDeleteEvent(adminKey, eventId) {
  return bfcGet({ action: 'deleteEvent', adminKey, eventId });
}

// ─── UTILITIES ───────────────────────────────

const BFC_MONTHS_S = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const BFC_MONTHS_L = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const BFC_DAYS_L   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function bfcParseDate(str) {
  return new Date(str + 'T00:00:00');
}

function bfcFormatDateShort(str) {
  const d = bfcParseDate(str);
  return `${d.getDate()} ${BFC_MONTHS_S[d.getMonth()]}`;
}

function bfcFormatDateLong(str) {
  const d = bfcParseDate(str);
  return `${BFC_DAYS_L[d.getDay()]}, ${d.getDate()} ${BFC_MONTHS_L[d.getMonth()]} ${d.getFullYear()}`;
}

function bfcFormatTime(str) {
  if (!str) return '';
  return String(str).substring(0, 5);
}

function bfcDayOfWeekShort(str) {
  const d = bfcParseDate(str);
  return ['SUN','MON','TUE','WED','THU','FRI','SAT'][d.getDay()];
}

function bfcDayNum(str) {
  return bfcParseDate(str).getDate();
}

function bfcMonthShort(str) {
  return BFC_MONTHS_S[bfcParseDate(str).getMonth()];
}

function bfcGenRef() {
  return 'BFC' + Date.now().toString(36).toUpperCase();
}

// Navbar scroll effect (used on all pages)
function bfcInitNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
}

// Scroll reveal (used on all pages)
function bfcInitReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  return obs;
}