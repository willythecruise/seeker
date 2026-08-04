/* ============================================================
   Orion — core: constants, icons, state, UI atoms, helpers
   ('use strict' directive lives at the top of the bundle)
   ============================================================ */

/* ── Constants ─────────────────────────────────────────────── */

const CATS = [
  { id: 'system-design', name: 'System Design', icon: 'layers' },
  { id: 'frontend',      name: 'Frontend · React / Next.js', icon: 'code' },
  { id: 'backend',       name: 'Backend · Node.js', icon: 'server' },
  { id: 'db-mongodb',    name: 'Database · MongoDB', icon: 'database' },
  { id: 'db-postgres',   name: 'Database · PostgreSQL', icon: 'database' },
  { id: 'coding',        name: 'General Coding Practice', icon: 'pencil' },
  { id: 'devops',        name: 'DevOps', icon: 'terminal' },
  { id: 'solutions',     name: 'Solutions Architecture', icon: 'blueprint' },
  { id: 'cs',            name: 'C#', icon: 'hash' },
  { id: 'java',          name: 'Java', icon: 'coffee' },
  { id: 'python',        name: 'Python', icon: 'snake' },
  { id: 'dotnet',      name: '.NET / ASP.NET Core', icon: 'window' },
  { id: 'springboot',  name: 'Spring Boot', icon: 'leaf' },
  { id: 'django',      name: 'Django', icon: 'flower' },
  { id: 'typescript',  name: 'TypeScript', icon: 'braces' },
  { id: 'go',          name: 'Go', icon: 'compass' },
  { id: 'rust',        name: 'Rust', icon: 'gear' },
  { id: 'dsa',          name: 'Data Structures & Algorithms', icon: 'tree' },
  { id: 'backend-eng', name: 'Backend Engineering · C# / Java / Python', icon: 'server' }
];

