/* ============================================================
   Orion — console (admin): login, dashboard, tests, editor,
   questions, results, admins — all API-driven
   ============================================================ */

/* ── Login ─────────────────────────────────────────────────── */

function vLogin() {
  return '<div class="auth-screen">' +
    '<div class="auth-card card">' +
      '<div class="auth-brand"><img class="auth-logo brand-logo-img" src="' + brandLogoImgSrc() + '" alt="Seeker" width="132" height="41"></div>' +
      '<h1 class="auth-title">Admin console</h1>' +
      '<p class="auth-sub">Sign in to manage tests, questions, and results.</p>' +
      '<form id="loginForm" data-form="login" novalidate>' +
        '<div class="auth-field">' +
          '<label class="field-label" for="loginUser">Username</label>' +
          '<div class="auth-input">' + ic('user', 15) +
            '<input class="input" id="loginUser" autocomplete="username" placeholder="admin" required>' +
          '</div>' +
        '</div>' +
        '<div class="auth-field">' +
          '<label class="field-label" for="loginPass">Password</label>' +
          '<div class="auth-input">' + ic('key', 15) +
            '<input class="input" id="loginPass" type="password" autocomplete="current-password" placeholder="••••••••" required>' +
          '</div>' +
        '</div>' +
        '<button class="btn btn-primary btn-lg" style="width:100%" type="submit">' + ic('arrowL', 15, 'rot-180') + ' Sign in</button>' +
      '</form>' +
      '<div id="bootstrapSlot" class="auth-bootstrap"></div>' +
      '<div class="auth-divider"></div>' +
      '<button class="btn btn-secondary" style="width:100%" data-action="go-candidate">' + ic('doc', 15) + ' Take a test as a candidate</button>' +
    '</div>' +
  '</div>';
}

async function checkBootstrap() {
  const slot = $('#bootstrapSlot');
  if (!slot) return;
  try {
    const r = await API.get('/api/auth/bootstrap');
    if (r.needsBootstrap) {
      slot.innerHTML = '<div class="auth-divider"></div>' +
        '<p class="auth-sub" style="margin:0 0 10px">No admin account exists. Create the first one.</p>' +
        '<button class="btn btn-secondary" style="width:100%" data-action="show-register">' + ic('plus', 14) + ' Create admin account</button>';
    }
  } catch (e) { /* server unreachable — message shown by login submit */ }
}

function vRegister() {
  return '<div class="auth-screen">' +
    '<div class="auth-card card">' +
      '<div class="auth-brand"><img class="auth-logo brand-logo-img" src="' + brandLogoImgSrc() + '" alt="Seeker" width="132" height="41"></div>' +
      '<h1 class="auth-title">Create the first admin</h1>' +
      '<p class="auth-sub">This account becomes the superadmin. It has full control.</p>' +
      '<form id="registerForm" data-form="register" novalidate>' +
        '<div class="auth-field">' +
          '<label class="field-label" for="regUser">Username</label>' +
          '<div class="auth-input">' + ic('user', 15) + '<input class="input" id="regUser" autocomplete="username" placeholder="e.g., admin" required></div>' +
        '</div>' +
        '<div class="auth-field">' +
          '<label class="field-label" for="regEmail">Email <span class="field-help">Optional</span></label>' +
          '<div class="auth-input">' + ic('info', 15) + '<input class="input" id="regEmail" type="email" autocomplete="email" placeholder="admin@company.com"></div>' +
        '</div>' +
        '<div class="auth-field">' +
          '<label class="field-label" for="regPass">Password</label>' +
          '<div class="auth-input">' + ic('key', 15) + '<input class="input" id="regPass" type="password" autocomplete="new-password" placeholder="Min. 6 characters" required></div>' +
        '</div>' +
        '<button class="btn btn-primary btn-lg" style="width:100%" type="submit">' + ic('check', 15) + ' Create account</button>' +
      '</form>' +
      '<div class="auth-divider"></div>' +
      '<button class="btn btn-ghost" style="width:100%" data-action="back-to-login">' + ic('arrowL', 14) + ' Back to sign in</button>' +
    '</div>' +
  '</div>';
}

