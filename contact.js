// ─────────────────────────────────────────────
// EMAILJS CONFIGURATION
// 1. Sign up free at https://www.emailjs.com
// 2. Create a Service (Gmail/Outlook/etc) → copy the Service ID below
// 3. Create two Email Templates:
//    a) NOTIFICATION template (to club inbox) — Template ID goes in TEMPLATE_NOTIFY
//    b) AUTO-REPLY template (to sender)       — Template ID goes in TEMPLATE_AUTOREPLY
// 4. Copy your Public Key from Account → API Keys below
// ─────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY    = 'i8yljczqqyGvwPsDh';          // ← replace
const EMAILJS_SERVICE_ID    = 'service_yl0oasy';          // ← replace
const TEMPLATE_NOTIFY       = 'template_ixi8o5r';     // ← replace (club receives this)
const TEMPLATE_AUTOREPLY    = 'template_lj12f8s';  // ← replace (sender receives this)

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });


// ─────────────────────────────────────────────
// Navbar scroll
// ─────────────────────────────────────────────
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ─────────────────────────────────────────────
// Scroll reveal
// ─────────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ─────────────────────────────────────────────
// Topic chips
// ─────────────────────────────────────────────
let selectedTopic = 'General';
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    selectedTopic = chip.dataset.topic;
  });
});

// ─────────────────────────────────────────────
// Character count
// ─────────────────────────────────────────────
const msgInput   = document.getElementById('message');
const charDisplay = document.getElementById('charDisplay');
const MAX_CHARS  = 500;
msgInput.addEventListener('input', () => {
  const len = msgInput.value.length;
  charDisplay.textContent = len + ' / ' + MAX_CHARS;
  charDisplay.className = 'char-count';
  if (len > MAX_CHARS * 0.9) charDisplay.classList.add('warn');
  if (len > MAX_CHARS) charDisplay.classList.add('over');
});

// ─────────────────────────────────────────────
// Email format + domain validation
// Checks: (1) correct format, (2) real TLD, (3) known-fake TLDs blocked,
// (4) disposable/temp email domains blocked.
// True MX verification requires a backend — this is the best possible front-end check.
// ─────────────────────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com',
  'throwam.com','yopmail.com','sharklasers.com','guerrillamailblock.com',
  'grr.la','guerrillamail.info','guerrillamail.biz','guerrillamail.de',
  'guerrillamail.net','guerrillamail.org','spam4.me','trashmail.com',
  'trashmail.me','trashmail.at','trashmail.io','fakeinbox.com',
  'maildrop.cc','dispostable.com','mailnull.com','spamgourmet.com',
  'spamgourmet.net','spamgourmet.org','spamex.com','discard.email',
  'spamtraps.me','spamhereplease.com','spamspot.com',
]);

function validateEmailFormat(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, msg: 'Please enter a valid email address.' };
  }
  const domain = email.split('@')[1].toLowerCase();
  const tld = domain.split('.').pop();
  if (tld.length < 2) {
    return { ok: false, msg: 'Email domain appears invalid.' };
  }
  if (['test','fake','invalid','example','localhost'].includes(tld)) {
    return { ok: false, msg: 'Please use a real email address.' };
  }
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { ok: false, msg: 'Disposable email addresses are not accepted.' };
  }
  return { ok: true };
}

// Live email feedback on blur (when user clicks away from the field)
const emailInput = document.getElementById('email');
const emailErr   = document.getElementById('emailErr');
emailInput.addEventListener('blur', () => {
  if (emailInput.value.trim() === '') return;
  const result = validateEmailFormat(emailInput.value.trim());
  if (!result.ok) {
    emailInput.classList.add('error');
    emailErr.textContent = result.msg;
    emailErr.style.display = 'block';
  } else {
    emailInput.classList.remove('error');
    emailErr.style.display = 'none';
  }
});

// ─────────────────────────────────────────────
// Sending state helpers
// ─────────────────────────────────────────────
const submitBtn = document.getElementById('submitBtn');
function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? 'Sending...' : 'Send Message';
}

// ─────────────────────────────────────────────
// Form validation & submit
// ─────────────────────────────────────────────
submitBtn.addEventListener('click', async () => {
  let valid = true;

  const fields = [
    { id: 'fname',   errId: 'fnameErr',   check: v => v.trim().length > 0,
      msg: 'Please enter your first name.' },
    { id: 'lname',   errId: 'lnameErr',   check: v => v.trim().length > 0,
      msg: 'Please enter your last name.' },
    { id: 'message', errId: 'messageErr', check: v => v.trim().length >= 10 && v.trim().length <= MAX_CHARS,
      msg: 'Please enter your message (min. 10 characters).' },
  ];

  fields.forEach(({ id, errId, check, msg }) => {
    const input = document.getElementById(id);
    const err   = document.getElementById(errId);
    if (!check(input.value)) {
      input.classList.add('error');
      err.textContent = msg;
      err.style.display = 'block';
      valid = false;
    } else {
      input.classList.remove('error');
      err.style.display = 'none';
    }
  });

  // Email check (uses enhanced validator above)
  const emailVal    = emailInput.value.trim();
  const emailResult = validateEmailFormat(emailVal);
  if (!emailResult.ok) {
    emailInput.classList.add('error');
    emailErr.textContent = emailResult.msg;
    emailErr.style.display = 'block';
    valid = false;
  } else {
    emailInput.classList.remove('error');
    emailErr.style.display = 'none';
  }

  if (!valid) return;

  // ── Send via EmailJS ──
  setLoading(true);

  const templateParams = {
    from_name : document.getElementById('fname').value.trim() + ' ' + document.getElementById('lname').value.trim(),
    from_email: emailVal,
    phone     : document.getElementById('phone').value.trim() || 'Not provided',
    topic     : selectedTopic || 'General',
    message   : msgInput.value.trim(),
    source    : document.getElementById('source').value || 'Not specified',
    reply_to  : emailVal,
  };

  try {
    // 1) Notify the club inbox
    await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_NOTIFY, templateParams);

    // 2) Send auto-reply confirmation to the person who submitted
    await emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_AUTOREPLY, templateParams);

    // Show success state
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';

  } catch (error) {
    console.error('EmailJS error:', error);
    emailErr.textContent = 'Message could not be sent. Please try again or email us directly.';
    emailErr.style.display = 'block';
    emailInput.classList.add('error');
  } finally {
    setLoading(false);
  }
});

// ─────────────────────────────────────────────
// Reset form
// ─────────────────────────────────────────────
document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('contactForm').style.display = 'block';
  document.getElementById('formSuccess').style.display = 'none';
  document.getElementById('fname').value    = '';
  document.getElementById('lname').value    = '';
  document.getElementById('email').value    = '';
  document.getElementById('phone').value    = '';
  document.getElementById('message').value  = '';
  document.getElementById('source').value   = '';
  charDisplay.textContent = '0 / 500';
  charDisplay.className   = 'char-count';
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  selectedTopic = 'General';
});