const DIFFS = [
  { id: 'beginner',     name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced',     name: 'Advanced' }
];

const DIFF_FOCUS_LABEL = {
  beginner: 'Weighted toward beginner questions',
  balanced: 'A balanced mix of all difficulty levels',
  advanced: 'Weighted toward advanced questions'
};

const DIFF_WEIGHTS = {
  beginner: { beginner: 0.6,  intermediate: 0.3, advanced: 0.1 },
  balanced: { beginner: 0.34, intermediate: 0.33, advanced: 0.33 },
  advanced: { beginner: 0.1,  intermediate: 0.3, advanced: 0.6 }
};

const LETTERS = ['A', 'B', 'C', 'D'];

/* ── State ─────────────────────────────────────────────────── */

const S = {
  mode: 'console',        // console | candidate
  view: 'app',            // app | login (console requires auth)
  tab: 'dashboard',       // dashboard | tests | editor | questions | results | admins
  candView: 'home',       // home | runner | result
  auth: null,             // admin session
  stats: null,            // dashboard stats from server
  questions: [],          // admin: full bank
  tests: [],
  attempts: [],
  admins: [],
  pubTests: [],           // candidate: published tests
  qPool: {},              // qid -> question (rendering pool)
  live: null,             // candidate in-progress attempt
  liveQuestions: {},      // qid -> sanitized question for the live attempt
  candResult: null,       // submitted attempt record (server-graded)
  qIdx: 0,
  timerId: null,
  qFilters: { search: '', cat: 'all', diff: 'all', type: 'all' },
  events: [],             // admin: proctoring / audit log
  modal: null,
  _pendingTestId: null,
  _focusSearch: null
};

/* draft objects for the editors (module-level so every module shares them) */
let tDraft = null;
let qDraft = null;

/* ── DOM / string helpers ──────────────────────────────────── */

const $  = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function norm(s) {
  return String(s == null ? '' : s).trim().toLowerCase()
    .replace(/[.,;:!?'")\]]+$/g, '')
    .replace(/\s+/g, ' ');
}

function fmtClock(sec) {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60), s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function fmtMins(sec) {
  sec = Math.round(sec);
  const m = Math.floor(sec / 60), s = sec % 60;
  if (m === 0) return s + 's';
  if (s === 0) return m + ' min';
  return m + 'm ' + s + 's';
}

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString() + ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ── Storage (auth token only; all data lives in MongoDB) ──── */

const store = {
  get(k, d) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }
    catch (e) { return d; }
  },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

/* ── Lookups ───────────────────────────────────────────────── */

const catOf  = id => CATS.find(c => c.id === id) || { id, name: id, icon: 'layers' };
const diffOf = id => DIFFS.find(d => d.id === id) || { id, name: id };

/* Question lookup: prefers the rendering pool (attempt questions),
   falls back to the admin bank. */
function qOf(id) {
  if (S.qPool && S.qPool[id]) return S.qPool[id];
  return S.questions.find(q => q.id === id);
}

function buildQPool(list) {
  S.qPool = {};
  (list || []).forEach(q => { if (q) S.qPool[q.id] = q; });
}

/* ── Icons (consistent outline set) ────────────────────────── */

const ICONS = {
  dashboard: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  doc: '<path d="M6 2.5h9l5 5V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z"/><path d="M15 2.5v5h5"/><path d="M9 12.5h6M9 16.5h6"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.4 9.2a2.6 2.6 0 1 1 4.6 1.5c-.9.8-2 1.5-2 3.1"/><path d="M12 17.4h.01"/>',
  chart: '<path d="M5 20v-9M11 20V4.5M17 20v-6"/><path d="M3 20h18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  check: '<path d="M4.5 12.5l5 5L19.5 7"/>',
  chevronR: '<path d="M9 6l6 6-6 6"/>',
  chevronD: '<path d="M6 9l6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16 16"/>',
  flag: '<path d="M5.5 21V4"/><path d="M5.5 4h11l-2.4 4 2.4 4h-11"/>',
  trash: '<path d="M4 7h16M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M6.5 7l1 12.5h9L17.5 7M10 11v5.5M14 11v5.5"/>',
  pencil: '<path d="M4 20l1.2-4.5L16.7 4a2.1 2.1 0 0 1 3 3L8.2 18.5 4 20z"/><path d="M14.5 6.5l3 3"/>',
  copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2.5"/><path d="M15.5 4H6a2 2 0 0 0-2 2v9.5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  play: '<path d="M7.5 5.2v13.6L19 12 7.5 5.2z"/>',
  arrowL: '<path d="M19 12H5M12 5l-7 7 7 7"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7.5" r="3.5"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M15.5 4.2a3.5 3.5 0 0 1 0 6.7"/>',
  lock: '<rect x="4.5" y="11" width="15" height="9.5" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/>',
  refresh: '<path d="M20.5 12a8.5 8.5 0 1 1-2.5-6L20.5 8"/><path d="M20.5 3.5V8h-4.5"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17.5H6.5A2.5 2.5 0 0 0 4 22V4.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  code: '<path d="M8 7L3 12l5 5M16 7l5 5-5 5"/>',
  server: '<rect x="3.5" y="4" width="17" height="7" rx="2"/><rect x="3.5" y="13" width="17" height="7" rx="2"/><path d="M7.5 7.5h.01M7.5 16.5h.01"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="2.8"/><path d="M4 5v14c0 1.55 3.6 2.8 8 2.8s8-1.25 8-2.8V5"/><path d="M4 12c0 1.55 3.6 2.8 8 2.8s8-1.25 8-2.8"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9.5l3 2.5-3 2.5M12.5 14.5H17"/>',
  blueprint: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M3.5 9.5h17M9.5 21v-11.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  alert: '<path d="M12 3.5L22 20.5H2L12 3.5z"/><path d="M12 10v4"/><path d="M12 17.2h.01"/>',
  logout: '<path d="M9 21H5.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2H9"/><path d="M15.5 16.5L20 12l-4.5-4.5M20 12H8.5"/>',
  filter: '<path d="M4 5.5h16M7 12h10M10 18.5h4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  key: '<circle cx="7.5" cy="15.5" r="3.5"/><path d="M10.2 12.8L20.5 2.5M15.5 7.5l3 3M12.5 10.5l3 3"/>',
  hash: '<path d="M9 3.5L7.5 20.5"/><path d="M16.5 3.5L15 20.5"/><path d="M4 8.5h16"/><path d="M3.5 15.5h16"/>',
  coffee: '<path d="M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z"/><path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M7.5 3.5c.8 1 .8 1.8 0 2.8M11.5 3.5c.8 1 .8 1.8 0 2.8"/>',
  snake: '<path d="M4 9h10a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h7"/><circle cx="19.5" cy="8" r="1.6"/>',
  window: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17"/><path d="M9.5 9.5v10"/>',
  leaf: '<path d="M5.5 18.5C5.5 10 11.5 5 20 4c-1 8.5-6 14.5-14.5 14.5z"/><path d="M5.5 18.5C9 13 12.5 10 16 8"/>',
  flower: '<circle cx="12" cy="12" r="2.4"/><path d="M12 9.6a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z"/><path d="M9.6 12a3.2 3.2 0 1 1-6.4 0 3.2 3.2 0 0 1 6.4 0z"/><path d="M14.4 12a3.2 3.2 0 1 1 6.4 0 3.2 3.2 0 0 1-6.4 0z"/><path d="M9.6 14.4a3.2 3.2 0 1 1-2.26 5.46A3.2 3.2 0 0 1 9.6 14.4z"/><path d="M14.4 14.4a3.2 3.2 0 1 0 2.26 5.46 3.2 3.2 0 0 0-2.26-5.46z"/>',
  braces: '<path d="M9 4a4 4 0 0 0-4 4c0 1.6-1 2-1 4s1 2.4 1 4a4 4 0 0 0 4 4"/><path d="M15 4a4 4 0 0 1 4 4c0 1.6 1 2 1 4s-1 2.4-1 4a4 4 0 0 1-4 4"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 5.2-5.2 2.2 2.2-5.2 5.2-2.2z"/>',
  link: '<path d="M9.5 14.5l5-5"/><path d="M11 6.5l1.7-1.7a3.5 3.5 0 0 1 5 5L15.8 12"/><path d="M13 17.5l-1.7 1.7a3.5 3.5 0 0 1-5-5L8.2 12"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".9"/><circle cx="4.5" cy="12" r=".9"/><circle cx="4.5" cy="18" r=".9"/>',
  terminal2: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9.5l3 2.5-3 2.5M12.5 14.5H17"/>',
  tree: '<path d="M12 3v6M12 9L7 15M12 9l5 6M7 15H4v3M12 21v-6M7 18H4.5M7 18h5M12 15h5v3M17 18h2.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  shield: '<path d="M12 2.5l7.5 3v5.5c0 4.8-3.2 8.4-7.5 10.5-4.3-2.1-7.5-5.7-7.5-10.5V5.5l7.5-3z"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>'
};

function ic(name, size, cls) {
  return '<svg class="ic ' + (cls || '') + '" width="' + (size || 17) + '" height="' + (size || 17) +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    (ICONS[name] || '') + '</svg>';
}

function logoMark() {
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<circle cx="7.5" cy="7.5" r="2.6"/><circle cx="12" cy="12" r="2.6"/><circle cx="16.5" cy="16.5" r="2.6"/></svg>';
}

/* ── Shared UI atoms ───────────────────────────────────────── */

function brandHTML() {
  return '<a class="brand" href="#" data-action="brand" aria-label="Orion home">' +
    '<span class="brand-mark">' + logoMark() + '</span>' +
    '<span class="brand-name">Orion</span>' +
    '<span class="brand-sub">Engineering Assessments</span></a>';
}

function modeSeg() {
  const opts = [['console', 'Console'], ['candidate', 'Candidate']];
  return '<div class="seg" id="modeSeg">' +
    opts.map(o => '<button class="seg-item ' + (S.mode === o[0] ? 'active' : '') + '" data-action="mode" data-value="' + o[0] + '">' + o[1] + '</button>').join('') +
    '<span class="seg-thumb" id="modeThumb"></span></div>';
}

function positionSeg(segSel, thumbSel, idx) {
  const seg = $(segSel), thumb = $(thumbSel);
  if (!seg || !thumb) return;
  const items = Array.from(seg.querySelectorAll('.seg-item'));
  const el = items[idx];
  if (!el) return;
  thumb.style.width = el.offsetWidth + 'px';
  thumb.style.transform = 'translateX(' + (el.offsetLeft - 3) + 'px)';
}

function sidebarHTML(nav, mode) {
  const isCand = mode === 'candidate';
  const activeVal = isCand ? S.candView : S.tab;
  const counts = { tests: S.tests.length, questions: S.questions.length, results: S.attempts.length, admins: S.admins.length };
  return '<aside class="sidebar" id="sidebar">' +
    '<div class="sidebar-inner">' +
      '<div class="sidebar-head">' + brandHTML() +
        '<button class="btn-icon hide-desktop" data-action="sidebar-close" aria-label="Close menu" style="width:32px;height:32px">' + ic('x', 18) + '</button>' +
      '</div>' +
      '<nav class="sidebar-nav">' +
        nav.map(n => {
          const active = activeVal === n[0] || (n[0] === 'tests' && activeVal === 'editor');
          return '<button class="nav-item ' + (active ? 'active' : '') + '" data-action="' + (isCand ? 'cand-nav' : 'tab') + '" data-value="' + n[0] + '">' +
            ic(n[2], 18) +
            '<span class="nav-label">' + n[1] + '</span>' +
            (counts[n[0]] != null ? '<span class="nav-count">' + counts[n[0]] + '</span>' : '') +
          '</button>';
        }).join('') +
      '</nav>' +
      '<div class="sidebar-foot">' +
        '<div class="sidebar-label">Portal</div>' + modeSeg() +
      '</div>' +
    '</div>' +
  '</aside>' +
  '<div class="sidebar-overlay" id="sidebarOverlay" data-action="sidebar-close"></div>';
}

function headerHTML(mode) {
  const isCand = mode === 'candidate';
  const inRunner = isCand && S.candView === 'runner' && S.live;
  const inProgress = (!isCand && S.attempts) ? S.attempts.filter(a => a.status !== 'submitted').length : 0;
  return '<div class="topbar-inner">' +
    '<div class="topbar-left">' +
      '<button class="btn-icon hide-desktop" data-action="sidebar-open" aria-label="Open menu">' + ic('menu', 20) + '</button>' +
      '<div class="search">' +
        '<input id="globalSearch" placeholder="Search" value="' + esc(S.qFilters.search) + '" autocomplete="off">' +
        ic('search', 18) +
      '</div>' +
    '</div>' +
    '<div class="topbar-right">' +
      (inRunner ? '<span class="timer" id="timerDisplay">' + ic('clock', 15) + ' ' + fmtClock(S.live.remaining) + '</span>' : '') +
      (isCand ? '' : '<button class="btn-icon bell-wrap" data-action="tab" data-value="results" title="In-progress attempts">' +
        ic('bell', 20) + (inProgress ? '<span class="bell-badge">' + inProgress + '</span>' : '') + '</button>') +
      (isCand ? '' : '<div class="user-menu-wrap">' +
        '<button class="user-chip" data-action="user-menu" aria-expanded="false">' +
          '<span class="user-avatar">' + esc((S.auth.displayName || S.auth.username).slice(0, 1).toUpperCase()) + '</span>' +
          '<span class="user-info hide-mobile">' +
            '<span class="user-name">' + esc(S.auth.displayName || S.auth.username) + '</span>' +
            '<span class="user-role">' + (S.auth.role === 'superadmin' ? 'Superadmin' : 'Admin') + '</span>' +
          '</span>' +
          ic('chevronD', 14) +
        '</button>' +
        '<div class="user-menu">' +
          '<button class="user-menu-item" data-action="change-password">' + ic('key', 15) + ' Change password</button>' +
          '<button class="user-menu-item danger" data-action="logout">' + ic('logout', 15) + ' Sign out</button>' +
        '</div>' +
      '</div>') +
    '</div>' +
  '</div>';
}

function toast(msg, type) {
  let wrap = $('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast ' + (type || '');
  const icon = type === 'success' ? 'check' : type === 'error' ? 'alert' : 'info';
  t.innerHTML = ic(icon, 15) + '<span>' + esc(msg) + '</span>';
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .35s ease'; setTimeout(() => t.remove(), 380); }, 2600);
}

/* ── Modal ─────────────────────────────────────────────────── */

let modalConfirmCb = null;

function openModal(o) {
  S.modal = o;
  modalConfirmCb = o.onConfirm || null;
  render();
}

function closeModal() { S.modal = null; modalConfirmCb = null; render(); }

function confirmModal(o) {
  S.modal = {
    title: o.title,
    body: '<p style="font-size:14.5px;color:var(--text-2);line-height:1.65">' + o.body + '</p>',
    foot: '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn ' + (o.danger ? 'btn-danger-solid' : 'btn-primary') + '" data-action="modal-confirm">' + (o.confirmLabel || 'Confirm') + '</button>',
    wide: !!o.wide
  };
  modalConfirmCb = o.onConfirm || null;
  render();
}

function modalHTML() {
  if (!S.modal) return '';
  const m = S.modal;
  return '<div class="modal-overlay" data-action="overlay-close">' +
    '<div class="modal ' + (m.wide ? 'wide' : '') + '" role="dialog" aria-modal="true">' +
      '<div class="modal-head">' +
        '<h2 class="modal-title">' + m.title + '</h2>' +
        '<button class="btn-icon" data-action="close-modal" aria-label="Close">' + ic('x', 17) + '</button>' +
      '</div>' +
      '<div class="modal-body">' + (m.body || '') + '</div>' +
      (m.foot ? '<div class="modal-foot">' + m.foot + '</div>' : '') +
    '</div></div>';
}

/* ── Grading helpers (authoritative grading happens server-side) ── */

function gradeQuestion(q, value) {
  if (value === undefined || value === null || value === '') return null;
  if (q.type === 'mcq') {
    // q.correct is the shown-space index when options were permuted
    return q.correct !== undefined ? value === q.correct : value === q.answer;
  }
  if (q.type === 'multi') {
    const want = (q.correct || q.answer || []).slice().sort((a, b) => a - b);
    const got = Array.isArray(value) ? value.slice().sort((a, b) => a - b) : null;
    if (!got) return null;
    return want.length === got.length && want.every((v, i) => v === got[i]);
  }
  if (q.type === 'matching') {
    if (!Array.isArray(value) || !q.correctPairs) return null;
    const answered = value.every(v => v !== undefined && v !== null && v !== -1 && v !== '');
    if (!answered) return null;
    // correct: each chosen option value equals the pair's right value
    return value.every((optIdx, i) => q.options[optIdx] === q.correctPairs[i].split(' → ')[1]);
  }
  if (q.type === 'ordering') {
    if (!Array.isArray(value) || value.length === 0 || !q.correctOrder) return null;
    if (value.length !== q.correctOrder.length) return false;
    return value.every((v, i) => v === q.correctOrder[i]);
  }
  if (q.type === 'code') {
    if (!value || !String(value).trim()) return null;
    if (q.passed != null) return q.passed === q.total;
    return true;
  }
  return (q.answer || []).some(a => norm(a) === norm(value));
}

function countAnsweredIn(att) {
  const answers = att.answers || {};
  return (att.order || []).filter(id => {
    const v = answers[id];
    if (v === undefined || v === null || v === '') return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  }).length;
}

/* ── Small render helpers ──────────────────────────────────── */

function statCard(icon, label, value, sub) {
  return '<div class="stat-card">' +
    '<span class="stat-icon">' + ic(icon, 22) + '</span>' +
    '<div class="stat-body">' +
      '<p class="stat-label">' + label + '</p>' +
      '<div class="stat-value-row">' +
        '<p class="stat-value">' + value + '</p>' +
        (sub ? '<span class="stat-trend">' + ic('trend', 14) + sub + '</span>' : '') +
      '</div>' +
    '</div>' +
  '</div>';
}

function emptyState(icon, title, sub, action, label, dataValue) {
  return '<div class="card empty">' +
    '<div class="empty-icon">' + ic(icon, 24) + '</div>' +
    '<div class="empty-title">' + title + '</div>' +
    '<div class="empty-sub">' + sub + '</div>' +
    (action ? '<div style="margin-top:16px"><button class="btn btn-primary" data-action="' + action + '"' +
      (dataValue ? ' data-value="' + dataValue + '"' : '') + '>' + label + '</button></div>' : '') +
  '</div>';
}

function diffSplitHTML(pool) {
  const b = pool.filter(q => q.diff === 'beginner').length;
  const i = pool.filter(q => q.diff === 'intermediate').length;
  const a = pool.filter(q => q.diff === 'advanced').length;
  return '<span class="diff-split"><i class="d-b"></i><i class="d-i"></i><i class="d-a"></i></span>' +
    '<span class="num">' + b + ' · ' + i + ' · ' + a + '</span>';
}

function breakdownHTML(byCat) {
  const cats = Object.keys(byCat || {});
  if (!cats.length) return '<p style="color:var(--text-3);font-size:13.5px">No data.</p>';
  return cats.map(cid => {
    const b = byCat[cid];
    const pct = b.t ? Math.round((b.c / b.t) * 100) : 0;
    const cls = pct >= 70 ? '' : pct >= 40 ? 'mid' : 'low';
    return '<div class="breakdown-row">' +
      '<span class="breakdown-name">' + ic(catOf(cid).icon, 15) + ' ' + esc(catOf(cid).name) + '</span>' +
      '<span class="breakdown-bar"><span class="breakdown-fill ' + cls + '" style="width:' + pct + '%"></span></span>' +
      '<span class="breakdown-val">' + b.c + '/' + b.t + '</span>' +
    '</div>';
  }).join('');
}

function questionTextHTML(q) {
  let out = '<div class="q-text">' + esc(q.q) + '</div>';
  if (q.code) out += '<pre class="q-code">' + esc(q.code) + '</pre>';
  return out;
}

function reviewHTML(rec) {
  if (!rec || !Array.isArray(rec.order)) return '';
  const results = rec.results || {};
  return rec.order.map((qid, qi) => {
    const q = qOf(qid);
    if (!q) return '';
    const v = rec.answers ? rec.answers[qid] : undefined;
    const res = results[qid] || {};
    const correct = q.type === 'code' ? res.correct : gradeQuestion(q, v);
    return '<div class="review-item" data-ri="' + qi + '">' +
      '<button class="review-summary" data-action="toggle-review" data-idx="' + qi + '">' +
        '<span class="review-status ' + (correct ? 'ok' : 'no') + '">' + ic(correct ? 'check' : 'x', 13) + '</span>' +
        '<span style="flex:1;min-width:0">' +
          '<span class="review-q">' + esc(q.q) + '</span>' +
          '<span class="review-meta">' +
            '<span class="badge b-' + q.diff + '"><span class="dot"></span>' + diffOf(q.diff).name + '</span>' +
            '<span class="badge b-mcq">' + esc(catOf(q.cat).name) + '</span>' +
            '<span class="badge b-mcq">' + { mcq: 'Multiple choice', multi: 'Multi-select', fill: 'Fill in the blank', matching: 'Matching', ordering: 'Ordering', code: 'Coding challenge' }[q.type] || q.type + '</span>' +
          '</span>' +
        '</span>' +
        '<span class="review-chev">' + ic('chevronD', 16) + '</span>' +
      '</button>' +
      '<div class="review-body">' + reviewBodyHTML(q, v, res) + '</div>' +
    '</div>';
  }).join('');
}

function reviewBodyHTML(q, v, res) {
  let content = '';
  if (q.type === 'mcq') {
    content = '<div class="opts" style="margin-bottom:12px">' + q.options.map((o, i) => {
      const isC = q.correct !== undefined ? i === q.correct : i === q.answer;
      const isU = v === i;
      const cls = isC ? 'correct' : isU ? 'wrong' : '';
      const markColor = isC ? 'var(--green-text)' : isU ? 'var(--red-text)' : '';
      const mark = isC || isU ? '<span style="margin-left:auto;display:grid;place-items:center;color:' + markColor + '">' + ic(isC ? 'check' : 'x', 14) + '</span>' : '';
      return '<div class="opt ' + cls + '" style="cursor:default"><span class="opt-key">' + LETTERS[i] + '</span><span>' + esc(o) + '</span>' + mark + '</div>';
    }).join('') + '</div>';
    const shownCorrect = q.correct !== undefined ? q.correct : q.answer;
    content += '<div class="review-line"><span class="lbl">Your answer</span><span class="val ' + (v !== undefined && v !== '' ? (gradeQuestion(q, v) ? 'val-correct' : 'val-wrong') : '') + '">' +
      (v !== undefined && v !== '' ? esc(q.options[v]) : '— (unanswered)') + '</span></div>';
    content += '<div class="review-line"><span class="lbl">Correct</span><span class="val val-correct">' + esc(q.options[shownCorrect]) + '</span></div>';
  } else if (q.type === 'multi') {
    const sel = Array.isArray(v) ? v : [];
    const correctSet = (q.correct !== undefined ? q.correct : q.answer || []).slice().sort((a, b) => a - b);
    const gotSet = sel.slice().sort((a, b) => a - b);
    const right = correctSet.length === gotSet.length && correctSet.every((x, i) => x === gotSet[i]);
    content = '<div class="opts" style="margin-bottom:12px">' + q.options.map((o, i) => {
      const isC = correctSet.includes(i);
      const isU = sel.includes(i);
      const cls = isC ? 'correct' : isU ? 'wrong' : '';
      const markColor = isC ? 'var(--green-text)' : isU ? 'var(--red-text)' : '';
      const mark = isC || isU ? '<span style="margin-left:auto;display:grid;place-items:center;color:' + markColor + '">' + ic(isC ? 'check' : 'x', 14) + '</span>' : '';
      return '<div class="opt ' + cls + '" style="cursor:default"><span class="opt-key">' + LETTERS[i] + '</span><span>' + esc(o) + '</span>' + mark + '</div>';
    }).join('') + '</div>';
    content += '<div class="review-line"><span class="lbl">Your answer</span><span class="val ' + (sel.length ? (right ? 'val-correct' : 'val-wrong') : '') + '">' +
      (sel.length ? esc(sel.map(i => q.options[i]).join(' · ')) : '— (unanswered)') + '</span></div>';
    content += '<div class="review-line"><span class="lbl">Correct</span><span class="val val-correct">' + esc(correctSet.map(i => q.options[i]).join(' · ')) + '</span></div>';
  } else if (q.type === 'matching') {
    const sel = Array.isArray(v) ? v : [];
    const rows = (q.pairsLeft || []).map((left, i) => {
      const chosen = sel[i] !== undefined && sel[i] !== -1 && sel[i] !== '' && q.options[sel[i]];
      const correct = q.correctPairs && chosen === q.correctPairs[i].split(' → ')[1];
      return '<div class="review-line"><span class="lbl">' + esc(left) + '</span><span class="val ' + (chosen ? (correct ? 'val-correct' : 'val-wrong') : '') + '">' +
        (chosen ? esc(chosen) : '— (unmatched)') + ' ' + (correct === false ? '→ <span class="val-correct">' + esc(q.correctPairs[i].split(' → ')[1]) + '</span>' : '') + '</span></div>';
    }).join('');
    content = rows + '<div class="review-line" style="margin-top:8px"><span class="lbl">Score</span><span class="val ' + (gradeQuestion(q, v) === true ? 'val-correct' : gradeQuestion(q, v) === false ? 'val-wrong' : '') + '">' +
      (gradeQuestion(q, v) === null ? 'Not completed' : gradeQuestion(q, v) ? 'All matched correctly' : 'Incorrect') + '</span></div>';
  } else if (q.type === 'ordering') {
    const sel = Array.isArray(v) ? v : [];
    const items = q.items || [];
    const correctOrder = q.correctOrder || [];
    const row = (idx) => {
      const isCorrectPos = idx < correctOrder.length && correctOrder[idx] === sel[idx];
      return '<div class="review-line"><span class="lbl">#' + (idx + 1) + '</span><span class="val ' + (isCorrectPos ? 'val-correct' : 'val-wrong') + '">' +
        esc(items[sel[idx]] !== undefined ? items[sel[idx]] : '—') + '</span></div>';
    };
    content = sel.map((_, i) => row(i)).join('') +
      '<div class="review-line" style="margin-top:8px"><span class="lbl">Correct</span><span class="val val-correct">' + esc(correctOrder.map(i => items[i]).join(' → ')) + '</span></div>';
  } else if (q.type === 'code') {
    const passed = res.passed, total = res.total;
    content =
      '<div class="review-line"><span class="lbl">Status</span><span class="val ' + (res.correct === true ? 'val-correct' : res.correct === false ? 'val-wrong' : '') + '">' +
        (res.correct == null ? 'Not submitted' : (res.correct ? 'Passed all tests' : 'Tests failed')) +
        (passed != null && total != null ? ' — ' + passed + '/' + total + ' tests passed' : '') + '</span></div>' +
      '<div class="review-line"><span class="lbl">Language</span><span class="val">' + esc(q.codeLang || 'javascript') + '</span></div>' +
      '<pre class="q-code" style="margin-top:8px;white-space:pre-wrap">' + esc(v || '// no code submitted') + '</pre>' +
      (res.detail && res.detail !== 'All tests passed' && res.correct === false ? '<div class="review-explain">' + ic('info', 14) + ' <span style="vertical-align:1px">' + esc(res.detail) + '</span></div>' : '');
  } else {
    content =
      '<div class="review-line"><span class="lbl">Your answer</span><span class="val ' + (v ? 'val-correct' : 'val-wrong') + '">' +
        (v ? esc(v) : '— (unanswered)') + '</span></div>' +
      '<div class="review-line"><span class="lbl">Correct</span><span class="val val-correct">' + esc((q.answer || [''])[0]) + '</span></div>';
  }
  if (q.code) content += '<pre class="q-code" style="margin-top:12px">' + esc(q.code) + '</pre>';
  content += '<div class="review-explain">' + ic('info', 14) + ' <span style="vertical-align:1px">' + esc(q.explain) + '</span></div>';
  return content;
}