async function doLogin(e) {
  e.preventDefault();
  const u = $('#loginUser'), p = $('#loginPass');
  const btn = $('button[type="submit"]', e.target);
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
  try {
    const r = await API.post('/api/auth/login', { username: u.value, password: p.value });
    API.setToken(r.token);
    S.auth = r.admin;
    S.view = 'app';
    await loadAdminData();
    toast('Welcome back, ' + (S.auth.displayName || S.auth.username), 'success');
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
  render();
}

async function doRegister(e) {
  e.preventDefault();
  const u = $('#regUser'), em = $('#regEmail'), p = $('#regPass');
  const btn = $('button[type="submit"]', e.target);
  if (btn) btn.disabled = true;
  try {
    const r = await API.post('/api/auth/register', { username: u.value, email: em.value, password: p.value });
    API.setToken(r.token);
    S.auth = r.admin;
    S.view = 'app';
    await loadAdminData();
    toast('Admin account created — welcome!', 'success');
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
  render();
}

async function logout() {
  try { await API.post('/api/auth/logout'); } catch (e) {}
  API.setToken(null);
  S.auth = null;
  S.view = 'login';
  render();
}

/* ── Change password ───────────────────────────────────────── */

function openPasswordModal() {
  S.modal = {
    title: 'Change password',
    body:
      '<div class="field"><label class="field-label">Current password</label>' +
        '<input class="input" id="pwCurrent" type="password" autocomplete="current-password"></div>' +
      '<div class="field" style="margin-bottom:4px"><label class="field-label">New password</label>' +
        '<input class="input" id="pwNext" type="password" autocomplete="new-password" placeholder="Min. 6 characters"></div>',
    foot: '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" data-action="save-password">' + ic('check', 14) + ' Update password</button>'
  };
  render();
}

async function savePassword() {
  const cur = $('#pwCurrent'), nxt = $('#pwNext');
  if (!cur || !nxt) return;
  try {
    await API.post('/api/admin/password', { current: cur.value, next: nxt.value });
    closeModal();
    toast('Password updated', 'success');
  } catch (e) { toast(e.message, 'error'); }
}

/* ── Shell ─────────────────────────────────────────────────── */

function consoleShell() {
  if (!S.auth) return '<div class="auth-page">' + themeFabHTML() + (S.view === 'register' ? vRegister() : vLogin()) + modalHTML() + '</div>';
  const nav = [
    ['dashboard', 'Dashboard', 'dashboard'],
    ['tests', 'Tests', 'layers'],
    ['questions', 'Questions', 'question'],
    ['results', 'Results', 'chart'],
    ['activity', 'Activity', 'clock'],
    ['candidates', 'Candidates', 'users'],
    ['signups', 'Signups', 'inbox']
  ];
  if (S.auth.role === 'superadmin') nav.push(['orgs', 'Organizations', 'building']);
  if (S.auth.role === 'superadmin') nav.push(['admins', 'Admins', 'users']);
  return sidebarHTML(nav, 'console') +
    '<div class="app-main">' +
      '<header class="topbar">' + headerHTML('console') + '</header>' +
      '<main class="content"><div class="container">' + consoleView() + '</div></main>' +
    '</div>' +
    modalHTML();
}

function consoleView() {
  if (S.tab === 'orgs' && !(S.auth && S.auth.role === 'superadmin')) {
    S.tab = 'dashboard';
  }
  if (S.tab === 'admins' && !(S.auth && S.auth.role === 'superadmin')) {
    S.tab = 'dashboard';   // non-superadmins never see the admins view
  }
  if (S.tab === 'editor') return vEditor();
  if (S.tab === 'tests') return vTests();
  if (S.tab === 'questions') return vQuestions();
  if (S.tab === 'results') return vResults();
  if (S.tab === 'activity') return vActivity();
  if (S.tab === 'candidates') return vCandidates();
  if (S.tab === 'signups') return vSignups();
  if (S.tab === 'orgs') return vOrganizations();
  if (S.tab === 'admins') return vAdmins();
  return vDashboard();
}

/* ── Dashboard ─────────────────────────────────────────────── */

function vDashboard() {
  const st = S.stats;
  const total = st ? st.questions : S.questions.length;
  const tests = st ? st.tests : S.tests.length;
  const attempts = st ? st.attempts : S.attempts.length;
  const published = st ? st.published : S.tests.filter(t => t.published).length;
  const avg = st ? st.avgPct : 0;
  const active = st ? st.active : 0;

  return '<div class="page-head">' +
    '<div><h1 class="page-title">Good day, ' + esc((S.auth && (S.auth.displayName || S.auth.username)) || 'Admin') + '</h1>' +
    '<p class="page-desc">See the current status of your assessment program.</p></div>' +
    '<div class="page-actions">' +
      '<button class="btn btn-secondary" data-action="tab" data-value="questions">' + ic('question', 15) + ' Question bank</button>' +
      '<button class="btn btn-primary" data-action="new-test">' + ic('plus', 15) + ' New test</button>' +
    '</div></div>' +

    '<div class="stat-grid">' +
      statCard('question', 'Questions', total, 'seeded in MongoDB') +
      statCard('layers', 'Tests', tests, published + ' published') +
      statCard('users', 'Attempts', attempts, st ? st.avgPct + '% average · ' + st.passRate + '% pass' : '') +
      statCard('clock', 'In progress', active, 'active sessions') +
    '</div>' +

    '<div style="height:16px"></div>' +
    '<div class="card card-pad">' +
      '<div class="section-label">Question coverage</div>' +
      (st && st.coverage ? st.coverage.map(c => {
        const t = c.total;
        const pct = total ? Math.round((t / total) * 100) : 0;
        return '<div class="coverage-row">' +
          '<span class="coverage-icon">' + catIconHTML(catOf(c.cat), 16) + '</span>' +
          '<div style="min-width:190px"><div class="coverage-name">' + esc(catOf(c.cat).name) + '</div>' +
          '<div class="coverage-sub">' + c.beginner + ' beginner · ' + c.intermediate + ' intermediate · ' + c.advanced + ' advanced</div></div>' +
          '<span class="coverage-bar"><span class="coverage-fill" style="width:' + pct + '%"></span></span>' +
          '<span class="coverage-total">' + t + '</span>' +
        '</div>';
      }).join('') : '<p style="color:var(--text-3);font-size:13.5px">Loading…</p>') +
    '</div>' +

    ((st && st.recent && st.recent.length) ? '<div style="height:16px"></div>' +
      '<div class="card card-pad">' +
        '<div class="section-label">Recent attempts</div>' +
        st.recent.map(x =>
          '<div class="coverage-row" style="cursor:pointer" data-action="view-attempt" data-id="' + x._id + '">' +
            '<span class="coverage-icon">' + ic('users', 15) + '</span>' +
            '<div style="flex:1;min-width:0"><div class="coverage-name">' + esc(x.candidate) + ' <span style="color:var(--text-3);font-weight:500">· ' + esc(x.testName) + '</span></div>' +
            '<div class="coverage-sub">' + fmtDate(x.startedAt) + ' · ' + (x.status === 'submitted' ? 'submitted' : 'in progress') + '</div></div>' +
            (x.status === 'submitted'
              ? '<span class="badge ' + (x.passed ? 'b-pass' : 'b-fail') + '">' + x.pct + '%</span>'
              : '<span class="badge b-draft">In progress</span>') +
            '<span style="color:var(--text-3)">' + ic('chevronR', 15) + '</span>' +
          '</div>').join('') +
      '</div>' : '');
}

/* ── Pagination helpers ────────────────────────────────────── */

const PAGE_SIZE = 12;
const _pg = {};

function pgPage(key, len) {
  const pages = Math.max(1, Math.ceil(len / PAGE_SIZE));
  let p = _pg[key] || 0;
  if (p >= pages) p = pages - 1;
  _pg[key] = p;
  return p;
}

function pgSlice(key, arr) {
  const p = pgPage(key, arr.length);
  return arr.slice(p * PAGE_SIZE, (p + 1) * PAGE_SIZE);
}

function pagerHTML(key, len) {
  const pages = Math.max(1, Math.ceil(len / PAGE_SIZE));
  const p = pgPage(key, len);
  if (pages <= 1) return '';
  const items = [];
  for (let i = 0; i < pages; i++) {
    const near = Math.abs(i - p) <= 1;
    const edge = i === 0 || i === pages - 1;
    if (!near && !edge) {
      if (items[items.length - 1] !== '…') items.push('…');
    } else {
      items.push(i);
    }
  }
  return '<div class="pager">' +
    '<div class="pager-info">' + len + ' item' + (len === 1 ? '' : 's') + ' \u00b7 ' + PAGE_SIZE + ' per page</div>' +
    '<div class="pager-btns">' +
      '<button class="pager-btn" data-action="pg" data-key="' + key + '" data-pg="' + (p - 1) + '" ' + (p === 0 ? 'disabled' : '') + '>' + ic('arrowL', 14) + '</button>' +
      items.map(b => b === '…'
        ? '<span class="pager-dots">\u2026</span>'
        : '<button class="pager-btn ' + (b === p ? 'active' : '') + '" data-action="pg" data-key="' + key + '" data-pg="' + b + '">' + (b + 1) + '</button>').join('') +
      '<button class="pager-btn" data-action="pg" data-key="' + key + '" data-pg="' + (p + 1) + '" ' + (p >= pages - 1 ? 'disabled' : '') + '>' + ic('chevronR', 14) + '</button>' +
    '</div>' +
  '</div>';
}

/* ── Tests list ────────────────────────────────────────────── */

function vTests() {
  const f = S.qFilters.search;
  const list = f ? S.tests.filter(t => searchMatches(f, t.name, t.description)) : S.tests;
  return '<div class="page-head">' +
    '<div><h1 class="page-title">Tests</h1>' +
    '<p class="page-desc">Build timed assessments from your question bank. Publish them to the candidate portal.</p></div>' +
    '<div class="page-actions"><button class="btn btn-primary" data-action="new-test">' + ic('plus', 15) + ' New test</button></div>' +
  '</div>' +
  (list.length ? '<div class="card">' + pgSlice('tests', list).map(testRowHTML).join('') + '</div>' + pagerHTML('tests', list.length)
    : emptyState(f ? 'search' : 'doc', f ? 'No matching tests' : 'No tests yet', f ? 'No tests match your search.' : 'Create your first assessment to begin screening candidates.', 'new-test', 'Create a test'));
}

function testRowHTML(t) {
  const cats = (t.categories || []).map(catOf);
  return '<div class="row-item">' +
    '<div class="row-main">' +
      '<div class="row-title">' + esc(t.name) +
        '<span class="badge ' + (t.published ? 'b-published' : 'b-draft') + '"><span class="dot"></span>' + (t.published ? 'Published' : 'Draft') + '</span>' +
      '</div>' +
      '<div class="row-meta">' +
        '<span>' + ic('clock', 13) + ' ' + t.durationMin + ' min</span><span class="meta-sep">·</span>' +
        '<span>' + t.count + ' questions</span><span class="meta-sep">·</span>' +
        '<span>' + t.passPct + '% to pass</span><span class="meta-sep">·</span>' +
        '<span>' + diffFocusLabel(t.diffFocus) + '</span>' +
      '</div>' +
      '<div class="row-meta" style="margin-top:7px">' +
        cats.map(c => '<span class="badge b-mcq">' + catIconHTML(c, 11) + ' ' + esc(c.name) + '</span>').join('') +
      '</div>' +
    '</div>' +
    '<div class="row-actions">' +
      '<label class="switch" title="Publish / unpublish"><input type="checkbox" data-action="toggle-publish" data-id="' + t.id + '" ' + (t.published ? 'checked' : '') + '><span class="track"></span><span class="thumb"></span></label>' +
      '<button class="btn-icon" data-action="preview-test" data-id="' + t.id + '" title="Preview">' + ic('eye', 17) + '</button>' +
      '<button class="btn-icon" data-action="edit-test" data-id="' + t.id + '" title="Edit">' + ic('pencil', 16) + '</button>' +
      '<button class="btn-icon" data-action="duplicate-test" data-id="' + t.id + '" title="Duplicate">' + ic('copy', 16) + '</button>' +
      '<button class="btn-icon danger" data-action="delete-test" data-id="' + t.id + '" title="Delete">' + ic('trash', 16) + '</button>' +
    '</div>' +
  '</div>';
}

function diffFocusLabel(d) {
  return DIFF_FOCUS_LABEL[d || 'balanced'] || 'Balanced';
}

/* ── Test editor ───────────────────────────────────────────── */

function startTestEditor(id) {
  const src = id ? S.tests.find(t => t.id === id) : null;
  tDraft = {
    id: src ? src.id : null,
    name: src ? src.name : '',
    desc: src ? (src.description || '') : '',
    duration: src ? src.durationMin : 30,
    pass: src ? src.passPct : 70,
    cats: new Set(src ? (src.categories || []) : CATS.map(c => c.id)),
    types: new Set(src && Array.isArray(src.types) ? src.types : []),
    tags: new Set(src && Array.isArray(src.tags) ? src.tags : []),
    diffFocus: src ? (src.diffFocus || 'balanced') : 'balanced',
    count: src ? src.count : 20,
    shuffle: src ? src.shuffle !== false : true,
    autoSubmit: src ? src.autoSubmit !== false : true,
    showAnswers: src ? src.showAnswers !== false : true
  };
  S.tab = 'editor';
  render();
  toast(src ? 'Editing \u201C' + src.name + '\u201D' : 'New test', '');
}

function eligibleQuestions() {
  if (!tDraft || !tDraft.cats.size) return [];
  return S.questions.filter(q =>
    tDraft.cats.has(q.cat) &&
    (DIFF_WEIGHTS[tDraft.diffFocus] || {})[q.diff] &&
    (!tDraft.types.size || tDraft.types.has(q.type))
  );
}

function validDraft() {
  return tDraft && tDraft.name.trim() && tDraft.cats.size > 0 && tDraft.count >= 1;
}

function clampCount() {
  const max = Math.max(1, eligibleQuestions().length);
  if (tDraft.count > max) tDraft.count = max;
}

function vEditor() {
  const d = tDraft;
  const pool = eligibleQuestions();
  return '<div class="page-head">' +
    '<div><h1 class="page-title">' + (d.id ? 'Edit test' : 'New test') + '</h1>' +
    '<p class="page-desc">' + (d.id ? 'Adjust the assessment configuration below.' : 'Configure a timed assessment drawn from your question bank.') + '</p></div>' +
    '<div class="page-actions"><button class="btn btn-ghost" data-action="editor-cancel">' + ic('arrowL', 15) + ' Back to tests</button></div>' +
  '</div>' +

  '<div class="card card-pad">' +
    '<div class="section-label">Details</div>' +
    '<div class="field">' +
      '<label class="field-label" for="tName">Test name</label>' +
      '<input class="input" id="tName" data-draft="name" value="' + esc(d.name) + '" placeholder="e.g., Senior Frontend Screening — Round 1" maxlength="80">' +
    '</div>' +
    '<div class="field" style="margin-bottom:4px">' +
      '<label class="field-label" for="tDesc">Description <span class="field-help">Shown to candidates on the test card</span></label>' +
      '<textarea class="input" id="tDesc" data-draft="desc" placeholder="What is this assessment measuring?">' + esc(d.desc) + '</textarea>' +
    '</div>' +
  '</div>' +

  '<div class="card card-pad">' +
    '<div class="section-label">Timing &amp; scoring</div>' +
    '<div class="setting-row">' +
      '<div><div class="setting-label">Duration</div><div class="setting-sub">Time limit for the whole test</div></div>' +
      '<div class="stepper"><button data-action="step" data-field="duration" data-dir="-1" ' + (d.duration <= 1 ? 'disabled' : '') + '>' + ic('minus', 15) + '</button>' +
      '<span class="stepper-val">' + d.duration + ' min</span>' +
      '<button data-action="step" data-field="duration" data-dir="1">' + ic('plus', 15) + '</button></div>' +
    '</div>' +
    '<div class="setting-row">' +
      '<div><div class="setting-label">Pass mark</div><div class="setting-sub">Minimum score (%) required to pass</div></div>' +
      '<div class="stepper"><button data-action="step" data-field="pass" data-dir="-1" ' + (d.pass <= 0 ? 'disabled' : '') + '>' + ic('minus', 15) + '</button>' +
      '<span class="stepper-val">' + d.pass + '%</span>' +
      '<button data-action="step" data-field="pass" data-dir="1" ' + (d.pass >= 100 ? 'disabled' : '') + '>' + ic('plus', 15) + '</button></div>' +
    '</div>' +
    '<div class="setting-row">' +
      '<div><div class="setting-label">Auto-submit</div><div class="setting-sub">Submit automatically when the timer reaches zero</div></div>' +
      '<label class="switch"><input type="checkbox" data-draft="autoSubmit" ' + (d.autoSubmit ? 'checked' : '') + '><span class="track"></span><span class="thumb"></span></label>' +
    '</div>' +
    '<div class="setting-row" style="border-bottom:none">' +
      '<div><div class="setting-label">Reveal answers</div><div class="setting-sub">Show correct answers and explanations after submission</div></div>' +
      '<label class="switch"><input type="checkbox" data-draft="showAnswers" ' + (d.showAnswers ? 'checked' : '') + '><span class="track"></span><span class="thumb"></span></label>' +
    '</div>' +
  '</div>' +

  '<div class="card card-pad">' +
    '<div class="section-label">Content</div>' +
    '<div class="field">' +
      '<div class="field-label">Categories <span class="field-help">' + d.cats.size + ' selected</span></div>' +
      '<div class="chip-row">' +
        CATS.map(c => {
          const n = S.questions.filter(q => q.cat === c.id).length;
          const on = d.cats.has(c.id);
          return '<button class="chip ' + (on ? 'active' : '') + '" data-action="toggle-cat" data-value="' + c.id + '" aria-pressed="' + on + '">' +
            catIconHTML(c, 14) + ' ' + esc(c.name) + '<span class="chip-count">' + n + '</span>' + ic('check', 12) + '</button>';
        }).join('') +
      '</div>' +
    '</div>' +
    '<div class="field">' +
      '<div class="field-label">Difficulty focus</div>' +
      '<div class="seg" id="diffSeg">' +
        [['beginner', 'Beginner'], ['balanced', 'Balanced'], ['advanced', 'Advanced']].map(o =>
          '<button class="seg-item ' + (d.diffFocus === o[0] ? 'active' : '') + '" data-action="set-diff" data-value="' + o[0] + '">' + o[1] + '</button>').join('') +
        '<span class="seg-thumb" id="diffThumb"></span>' +
      '</div>' +
      '<div class="field-hint">' + diffFocusLabel(d.diffFocus) + '</div>' +
    '</div>' +
    '<div class="field">' +
      '<div class="field-label">Question types <span class="field-help">' + (d.types.size ? d.types.size + ' selected' : 'All types') + '</span></div>' +
      '<div class="chip-row">' +
        [['mcq', 'Multiple choice'], ['multi', 'Multi-select'], ['fill', 'Fill in the blank'], ['matching', 'Matching'], ['ordering', 'Ordering'], ['code', 'Coding']].map(t =>
          '<button class="chip ' + (d.types.has(t[0]) ? 'active' : '') + '" data-action="toggle-type" data-value="' + t[0] + '" aria-pressed="' + d.types.has(t[0]) + '">' +
            t[1] + ic('check', 12) + '</button>').join('') +
      '</div>' +
      '<div class="field-hint">' + (d.types.size ? 'Only the selected question types are drawn.' : 'Every question type may be drawn (default).') + '</div>' +
    '</div>' +
    '<div class="setting-row">' +
      '<div><div class="setting-label">Number of questions</div><div class="setting-sub">Drawn at random from the matching pool</div></div>' +
      '<div class="stepper"><button data-action="step" data-field="count" data-dir="-1" ' + (d.count <= 1 ? 'disabled' : '') + '>' + ic('minus', 15) + '</button>' +
      '<span class="stepper-val">' + d.count + '</span>' +
      '<button data-action="step" data-field="count" data-dir="1" ' + (d.count >= pool.length ? 'disabled' : '') + '>' + ic('plus', 15) + '</button></div>' +
    '</div>' +
    '<div class="setting-row">' +
      '<div><div class="setting-label">Shuffle questions</div><div class="setting-sub">Randomize question order for every attempt</div></div>' +
      '<label class="switch"><input type="checkbox" data-draft="shuffle" ' + (d.shuffle !== false ? 'checked' : '') + '><span class="track"></span><span class="thumb"></span></label>' +
    '</div>' +
    '<div class="setting-row" style="border-bottom:none">' +
      '<div><div class="setting-label">Pool availability</div>' +
      '<div class="setting-sub">' + pool.length + ' question' + (pool.length === 1 ? '' : 's') + ' match your selection' + (pool.length === 0 ? ' — choose at least one category' : '') + '</div></div>' +
      '<div class="row-meta">' + diffSplitHTML(pool) + '</div>' +
    '</div>' +
  '</div>' +

  '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px">' +
    '<button class="btn btn-secondary" data-action="editor-cancel">Cancel</button>' +
    '<button class="btn btn-secondary" data-action="save-test" data-mode="draft" ' + (validDraft() ? '' : 'disabled') + '>Save draft</button>' +
    '<button class="btn btn-primary" data-action="save-test" data-mode="publish" ' + (validDraft() ? '' : 'disabled') + '>' + ic('check', 14) + ' Save &amp; publish</button>' +
  '</div>';
}

async function saveTest(mode) {
  const d = tDraft;
  if (!validDraft()) { toast('Fill in the test name and choose at least one category', 'error'); return; }
  clampCount();
  const payload = {
    id: d.id,
    name: d.name.trim(),
    description: d.desc.trim(),
    durationMin: Math.max(1, d.duration),
    passPct: Math.min(100, Math.max(0, d.pass)),
    categories: Array.from(d.cats),
    types: Array.from(d.types),
    tags: Array.from(d.tags),
    diffFocus: d.diffFocus,
    count: d.count,
    shuffle: d.shuffle !== false,
    autoSubmit: d.autoSubmit !== false,
    showAnswers: d.showAnswers !== false,
    published: mode === 'publish'
  };
  try {
    const saved = d.id ? await API.put('/api/admin/tests/' + d.id, payload) : await API.post('/api/admin/tests', payload);
    S.tab = 'tests';
    tDraft = null;
    await loadAdminData();
    toast(mode === 'publish' ? '\u201C' + saved.name + '\u201D published' : 'Draft saved', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
  render();
}

/* ── Questions bank ────────────────────────────────────────── */

function vQuestions() {
  const f = S.qFilters;
  const list = S.questions.filter(q => {
    if (f.cat !== 'all' && q.cat !== f.cat) return false;
    if (f.diff !== 'all' && q.diff !== f.diff) return false;
    if (f.type !== 'all' && q.type !== f.type) return false;
    if (f.search && !(q.q.toLowerCase().includes(f.search) || q.id.toLowerCase().includes(f.search))) return false;
    return true;
  });

  return '<div class="page-head">' +
    '<div><h1 class="page-title">Question bank</h1>' +
    '<p class="page-desc">' + S.questions.length + ' questions across ' + CATS.length + ' categories, beginner to advanced.</p></div>' +
    '<div class="page-actions">' +
      '<button class="btn btn-secondary" data-action="reseed">' + ic('refresh', 15) + ' Reseed bank</button>' +
      '<button class="btn btn-primary" data-action="add-question">' + ic('plus', 15) + ' Add question</button>' +
    '</div></div>' +

    '<div class="card card-pad">' +
      '<div class="toolbar">' +
        '<div class="search-box">' + ic('search', 16) +
          '<input class="input" id="qSearch" placeholder="Search questions\u2026" value="' + esc(f.search) + '"></div>' +
        '<div class="seg-scroll"><div class="seg" id="catSeg">' +
          '<button class="seg-item ' + (f.cat === 'all' ? 'active' : '') + '" data-action="qfilter" data-field="cat" data-value="all">All</button>' +
          CATS.map(c => '<button class="seg-item ' + (f.cat === c.id ? 'active' : '') + '" data-action="qfilter" data-field="cat" data-value="' + c.id + '" title="' + esc(c.name) + '">' + catIconHTML(c, 13) + '</button>').join('') +
          '<span class="seg-thumb" id="catThumb"></span>' +
        '</div></div>' +
      '</div>' +
      '<div class="toolbar" style="margin-top:14px">' +
        '<div class="seg" id="diffSeg2">' +
          [['all', 'All levels'], ['beginner', 'Beginner'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced']].map(o =>
            '<button class="seg-item ' + (f.diff === o[0] ? 'active' : '') + '" data-action="qfilter" data-field="diff" data-value="' + o[0] + '">' + o[1] + '</button>').join('') +
          '<span class="seg-thumb" id="diffThumb2"></span>' +
        '</div>' +
        '<div class="seg" id="typeSeg">' +
          [['all', 'All types'], ['mcq', 'Multiple choice'], ['multi', 'Multi-select'], ['matching', 'Matching'], ['ordering', 'Ordering'], ['code', 'Coding'], ['fill', 'Fill in the blank']].map(o =>
            '<button class="seg-item ' + (f.type === o[0] ? 'active' : '') + '" data-action="qfilter" data-field="type" data-value="' + o[0] + '">' + o[1] + '</button>').join('') +
          '<span class="seg-thumb" id="typeThumb"></span>' +
        '</div>' +
        '<div class="row-meta" style="margin-left:auto">' + list.length + ' shown</div>' +
      '</div>' +
    '</div>' +

    '<div style="height:16px"></div>' +
    (list.length ? '<div class="card">' + pgSlice('questions', list).map(qRowHTML).join('') + '</div>' + pagerHTML('questions', list.length)
      : emptyState('search', 'No matching questions', 'Adjust your filters or add a new question to the bank.', 'add-question', 'Add question'));
}

function qRowHTML(q) {
  const c = catOf(q.cat);
  return '<div class="row-item">' +
    '<span class="coverage-icon">' + ic(q.type === 'mcq' || q.type === 'multi' ? 'question' : q.type === 'matching' ? 'link' : q.type === 'ordering' ? 'list' : q.type === 'code' ? 'terminal2' : 'pencil', 15) + '</span>' +
    '<div class="row-main">' +
      '<div class="row-title">' + esc(q.q) + '</div>' +
      '<div class="row-meta">' +
        '<span class="badge b-' + q.diff + '"><span class="dot"></span>' + diffOf(q.diff).name + '</span>' +
        '<span class="badge b-mcq">' + catIconHTML(c, 11) + ' ' + esc(c.name) + '</span>' +
        '<span class="badge b-mcq">' + { mcq: 'Multiple choice', multi: 'Multi-select', fill: 'Fill in the blank', matching: 'Matching', ordering: 'Ordering', code: 'Coding' }[q.type] + '</span>' +
        (q.code ? '<span class="badge b-mcq">' + ic('code', 11) + ' Code</span>' : '') +
        (q.source === 'builtin' ? '<span class="badge b-fill" style="background:var(--surface-3)">Built-in</span>' : '') +
        '<span style="margin-left:auto;font-family:var(--mono);font-size:11px">' + esc(q.id) + '</span>' +
      '</div>' +
    '</div>' +
    '<div class="row-actions">' +
      '<button class="btn-icon" data-action="edit-question" data-id="' + q.id + '" title="Edit">' + ic('pencil', 16) + '</button>' +
      '<button class="btn-icon danger" data-action="delete-question" data-id="' + q.id + '" title="Delete">' + ic('trash', 16) + '</button>' +
    '</div>' +
  '</div>';
}

/* ── Question editor modal ─────────────────────────────────── */

function openQuestionModal(id) {
  const src = id ? S.questions.find(q => q.id === id) : null;
  qDraft = {
    id: src ? src.id : null,
    cat: src ? src.cat : 'frontend',
    diff: src ? src.diff : 'beginner',
    type: src ? src.type : 'mcq',
    q: src ? src.q : '',
    code: src ? (src.code || '') : '',
    options: src ? (src.options || ['', '', '', '']) : ['', '', '', ''],
    answer: src ? (src.answer != null ? src.answer : 0) : 0,
    explain: src ? (src.explain || '') : '',
    fillans: src && src.type === 'fill' ? (src.answer || []).join(', ') : '',
    multiSel: new Set(src && src.type === 'multi' && Array.isArray(src.answer) ? src.answer : []),
    pairs: src && src.type === 'matching' ? (src.pairs || []).map(pr => ({ l: pr.l, r: pr.r })) : [{ l: '', r: '' }, { l: '', r: '' }],
    ordered: src && src.type === 'ordering' ? (src.ordered || []).slice() : ['', '', ''],
    codeLang: src && src.type === 'code' ? (src.codeLang || 'javascript') : 'javascript',
    languages: new Set(src && src.type === 'code' ? (src.languages && src.languages.length ? src.languages : ['javascript', 'python']) : ['javascript', 'python']),
    codeStub: src && src.type === 'code' ? (src.codeStub || '') : '',
    pyStub: src && src.type === 'code' ? (src.pyStub || '') : '',
    testCases: src && src.type === 'code' ? (src.testCases || []).map(tc => tc.ops
      ? { args: JSON.stringify({ ops: tc.ops, values: tc.values, expected: tc.expected }), expected: '', hidden: !!tc.hidden }
      : { args: JSON.stringify(tc.args), expected: JSON.stringify(tc.expected), hidden: !!tc.hidden }) : [{ args: '', expected: '', hidden: false }]
  };
  openModal({
    title: src ? 'Edit question' : 'Add question',
    body: questionModalBody(qDraft),
    foot: '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" data-action="save-question">' + ic('check', 14) + ' Save question</button>',
    wide: true
  });
}

function questionModalBody(d) {
  return '<div class="field">' +
      '<div class="field-label">Category</div>' +
      '<select class="input" data-qdraft="cat">' +
        CATS.map(c => '<option value="' + c.id + '" ' + (d.cat === c.id ? 'selected' : '') + '>' + esc(c.name) + '</option>').join('') +
      '</select>' +
    '</div>' +
    '<div class="field">' +
      '<div class="field-label">Difficulty</div>' +
      '<div class="seg" id="qDiffSeg">' +
        DIFFS.map(x => '<button class="seg-item ' + (d.diff === x.id ? 'active' : '') + '" data-action="qdiff" data-value="' + x.id + '">' + x.name + '</button>').join('') +
        '<span class="seg-thumb" id="qDiffThumb"></span>' +
      '</div>' +
    '</div>' +
    '<div class="field">' +
      '<div class="field-label">Question type</div>' +
      '<div class="seg" id="qTypeSeg">' +
        '<button class="seg-item ' + (d.type === 'mcq' ? 'active' : '') + '" data-action="qtype" data-value="mcq">Multiple choice</button>' +
        '<button class="seg-item ' + (d.type === 'multi' ? 'active' : '') + '" data-action="qtype" data-value="multi">Multi-select</button>' +
        '<button class="seg-item ' + (d.type === 'matching' ? 'active' : '') + '" data-action="qtype" data-value="matching">Matching</button>' +
        '<button class="seg-item ' + (d.type === 'ordering' ? 'active' : '') + '" data-action="qtype" data-value="ordering">Ordering</button>' +
        '<button class="seg-item ' + (d.type === 'code' ? 'active' : '') + '" data-action="qtype" data-value="code">Coding challenge</button>' +
        '<button class="seg-item ' + (d.type === 'fill' ? 'active' : '') + '" data-action="qtype" data-value="fill">Fill in the blank</button>' +
        '<span class="seg-thumb" id="qTypeThumb"></span>' +
      '</div>' +
    '</div>' +
    '<div class="field">' +
      '<label class="field-label">Question <span class="field-help">Use ___ for the blank in fill-in-the-blank</span></label>' +
      '<textarea class="input" data-qdraft="q" placeholder="e.g., Which React hook is used for local state?" style="min-height:70px">' + esc(d.q) + '</textarea>' +
    '</div>' +
    '<div class="field">' +
      '<label class="field-label">Code snippet <span class="field-help">Optional — shown in a code block</span></label>' +
      '<textarea class="input mono" data-qdraft="code" placeholder="function example() { ... }" style="min-height:64px;font-family:var(--mono)">' + esc(d.code) + '</textarea>' +
    '</div>' +
    (d.type === 'mcq' ? mcqOptionsHTML(d) : d.type === 'multi' ? multiOptionsHTML(d) : d.type === 'matching' ? matchingOptionsHTML(d) : d.type === 'ordering' ? orderingOptionsHTML(d) : d.type === 'code' ? codeOptionsHTML(d) : fillOptionsHTML(d)) +
    '<div class="field" style="margin-bottom:4px">' +
      '<label class="field-label">Explanation <span class="field-help">Shown in the answer review</span></label>' +
      '<textarea class="input" data-qdraft="explain" placeholder="Why is this the correct answer?" style="min-height:64px">' + esc(d.explain) + '</textarea>' +
    '</div>';
}

function mcqOptionsHTML(d) {
  return '<div class="field"><div class="field-label">Options <span class="field-help">Select the radio of the correct one</span></div>' +
    '<div style="display:flex;flex-direction:column;gap:8px">' +
    d.options.map((o, i) =>
      '<label style="display:flex;align-items:center;gap:10px;background:var(--surface-2);border:1.5px solid var(--hairline);border-radius:10px;padding:8px 12px;cursor:pointer">' +
        '<input type="radio" name="qcorrect" data-action="qcorrect" data-value="' + i + '" ' + (d.answer === i ? 'checked' : '') + ' style="accent-color:var(--accent);flex:none">' +
        '<span class="opt-key" style="border-color:var(--hairline)">' + LETTERS[i] + '</span>' +
        '<input class="input" style="padding:7px 10px;font-size:13.5px" data-qdraft="opt" data-i="' + i + '" value="' + esc(o) + '" placeholder="Option ' + LETTERS[i] + '">' +
      '</label>').join('') +
    '</div></div>';
}

function multiOptionsHTML(d) {
  return '<div class="field"><div class="field-label">Options <span class="field-help">Check all that are correct</span></div>' +
    '<div style="display:flex;flex-direction:column;gap:8px">' +
    d.options.map((o, i) => {
      const on = d.multiSel.has(i);
      return '<label style="display:flex;align-items:center;gap:10px;background:var(--surface-2);border:1.5px solid ' + (on ? 'rgba(0,113,227,.45)' : 'var(--hairline)') + ';border-radius:10px;padding:8px 12px;cursor:pointer">' +
        '<input type="checkbox" data-action="qmulti" data-value="' + i + '" ' + (on ? 'checked' : '') + ' style="accent-color:var(--accent);flex:none">' +
        '<span class="opt-key" style="border-color:var(--hairline)">' + LETTERS[i] + '</span>' +
        '<input class="input" style="padding:7px 10px;font-size:13.5px" data-qdraft="opt" data-i="' + i + '" value="' + esc(o) + '" placeholder="Option ' + LETTERS[i] + '">' +
      '</label>';
    }).join('') +
    '</div><div class="field-hint">' + d.multiSel.size + ' marked as correct</div></div>';
}

function matchingOptionsHTML(d) {
  return '<div class="field"><div class="field-label">Pairs <span class="field-help">Match each left item to its correct right item</span></div>' +
    '<div style="display:flex;flex-direction:column;gap:8px">' +
    d.pairs.map((pr, i) =>
      '<div style="display:flex;gap:8px;align-items:center">' +
        '<input class="input" style="flex:1" data-action="pair-l" data-i="' + i + '" value="' + esc(pr.l) + '" placeholder="Left item">' +
        '<span style="color:var(--text-3)">→</span>' +
        '<input class="input" style="flex:1" data-action="pair-r" data-i="' + i + '" value="' + esc(pr.r) + '" placeholder="Right item">' +
        '<button class="btn-icon danger" data-action="pair-remove" data-i="' + i + '" title="Remove pair">' + ic('x', 14) + '</button>' +
      '</div>').join('') +
    '</div>' +
    '<div style="margin-top:8px"><button class="btn btn-secondary btn-sm" data-action="pair-add">' + ic('plus', 13) + ' Add pair</button></div>' +
  '</div>';
}

function orderingOptionsHTML(d) {
  return '<div class="field"><div class="field-label">Correct order <span class="field-help">Items listed top-to-bottom in the correct sequence</span></div>' +
    '<div style="display:flex;flex-direction:column;gap:8px">' +
    d.ordered.map((item, i) =>
      '<div style="display:flex;gap:8px;align-items:center">' +
        '<span class="badge b-mcq">#' + (i + 1) + '</span>' +
        '<input class="input" style="flex:1" data-action="order-item" data-i="' + i + '" value="' + esc(item) + '" placeholder="Step / item ' + (i + 1) + '">' +
        '<button class="btn-icon" data-action="order-up" data-i="' + i + '" ' + (i === 0 ? 'disabled' : '') + ' title="Move up">' + ic('chevronD', 14) + '</button>' +
        '<button class="btn-icon" data-action="order-down" data-i="' + i + '" ' + (i === d.ordered.length - 1 ? 'disabled' : '') + ' title="Move down">' + ic('chevronR', 14) + '</button>' +
        '<button class="btn-icon danger" data-action="order-remove" data-i="' + i + '" title="Remove">' + ic('x', 14) + '</button>' +
      '</div>').join('') +
    '</div>' +
    '<div style="margin-top:8px"><button class="btn btn-secondary btn-sm" data-action="order-add">' + ic('plus', 13) + ' Add item</button></div>' +
  '</div>';
}

function codeOptionsHTML(d) {
  return '<div class="field">' +
      '<div class="field-label">Default language</div>' +
      '<select class="input" data-action="code-lang">' +
        '<option value="javascript" ' + (d.codeLang === 'javascript' ? 'selected' : '') + '>JavaScript</option>' +
        '<option value="python" ' + (d.codeLang === 'python' ? 'selected' : '') + '>Python</option>' +
      '</select>' +
    '</div>' +
    '<div class="field">' +
      '<div class="field-label">Allowed languages <span class="field-help">Candidates can switch between these</span></div>' +
      '<div class="chip-row">' +
        [['javascript', 'JavaScript'], ['python', 'Python']].map(l =>
          '<button class="chip ' + (d.languages.has(l[0]) ? 'active' : '') + '" data-action="toggle-code-lang" data-value="' + l[0] + '" aria-pressed="' + d.languages.has(l[0]) + '">' + l[1] + ic('check', 12) + '</button>').join('') +
      '</div>' +
    '</div>' +
    '<div class="field">' +
      '<label class="field-label">Starter code — JavaScript <span class="field-help">Must define function solution(...)</span></label>' +
      '<textarea class="input mono" data-action="code-stub" style="min-height:110px;font-family:var(--mono);font-size:13px">' + esc(d.codeStub) + '</textarea>' +
    '</div>' +
    '<div class="field">' +
      '<label class="field-label">Starter code — Python <span class="field-help">Optional; a sensible default is used if blank</span></label>' +
      '<textarea class="input mono" data-action="py-stub" style="min-height:110px;font-family:var(--mono);font-size:13px">' + esc(d.pyStub) + '</textarea>' +
    '</div>' +
    '<div class="field" style="margin-bottom:4px">' +
      '<div class="field-label">Test cases <span class="field-help">args/expected JSON, or {"ops":[...],"values":[...],"expected":[...]} for design problems; use {"$list":[..]}/{"$tree":[..]} markers</span></div>' +
      d.testCases.map((tc, i) =>
        '<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">' +
          '<span class="badge b-mcq">#' + (i + 1) + '</span>' +
          '<input class="input mono" style="flex:1;min-width:0" data-action="tc-args" data-i="' + i + '" value="' + esc(tc.args) + '" placeholder=&quot;args: [2, 3]&quot;>' +
          '<input class="input mono" style="flex:1;min-width:0" data-action="tc-expected" data-i="' + i + '" value="' + esc(tc.expected) + '" placeholder=&quot;expected: 5&quot;>' +
          '<label style="font-size:12px;color:var(--text-3);display:flex;align-items:center;gap:4px;white-space:nowrap"><input type="checkbox" data-action="tc-hidden" data-i="' + i + '" ' + (tc.hidden ? 'checked' : '') + ' style="accent-color:var(--accent)">hidden</label>' +
          '<button class="btn-icon danger" data-action="tc-remove" data-i="' + i + '" title="Remove case">' + ic('x', 14) + '</button>' +
        '</div>').join('') +
      '<div><button class="btn btn-secondary btn-sm" data-action="tc-add">' + ic('plus', 13) + ' Add test case</button></div>' +
    '</div>';
}

function fillOptionsHTML(d) {
  return '<div class="field">' +
    '<label class="field-label">Correct answer <span class="field-help">Accept multiple variants, comma-separated</span></label>' +
    '<input class="input" data-qdraft="fillans" value="' + esc(d.fillans) + '" placeholder="e.g., useMemo, use memo" style="font-family:var(--mono)">' +
  '</div>';
}

async function saveQuestion() {
  const d = qDraft;
  if (!d.q.trim()) { toast('Question text is required', 'error'); return; }
  if (d.type === 'mcq') {
    if (d.options.some(o => !o.trim())) { toast('Every option needs text', 'error'); return; }
    if (d.answer == null || d.options[d.answer] === undefined) { toast('Mark the correct answer', 'error'); return; }
  } else if (d.type === 'multi') {
    if (d.options.some(o => !o.trim())) { toast('Every option needs text', 'error'); return; }
    if (d.multiSel.size < 1) { toast('Select at least one correct option', 'error'); return; }
  } else if (d.type === 'matching') {
    if (d.pairs.length < 2 || d.pairs.some(pr => !pr.l.trim() || !pr.r.trim())) { toast('Matching needs at least two complete pairs', 'error'); return; }
  } else if (d.type === 'ordering') {
    if (d.ordered.length < 2 || d.ordered.some(x => !x.trim())) { toast('Ordering needs at least two items', 'error'); return; }
  } else if (d.type === 'code') {
    if (!d.codeStub.trim()) { toast('Provide starter code', 'error'); return; }
    if (!d.testCases.length) { toast('Add at least one test case', 'error'); return; }
    for (const tc of d.testCases) {
      try {
        const a = JSON.parse(tc.args || '[]');
        if (a && a.ops) {
          if (!Array.isArray(a.values) || !Array.isArray(a.expected)) { toast('Design test cases need values and expected arrays', 'error'); return; }
        } else {
          JSON.parse(tc.expected);
        }
      } catch (e) { toast('Test cases must be valid JSON', 'error'); return; }
    }
  } else {
    if (!d.fillans.split(',').map(s => s.trim()).filter(Boolean).length) { toast('Provide a correct answer', 'error'); return; }
  }
  const payload = {
    id: d.id || undefined,
    cat: d.cat,
    diff: d.diff,
    type: d.type,
    q: d.q.trim(),
    code: d.code.trim(),
    explain: d.explain.trim(),
    options: d.type === 'matching' ? d.pairs.map(pr => pr.r.trim()) : (d.type === 'mcq' || d.type === 'multi') ? d.options.map(o => o.trim()) : undefined,
    pairs: d.type === 'matching' ? d.pairs.map(pr => ({ l: pr.l.trim(), r: pr.r.trim() })) : undefined,
    ordered: d.type === 'ordering' ? d.ordered.map(x => x.trim()) : undefined,
    codeLang: d.type === 'code' ? d.codeLang : undefined,
    languages: d.type === 'code' ? Array.from(d.languages) : undefined,
    codeStub: d.type === 'code' ? d.codeStub : undefined,
    pyStub: d.type === 'code' ? d.pyStub : undefined,
    testCases: d.type === 'code' ? d.testCases.map(tc => {
      const a = JSON.parse(tc.args || '[]');
      if (a && a.ops) return { ops: a.ops, values: a.values, expected: a.expected, hidden: !!tc.hidden };
      return { args: a, expected: JSON.parse(tc.expected), hidden: !!tc.hidden };
    }) : undefined,
    answer: d.type === 'mcq' ? d.answer : d.type === 'multi' ? Array.from(d.multiSel).sort((a, b) => a - b) : d.type === 'code' ? [] : d.fillans.split(',').map(s => s.trim()).filter(Boolean)
  };
  try {
    const saved = d.id
      ? await API.put('/api/admin/questions/' + d.id, payload)
      : await API.post('/api/admin/questions', payload);
    qDraft = null;
    closeModal();
    await loadAdminData();
    toast(saved.id === d.id ? 'Question updated' : 'Question added', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function reseedBank() {
  confirmModal({
    title: 'Reseed question bank?',
    body: 'Built-in questions are replaced with the canonical bank (' + S.questions.length + ' questions). Custom questions are preserved.',
    confirmLabel: 'Reseed',
    danger: true,
    onConfirm: async () => {
      closeModal();
      try {
        const r = await API.post('/api/admin/reseed');
        await loadAdminData();
        toast('Seeded ' + r.seeded + ' built-in questions', 'success');
      } catch (e) { toast(e.message, 'error'); }
    }
  });
}

/* ── Results (admin) ───────────────────────────────────────── */

function vResults() {
  const all = S.attempts;
  const submitted = all.filter(x => x.status === 'submitted');
  const avg = submitted.length ? Math.round(submitted.reduce((x, y) => x + (y.pct || 0), 0) / submitted.length) : 0;
  const passRate = submitted.length ? Math.round(submitted.filter(x => x.passed).length / submitted.length * 100) : 0;
  const f = S.qFilters.search;
  const a = f ? all.filter(x => searchMatches(f, x.candidate, x.email, x.testName)) : all;
  return '<div class="page-head">' +
    '<div><h1 class="page-title">Results</h1>' +
    '<p class="page-desc">Every attempt submitted through the candidate portal.</p></div>' +
  '</div>' +
  '<div class="stat-grid">' +
    statCard('users', 'Attempts', all.length, 'total') +
    statCard('chart', 'Average score', avg + '%', 'submitted') +
    statCard('check', 'Pass rate', passRate + '%', 'at the pass mark') +
    statCard('clock', 'In progress', all.length - submitted.length, 'to review') +
  '</div>' +
  '<div style="height:16px"></div>' +
  (a.length ? '<div class="card"><div class="table-wrap"><table class="tbl">' +
    '<thead><tr><th>Candidate</th><th>Test</th><th>Status</th><th>Score</th><th>Time used</th><th>Started</th><th>IP</th><th>Switches</th><th></th></tr></thead><tbody>' +
    pgSlice('results', a).map(attRowHTML).join('') +
    '</tbody></table></div>' + pagerHTML('results', a.length) + '</div>'
    : emptyState('chart', 'No attempts yet', f ? 'No attempts match your search.' : 'When candidates submit a test, results will appear here.'));
}

function attRowHTML(x) {
  const done = x.status === 'submitted';
  return '<tr>' +
    '<td style="font-weight:600">' + esc(x.candidate) +
      (x.email ? '<div style="font-weight:400;font-size:12px;color:var(--text-3)">' + esc(x.email) + '</div>' : '') + '</td>' +
    '<td>' + esc(x.testName) + '</td>' +
    '<td><span class="badge ' + (done ? (x.passed ? 'b-pass' : 'b-fail') : 'b-draft') + '">' + (done ? 'Submitted' : 'In progress') + '</span></td>' +
    '<td>' + (done
      ? '<span class="badge ' + (x.passed ? 'b-pass' : 'b-fail') + '">' + x.pct + '%</span> <span style="color:var(--text-3);font-size:12px" class="num">' + x.correct + '/' + x.total + '</span>'
      : '<span style="color:var(--text-3);font-size:12.5px">—</span>') + '</td>' +
    '<td class="num">' + (done ? fmtMins(x.durationSec - (x.remainingSec || 0)) : fmtMins(x.durationSec - (x.remainingSec != null ? x.remainingSec : x.durationSec))) + '</td>' +
    '<td class="num" style="color:var(--text-2)">' + fmtDate(x.startedAt) + '</td>' +
    '<td class="num" style="font-size:12px;color:var(--text-2)">' + esc(x.ip || '\u2014') + '</td>' +
    '<td class="num" style="color:var(--text-2)">' + (x.leaves || 0) + '</td>' +
    '<td style="display:flex;gap:6px;justify-content:flex-end">' +
      (done ? '' : '<button class="btn btn-sm btn-secondary" data-action="force-submit" data-id="' + x.id + '">Submit now</button>') +
      '<button class="btn btn-sm btn-secondary" data-action="view-attempt" data-id="' + x.id + '">View</button>' +
    '</td>' +
  '</tr>';
}

async function openAttempt(id) {
  try {
    const { attempt, questions } = await API.get('/api/admin/attempts/' + id);
    buildQPool(Object.values(questions));
    const done = attempt.status === 'submitted';
    openModal({
      title: attempt.candidate + ' — ' + attempt.testName,
      body:
        '<div class="result-stats" style="margin-top:0">' +
          '<div class="result-stat"><div class="result-stat-val" style="color:' + (done ? (attempt.passed ? 'var(--green-text)' : 'var(--red-text)') : 'var(--text-2)') + '">' + (done ? attempt.pct + '%' : '—') + '</div><div class="result-stat-lbl">Score</div></div>' +
          '<div class="result-stat"><div class="result-stat-val">' + (done ? attempt.correct + '/' + attempt.total : attempt.order.length) + '</div><div class="result-stat-lbl">' + (done ? 'Correct' : 'Questions') + '</div></div>' +
          '<div class="result-stat"><div class="result-stat-val">' + fmtMins(attempt.durationSec - (attempt.remainingSec != null ? attempt.remainingSec : attempt.durationSec)) + '</div><div class="result-stat-lbl">Time used</div></div>' +
          '<div class="result-stat"><div class="result-stat-val">' + attempt.passPct + '%</div><div class="result-stat-lbl">Pass mark</div></div>' +
        '</div>' +
        (attempt.ip || attempt.ua || attempt.leaves ? '<div style="margin:18px 0 4px" class="section-label">Proctoring</div>' +
          '<div class="proctor-grid">' +
            '<div><div class="result-stat-lbl">IP address</div><div style="font-size:13px;font-weight:600;margin-top:2px">' + esc(attempt.ip || '\u2014') + '</div></div>' +
            '<div><div class="result-stat-lbl">Tab / window switches</div><div style="font-size:13px;font-weight:600;margin-top:2px" class="' + ((attempt.leaves || 0) > 0 ? 'danger-text' : '') + '">' + (attempt.leaves || 0) + '</div></div>' +
            '<div style="grid-column:1/-1"><div class="result-stat-lbl">Device</div><div style="font-size:12px;color:var(--text-2);margin-top:2px;word-break:break-all">' + esc(attempt.ua || '\u2014') + '</div></div>' +
          '</div>' : '') +
        '<div style="margin:18px 0 4px" class="section-label">By category</div>' +
        breakdownHTML(attempt.byCat) +
        (done ? '<div style="margin:18px 0 4px" class="section-label">Answer review</div>' + reviewHTML(attempt) : ''),
      foot: '<button class="btn btn-secondary" data-action="close-modal">Close</button>',
      wide: true
    });
  } catch (e) { toast(e.message, 'error'); }
}

async function forceSubmit(id) {
  try {
    await API.post('/api/admin/attempts/' + id + '/force-submit');
    await loadAdminData();
    toast('Attempt submitted and graded', 'success');
  } catch (e) { toast(e.message, 'error'); }
}

/* ── Activity (proctoring / audit log) ─────────────────────── */

async function loadEvents() {
  try {
    S.events = await API.get('/api/admin/events');
  } catch (e) {
    S.events = [];
    toast(e.message, 'error');
  }
  render();
}

const _EV_META = {
  identify: { label: 'Identify', badge: 'b-draft', icon: 'user' },
  start:    { label: 'Start',    badge: 'b-intermediate', icon: 'play' },
  submit:   { label: 'Submit',   badge: 'b-pass', icon: 'check' },
  discard:  { label: 'Discard',  badge: 'b-fail', icon: 'trash' }
};

function vActivity() {
  const ev = S.events || [];
  const f = S.qFilters.search;
  const list = f ? ev.filter(e => searchMatches(f, e.candidate, e.email, e.testName, e.ip, e.kind)) : ev;
  return '<div class="page-head">' +
    '<div><h1 class="page-title">Activity</h1>' +
    '<p class="page-desc">Each sign-in, test start, submit, and discard is recorded with IP and device data. Discards may indicate misuse.</p></div>' +
  '</div>' +
  '<div style="height:16px"></div>' +
  (list.length ? '<div class="card"><div class="table-wrap"><table class="tbl">' +
    '<thead><tr><th>Event</th><th>Candidate</th><th>Test</th><th>IP</th><th>Device</th><th>Switches</th><th>When</th></tr></thead><tbody>' +
    pgSlice('activity', list).map(evRowHTML).join('') +
    '</tbody></table></div>' + pagerHTML('activity', list.length) + '</div>'
    : emptyState('clock', 'No activity yet', f ? 'No activity matches your search.' : 'Events appear here when candidates sign in, start, submit, or discard tests.'));
}

function evRowHTML(e) {
  const meta = _EV_META[e.kind] || { label: e.kind, badge: 'b-draft', icon: 'info' };
  return '<tr>' +
    '<td><span class="badge ' + meta.badge + '">' + ic(meta.icon, 11) + ' ' + meta.label + '</span></td>' +
    '<td style="font-weight:600">' + esc(e.candidate || '\u2014') +
      (e.email ? '<div style="font-weight:400;font-size:12px;color:var(--text-3)">' + esc(e.email) + '</div>' : '') + '</td>' +
    '<td style="font-size:13px">' + esc(e.testName || '\u2014') + '</td>' +
    '<td class="num" style="font-size:12px">' + esc(e.ip || '\u2014') + '</td>' +
    '<td style="font-size:12px;color:var(--text-2);max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + esc(e.ua || '') + '">' + esc(e.ua || '\u2014') + '</td>' +
    '<td class="num">' + (e.leaves || '\u2014') + '</td>' +
    '<td class="num" style="color:var(--text-2)">' + fmtDate(e.at) + '</td>' +
  '</tr>';
}

/* ── Admins (superadmin) ───────────────────────────────────── */

function vAdmins() {
  const f = S.qFilters.search;
  const list = f ? S.admins.filter(x => searchMatches(f, x.username, x.displayName, x.email)) : S.admins;
  return '<div class="page-head">' +
    '<div><h1 class="page-title">Administrators</h1>' +
    '<p class="page-desc">Manage who can access the console. Superadmins can add and remove admins.</p></div>' +
    '<div class="page-actions"><button class="btn btn-primary" data-action="add-admin">' + ic('plus', 15) + ' Add admin</button></div>' +
  '</div>' +
  (list.length ? '<div class="card">' +
    list.map(x =>
      '<div class="row-item">' +
        '<span class="admin-avatar" style="width:34px;height:34px;font-size:14px">' + esc((x.displayName || x.username).slice(0, 1).toUpperCase()) + '</span>' +
        '<div class="row-main">' +
          '<div class="row-title">' + esc(x.displayName || x.username) +
            (x.id === S.auth.id ? '<span class="badge b-fill" style="margin-left:8px">You</span>' : '') + '</div>' +
          '<div class="row-meta">@' + esc(x.username) + (x.email ? ' · ' + esc(x.email) : '') + ' · joined ' + fmtDate(x.createdAt) + '</div>' +
        '</div>' +
        '<span class="badge ' + (x.role === 'superadmin' ? 'b-intermediate' : 'b-mcq') + '">' + (x.role === 'superadmin' ? 'Superadmin' : 'Admin') + '</span>' +
        '<div class="row-actions">' +
          (x.id !== S.auth.id
            ? '<button class="btn-icon danger" data-action="delete-admin" data-id="' + x.id + '" title="Remove admin">' + ic('trash', 16) + '</button>'
            : '') +
        '</div>' +
      '</div>').join('') +
  '</div>'
  : emptyState('users', 'No administrators found', f ? 'No administrators match your search.' : 'No administrators yet.', 'add-admin', 'Add admin'));
}

function openAddAdminModal() {
  S.modal = {
    title: 'Add administrator',
    body:
      '<div class="field"><label class="field-label">Username</label>' +
        '<input class="input" id="newAdminUser" placeholder="e.g., jane" autocomplete="off"></div>' +
      '<div class="field"><label class="field-label">Display name</label>' +
        '<input class="input" id="newAdminName" placeholder="e.g., Jane Doe" autocomplete="off"></div>' +
      '<div class="field"><label class="field-label">Email <span class="field-help">Optional</span></label>' +
        '<input class="input" id="newAdminEmail" type="email" placeholder="jane@company.com" autocomplete="off"></div>' +
      '<div class="field"><label class="field-label">Password</label>' +
        '<input class="input" id="newAdminPass" type="password" placeholder="Min. 6 characters" autocomplete="new-password"></div>' +
      '<div class="field" style="margin-bottom:4px"><label class="field-label">Role</label>' +
        '<div class="seg" id="newRoleSeg">' +
          '<button class="seg-item active" data-action="new-admin-role" data-value="admin">Admin</button>' +
          '<button class="seg-item" data-action="new-admin-role" data-value="superadmin">Superadmin</button>' +
          '<span class="seg-thumb" id="newRoleThumb"></span>' +
        '</div></div>',
    foot: '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" data-action="save-admin">' + ic('check', 14) + ' Create admin</button>'
  };
  render();
  positionSeg('#newRoleSeg', '#newRoleThumb', 0);
}

let _newAdminRole = 'admin';

async function saveNewAdmin() {
  const u = $('#newAdminUser'), n = $('#newAdminName'), em = $('#newAdminEmail'), p = $('#newAdminPass');
  if (!u || !p) return;
  try {
    await API.post('/api/admin/admins', {
      username: u.value, displayName: n.value, email: em.value, password: p.value, role: _newAdminRole
    });
    closeModal();
    await loadAdminData();
    toast('Admin created', 'success');
  } catch (e) { toast(e.message, 'error'); }
}

function confirmDeleteAdmin(id) {
  const target = S.admins.find(a => a.id === id);
  if (!target) return;
  confirmModal({
    title: 'Remove administrator?',
    body: '@' + esc(target.username) + ' will lose access to the console immediately.',
    confirmLabel: 'Remove',
    danger: true,
    onConfirm: async () => {
      closeModal();
      try {
        await API.del('/api/admin/admins/' + id);
        await loadAdminData();
        toast('Administrator removed');
      } catch (e) { toast(e.message, 'error'); }
    }
  });
}

/* ── Organizations (superadmin) ────────────────────────────── */

async function loadOrgs() {
  try {
    S.orgs = await API.get('/api/admin/orgs');
  } catch (e) {
    S.orgs = [];
    toast(e.message, 'error');
  }
  render();
}

function vOrganizations() {
  const f = S.qFilters.search;
  const list = f ? S.orgs.filter(o => searchMatches(f, o.name, o.username, o.email)) : S.orgs;
  return '<div class="page-head">' +
    '<div><h1 class="page-title">Organizations</h1>' +
    '<p class="page-desc">Organizations get their own portal where they manage their team\u2019s candidates. Assign them the tests they may offer.</p></div>' +
    '<div class="page-actions"><button class="btn btn-primary" data-action="add-org">' + ic('plus', 15) + ' Add organization</button></div>' +
  '</div>' +
  (list.length ? '<div class="card">' +
    list.map(o => {
      const granted = (o.tests || []).length;
      const cands = o.candidateCount || 0;
      return '<div class="row-item">' +
        '<span class="admin-avatar" style="width:34px;height:34px;font-size:14px">' + esc((o.name || o.username || 'O').slice(0, 1).toUpperCase()) + '</span>' +
        '<div class="row-main">' +
          '<div class="row-title">' + esc(o.name || o.username) + '</div>' +
          '<div class="row-meta">@' + esc(o.username) + (o.email ? ' \u00B7 ' + esc(o.email) : '') + ' \u00B7 created ' + fmtDate(o.createdAt) + '</div>' +
        '</div>' +
        '<span class="badge ' + (o.active ? 'b-published' : 'b-fail') + '"><span class="dot"></span>' + (o.active ? 'Active' : 'Disabled') + '</span>' +
        '<span class="badge b-mcq">' + cands + ' candidate' + (cands === 1 ? '' : 's') + '</span>' +
        '<span class="badge b-intermediate">' + granted + ' test' + (granted === 1 ? '' : 's') + '</span>' +
        '<div class="row-actions">' +
          '<button class="btn btn-sm btn-secondary" data-action="edit-org" data-id="' + o.id + '">' + ic('gear', 13) + ' Edit</button>' +
          '<button class="btn-icon danger" data-action="delete-org" data-id="' + o.id + '" title="Remove organization">' + ic('trash', 16) + '</button>' +
        '</div>' +
      '</div>';
    }).join('') +
  '</div>'
  : emptyState('building', 'No organizations yet', f ? 'No organizations match your search.' : 'Create an organization to give a team their own candidate portal.', 'add-org', 'Add organization'));
}

let _orgDraft = null;

function orgModalBody(d) {
  return '<div class="field"><label class="field-label">Name</label>' +
      '<input class="input" id="orgName" placeholder="e.g., Acme Corp" autocomplete="off" value="' + esc(d.name) + '"></div>' +
    '<div class="field"><label class="field-label">Username <span class="field-help">For the organization sign-in</span></label>' +
      '<input class="input" id="orgUser" placeholder="e.g., acme" autocomplete="off" value="' + esc(d.username) + '"' + (d.id ? ' disabled' : '') + '></div>' +
    '<div class="field"><label class="field-label">Email <span class="field-help">Optional</span></label>' +
      '<input class="input" id="orgEmail" type="email" placeholder="admin@acme.com" autocomplete="off" value="' + esc(d.email) + '"></div>' +
    '<div class="field"><label class="field-label">Password <span class="field-help">' + (d.id ? 'Leave blank to keep the current one' : 'Min. 6 characters') + '</span></label>' +
      '<input class="input" id="orgPass" type="password" placeholder="' + (d.id ? 'Unchanged' : 'Min. 6 characters') + '" autocomplete="new-password"></div>' +
    '<div class="setting-row">' +
      '<div><div class="setting-label">Active</div><div class="setting-sub">Disabled organizations can\u2019t sign in</div></div>' +
      '<label class="switch"><input type="checkbox" id="orgActive" ' + (d.active ? 'checked' : '') + '><span class="track"></span><span class="thumb"></span></label>' +
    '</div>' +
    '<div class="field" style="margin-bottom:4px">' +
      '<div class="field-label">Assigned tests <span class="field-help">The org may only assign these</span></div>' +
      searchMultiHTML('org-tests', S.tests.map(t => ({ id: t.id, name: t.name, sub: t.published ? 'Published' : 'Draft', subCls: t.published ? 'b-published' : 'b-draft' })), 'No tests yet \u2014 create a test first.') +
    '</div>';
}

function rerenderOrgModal() {
  if (!_orgDraft) return;
  openModal({
    title: _orgDraft.id ? 'Edit organization' : 'Add organization',
    body: orgModalBody(_orgDraft),
    foot: '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" data-action="save-org">' + ic('check', 14) + ' ' + (_orgDraft.id ? 'Save changes' : 'Create organization') + '</button>',
    wide: true
  });
}

function openOrgModal(id) {
  const src = id ? S.orgs.find(o => o.id === id) : null;
  _orgDraft = {
    id: src ? src.id : null,
    name: src ? (src.name || '') : '',
    username: src ? src.username : '',
    email: src ? (src.email || '') : '',
    password: '',
    active: src ? src.active !== false : true,
    tests: new Set(src ? (src.tests || []) : [])
  };
  registerSM('org-tests', _orgDraft.tests, rerenderOrgModal, null);
  rerenderOrgModal();
}

async function saveOrg() {
  if (!_orgDraft) return;
  const g = sel => (($(sel) || {}).value || '');
  const d = _orgDraft;
  d.name = g('#orgName');
  d.username = g('#orgUser');
  d.email = g('#orgEmail');
  d.password = g('#orgPass');
  d.active = !!((($('#orgActive') || {}).checked));
  if (!d.name.trim()) { toast('Organization name is required', 'error'); return; }
  if (!d.id && !/^[a-z0-9._-]{3,24}$/i.test(d.username.trim())) { toast('Username must be 3\u201324 letters, digits, dots, dashes or underscores', 'error'); return; }
  if (d.password && d.password.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
  const payload = { name: d.name, email: d.email, tests: Array.from(d.tests), active: d.active };
  if (!d.id) { payload.username = d.username; payload.password = d.password; }
  else if (d.password) payload.password = d.password;
  try {
    if (d.id) await API.put('/api/admin/orgs/' + d.id, payload);
    else await API.post('/api/admin/orgs', payload);
    _orgDraft = null;
    closeModal();
    await loadAdminData();
    toast(d.id ? 'Organization updated' : 'Organization created', 'success');
  } catch (e) { toast(e.message, 'error'); }
}

function confirmDeleteOrg(id) {
  const o = S.orgs.find(x => x.id === id);
  if (!o) return;
  confirmModal({
    title: 'Remove organization?',
    body: '@' + esc(o.username) + ' and its portal will be removed. Its candidates keep their accounts but lose their organization and assigned tests.',
    confirmLabel: 'Remove',
    danger: true,
    onConfirm: async () => {
      closeModal();
      try {
        await API.del('/api/admin/orgs/' + id);
        await loadAdminData();
        toast('Organization removed');
      } catch (e) { toast(e.message, 'error'); }
    }
  });
}

/* ── Candidates (granted candidate accounts) ───────────────── */

async function loadCandidates() {
  try {
    S.candidates = await API.get('/api/admin/candidates');
  } catch (e) {
    S.candidates = [];
    toast(e.message, 'error');
  }
  render();
}

function vCandidates() {
  const f = S.qFilters.search;
  const list = f ? S.candidates.filter(c => searchMatches(f, c.username, c.displayName, c.email)) : S.candidates;
  return '<div class="page-head">' +
    '<div><h1 class="page-title">Candidates</h1>' +
    '<p class="page-desc">Each candidate can sign in to the portal. They can take only the tests you assign.</p></div>' +
    '<div class="page-actions"><button class="btn btn-primary" data-action="add-candidate">' + ic('plus', 15) + ' Add candidate</button></div>' +
  '</div>' +
  (list.length ? '<div class="card">' + pgSlice('candidates', list).map(candidateRowHTML).join('') + '</div>' + pagerHTML('candidates', list.length)
    : emptyState('users', 'No candidates yet', f ? 'No candidates match your search.' : 'Create an account to give access. Assign the tests that the candidate can take.', 'add-candidate', 'Add candidate'));
}

function candidateRowHTML(c) {
  const granted = (c.tests || []).length;
  return '<div class="row-item">' +
    '<span class="admin-avatar" style="width:34px;height:34px;font-size:14px">' + esc((c.displayName || c.username).slice(0, 1).toUpperCase()) + '</span>' +
    '<div class="row-main">' +
      '<div class="row-title">' + esc(c.displayName || c.username) + '</div>' +
      '<div class="row-meta">@' + esc(c.username) + (c.email ? ' · ' + esc(c.email) : '') + ' · joined ' + fmtDate(c.createdAt) + '</div>' +
    '</div>' +
    '<span class="badge ' + (c.active ? 'b-published' : 'b-fail') + '"><span class="dot"></span>' + (c.active ? 'Active' : 'Disabled') + '</span>' +
    '<span class="badge b-mcq">' + granted + ' test' + (granted === 1 ? '' : 's') + '</span>' +
    '<span class="badge ' + (c.viewResults ? 'b-published' : 'b-draft') + '"><span class="dot"></span>' + (c.viewResults ? 'Results on' : 'Results off') + '</span>' +
    '<div class="row-actions">' +
      '<button class="btn btn-sm btn-secondary" data-action="edit-candidate" data-id="' + c.id + '">' + ic('key', 13) + ' Manage access</button>' +
      '<button class="btn-icon danger" data-action="delete-candidate" data-id="' + c.id + '" title="Remove candidate">' + ic('trash', 16) + '</button>' +
    '</div>' +
  '</div>';
}

let _candDraft = null;

function candidateModalBody(d) {
  return '<div class="field"><label class="field-label">Username</label>' +
      '<input class="input" id="candUser" placeholder="e.g., ada.lovelace" autocomplete="off" ' + (d.id ? 'disabled' : '') + ' value="' + esc(d.username) + '"></div>' +
    '<div class="field"><label class="field-label">Display name <span class="field-help">Shown on the candidate\u2019s tests</span></label>' +
      '<input class="input" id="candName" placeholder="e.g., Ada Lovelace" autocomplete="off" value="' + esc(d.displayName) + '"></div>' +
    '<div class="field"><label class="field-label">Email <span class="field-help">Optional</span></label>' +
      '<input class="input" id="candEmail" type="email" placeholder="ada@company.com" autocomplete="off" value="' + esc(d.email) + '"></div>' +
    '<div class="field"><label class="field-label">Password <span class="field-help">' + (d.id ? 'Leave blank to keep the current one' : 'Min. 6 characters') + '</span></label>' +
      '<input class="input" id="candPass" type="password" placeholder="' + (d.id ? 'Unchanged' : 'Min. 6 characters') + '" autocomplete="new-password"></div>' +
    '<div class="setting-row">' +
      '<div><div class="setting-label">Active</div><div class="setting-sub">Disabled accounts can\u2019t sign in</div></div>' +
      '<label class="switch"><input type="checkbox" id="candActive" ' + (d.active ? 'checked' : '') + '><span class="track"></span><span class="thumb"></span></label>' +
    '</div>' +
    '<div class="setting-row">' +
      '<div><div class="setting-label">Results access</div><div class="setting-sub">Candidates can see their score, pass rate, and attempt history after a test</div></div>' +
      '<label class="switch"><input type="checkbox" id="candViewResults" ' + (d.viewResults ? 'checked' : '') + '><span class="track"></span><span class="thumb"></span></label>' +
    '</div>' +
    '<div class="field" style="margin-bottom:4px">' +
      '<div class="field-label">Assigned tests <span class="field-help" id="candTestCount">' + d.tests.size + ' of ' + S.tests.length + ' selected</span></div>' +
      '<div class="cand-tests">' +
        (S.tests.length ? S.tests.map(t => {
          const on = d.tests.has(t.id);
          return '<label class="cand-test ' + (on ? 'on' : '') + '">' +
            '<input type="checkbox" data-action="cand-test-toggle" data-value="' + t.id + '" ' + (on ? 'checked' : '') + '>' +
            '<span>' + esc(t.name) + '</span>' +
            '<span class="badge ' + (t.published ? 'b-published' : 'b-draft') + '"><span class="dot"></span>' + (t.published ? 'Published' : 'Draft') + '</span>' +
          '</label>';
        }).join('')
        : '<p style="color:var(--text-3);font-size:13px">No tests yet — create a test first.</p>') +
      '</div>' +
    '</div>';
}

function captureCandDraftFromDOM() {
  if (!_candDraft) return;
  const g = sel => (($(sel) || {}).value || '');
  _candDraft.username = g('#candUser');
  _candDraft.displayName = g('#candName');
  _candDraft.email = g('#candEmail');
  _candDraft.password = g('#candPass');
  _candDraft.active = !!((($('#candActive') || {}).checked));
  _candDraft.viewResults = !!((($('#candViewResults') || {}).checked));
}

function openAddCandidateModal() {
  _candDraft = { id: null, username: '', displayName: '', email: '', password: '', active: true, viewResults: false, tests: new Set() };
  rerenderCandidateModal();
}

function openEditCandidateModal(id) {
  const c = S.candidates.find(x => x.id === id);
  if (!c) return;
  _candDraft = {
    id: c.id,
    username: c.username,
    displayName: c.displayName || '',
    email: c.email || '',
    password: '',
    active: c.active !== false,
    viewResults: c.viewResults === true,
    tests: new Set(c.tests || [])
  };
  rerenderCandidateModal();
}

function rerenderCandidateModal() {
  if (!_candDraft) return;
  openModal({
    title: _candDraft.id ? 'Manage access' : 'Add candidate',
    body: candidateModalBody(_candDraft),
    foot: '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" data-action="save-candidate">' + ic('check', 14) + ' ' + (_candDraft.id ? 'Save changes' : 'Create candidate') + '</button>',
    wide: true
  });
}

function toggleCandidateTest(id) {
  if (!_candDraft) return;
  const box = $('input[data-action="cand-test-toggle"][data-value="' + id + '"]');
  const on = box ? box.checked : _candDraft.tests.has(id);
  if (on) _candDraft.tests.add(id); else _candDraft.tests.delete(id);
  const lab = box ? box.closest('.cand-test') : null;
  if (lab) lab.classList.toggle('on', on);
  const cnt = $('#candTestCount');
  if (cnt) cnt.textContent = _candDraft.tests.size + ' of ' + S.tests.length + ' selected';
}

async function saveCandidate() {
  if (!_candDraft) return;
  captureCandDraftFromDOM();
  const d = _candDraft;
  if (!d.id && !/^[a-z0-9._-]{3,24}$/i.test(d.username.trim())) { toast('Username must be 3\u201324 letters, digits, dots, dashes or underscores', 'error'); return; }
  if (d.password && d.password.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
  if (!d.id && d.password.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
  const payload = {
    displayName: d.displayName,
    email: d.email,
    tests: Array.from(d.tests),
    active: d.active,
    viewResults: d.viewResults
  };
  if (!d.id) { payload.username = d.username; payload.password = d.password; }
  else if (d.password) payload.password = d.password;
  try {
    if (d.id) await API.put('/api/admin/candidates/' + d.id, payload);
    else await API.post('/api/admin/candidates', payload);
    _candDraft = null;
    closeModal();
    await loadCandidates();
    toast(d.id ? 'Candidate updated' : 'Candidate created', 'success');
  } catch (e) { toast(e.message, 'error'); }
}

function confirmDeleteCandidate(id) {
  const c = S.candidates.find(x => x.id === id);
  if (!c) return;
  confirmModal({
    title: 'Remove candidate?',
    body: '@' + esc(c.username) + ' will lose access to the candidate portal immediately. Their submitted attempts are kept.',
    confirmLabel: 'Remove',
    danger: true,
    onConfirm: async () => {
      closeModal();
      try {
        await API.del('/api/admin/candidates/' + id);
        await loadCandidates();
        toast('Candidate removed');
      } catch (e) { toast(e.message, 'error'); }
    }
  });
}

/* ── Signup requests (candidate account applications) ──────── */

async function loadSignupRequests() {
  try {
    S.signupRequests = await API.get('/api/signup/requests');
  } catch (e) {
    S.signupRequests = [];
    toast(e.message, 'error');
  }
  render();
}

function vSignups() {
  const f = S.qFilters.search;
  const list = f ? S.signupRequests.filter(r => searchMatches(f, r.username, r.displayName, r.email)) : S.signupRequests;
  return '<div class="page-head">' +
    '<div><h1 class="page-title">Signup requests</h1>' +
    '<p class="page-desc">People who requested an account from the candidate portal. Approve to create their account, or reject.</p></div>' +
  '</div>' +
  (list.length ? '<div class="card">' + pgSlice('signups', list).map(signupRequestRowHTML).join('') + '</div>' + pagerHTML('signups', list.length)
    : emptyState('inbox', 'No pending requests', f ? 'No requests match your search.' : 'New requests from the candidate portal will appear here.', null, ''));
}

function signupRequestRowHTML(r) {
  const cats = (r.categories || []).slice(0, 4).map(c => '<span class="badge b-draft">' + esc(catOf(c).name) + '</span>').join('');
  const more = (r.categories || []).length > 4 ? '<span class="badge b-mcq">+' + ((r.categories || []).length - 4) + '</span>' : '';
  return '<div class="row-item">' +
    '<span class="admin-avatar" style="width:34px;height:34px;font-size:14px">' + esc((r.displayName || r.username).slice(0, 1).toUpperCase()) + '</span>' +
    '<div class="row-main">' +
      '<div class="row-title">' + esc(r.displayName || r.username) + '</div>' +
      '<div class="row-meta">@' + esc(r.username) + ' · ' + esc(r.email) + ' · requested ' + fmtDate(r.createdAt) + '</div>' +
      (cats ? '<div class="row-meta" style="margin-top:6px">' + cats + more + '</div>' : '') +
    '</div>' +
    '<div class="row-actions">' +
      '<button class="btn btn-sm btn-primary" data-action="approve-signup" data-id="' + r.id + '">' + ic('check', 13) + ' Approve</button>' +
      '<button class="btn btn-sm btn-secondary" data-action="reject-signup" data-id="' + r.id + '">' + ic('x', 13) + ' Reject</button>' +
      '<button class="btn-icon danger" data-action="delete-signup" data-id="' + r.id + '" title="Remove without emailing">' + ic('trash', 16) + '</button>' +
    '</div>' +
  '</div>';
}

function confirmApproveSignup(id) {
  const r = S.signupRequests.find(x => x.id === id);
  if (!r) return;
  confirmModal({
    title: 'Approve ' + (r.displayName || r.username) + '?',
    body: 'This creates a candidate account for @' + esc(r.username) + ' with a temporary password. The candidate will be emailed their sign-in details.',
    confirmLabel: 'Approve & create account',
    onConfirm: async () => {
      closeModal();
      try {
        const res = await API.post('/api/signup/requests/' + id + '/approve');
        await loadSignupRequests();
        openModal({
          title: 'Account created',
          body: '<p style="font-size:14.5px;color:var(--text-2);line-height:1.65">' +
            '<strong>' + esc(res.candidate.displayName || res.candidate.username) + '</strong> (@' + esc(res.candidate.username) + ') can now sign in with:</p>' +
            '<div class="temp-pass-box">' + esc(res.tempPassword) + '</div>' +
            '<p style="font-size:13.5px;color:var(--text-3);margin:12px 0 0">This password is shown once. The candidate was also emailed their credentials.</p>',
          foot: '<button class="btn btn-primary" data-action="close-modal">Done</button>'
        });
        toast('Candidate created', 'success');
      } catch (e) { toast(e.message, 'error'); }
    }
  });
}

function confirmRejectSignup(id, notify) {
  const r = S.signupRequests.find(x => x.id === id);
  if (!r) return;
  const label = notify ? 'Reject & notify' : 'Delete request';
  confirmModal({
    title: (notify ? 'Reject ' : 'Delete ') + (r.displayName || r.username) + '?',
    body: notify ? '@' + esc(r.username) + ' will be emailed that their request was not approved.' : 'Remove @' + esc(r.username) + '\u2019s request without sending an email.',
    confirmLabel: label,
    danger: true,
    onConfirm: async () => {
      closeModal();
      try {
        await API.post('/api/signup/requests/' + id + '/reject', { notify });
        await loadSignupRequests();
        toast(notify ? 'Request rejected' : 'Request removed');
      } catch (e) { toast(e.message, 'error'); }
    }
  });
}

/* ── Preview modal ─────────────────────────────────────────── */

function previewAnswerHTML(q) {
  let answer = '';
  if (q.type === 'mcq') {
    answer = q.options[q.answer] != null ? LETTERS[q.answer] + '. ' + esc(q.options[q.answer]) : '';
  } else if (q.type === 'multi') {
    answer = (q.answer || []).map(i => LETTERS[i] + '. ' + esc(q.options[i])).join(' \u00B7 ');
  } else if (q.type === 'matching') {
    answer = (q.pairs || []).map(pr => esc(pr.l) + ' \u2192 ' + esc(pr.r)).join('<br>');
  } else if (q.type === 'ordering') {
    answer = (q.ordered || []).map(esc).join(' \u2192 ');
  } else if (q.type === 'code') {
    answer = (q.testCases || []).slice(0, 2)
      .map(tc => esc(JSON.stringify(tc.args)) + ' \u2192 ' + esc(JSON.stringify(tc.expected)))
      .join(' \u00B7 ');
  } else {
    answer = esc((q.answer || []).join(' / '));
  }
  if (!answer) return '';
  return '<div class="review-line" style="margin-top:8px"><span class="lbl">Answer</span><span class="val val-correct">' + answer + '</span></div>';
}

function openPreview(id) {
  const t = S.tests.find(x => x.id === id);
  if (!t) return;
  const cats = (t.categories || []).map(catOf);
  const w = (DIFF_WEIGHTS[t.diffFocus] || DIFF_WEIGHTS.balanced);
  const pool = S.questions.filter(q => (t.categories || []).includes(q.cat) && (w[q.diff] || 0) > 0);
  const sample = shuffle(pool).slice(0, Math.min(3, t.count));
  openModal({
    title: esc(t.name),
    body:
      '<div class="test-card-meta" style="margin-bottom:14px">' +
        '<span class="meta-pill">' + ic('clock', 13) + ' ' + t.durationMin + ' min</span>' +
        '<span class="meta-pill">' + ic('layers', 13) + ' ' + t.count + ' questions</span>' +
        '<span class="meta-pill">' + ic('check', 13) + ' ' + t.passPct + '% to pass</span>' +
      '</div>' +
      '<div class="test-card-chips" style="margin-bottom:18px">' +
        cats.map(c => '<span class="badge b-mcq">' + catIconHTML(c, 11) + ' ' + esc(c.name) + '</span>').join('') +
      '</div>' +
      '<div class="section-label">Sample questions (first ' + sample.length + ' of ' + t.count + ')</div>' +
      sample.map(q => '<div style="padding:10px 0;border-top:1px solid var(--hairline-soft)">' +
        '<div style="font-size:13.5px;font-weight:600;line-height:1.45">' + esc(q.q) + '</div>' +
        (q.code ? '<pre class="q-code" style="margin-top:8px">' + esc(q.code) + '</pre>' : '') +
        previewAnswerHTML(q) +
        '<div class="row-meta" style="margin-top:6px">' +
          '<span class="badge b-' + q.diff + '"><span class="dot"></span>' + diffOf(q.diff).name + '</span>' +
          '<span class="badge b-mcq">' + { mcq: 'Multiple choice', multi: 'Multi-select', fill: 'Fill in the blank', matching: 'Matching', ordering: 'Ordering', code: 'Coding' }[q.type] + '</span>' +
        '</div></div>').join(''),
    foot: '<button class="btn btn-secondary" data-action="close-modal">Close</button>'
  });
}
