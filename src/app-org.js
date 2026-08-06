/* ============================================================
   Orion — organization portal: org login, candidate management,
   assigned tests, and result overview
   ============================================================ */

function orgNav() {
  return [
    ['dashboard', 'Dashboard', 'dashboard'],
    ['candidates', 'Candidates', 'users'],
    ['attempts', 'Results', 'chart'],
    ['profile', 'Profile', 'user']
  ];
}

function orgShell() {
  if (!S.orgAuth) return '<div class="auth-page">' + themeFabHTML() + vOrgLogin() + modalHTML() + '</div>';
  return sidebarHTML(orgNav(), 'org') +
    '<div class="app-main">' +
      '<header class="topbar">' + headerHTML('org') + '</header>' +
      '<main class="content"><div class="container">' + orgView() + '</div></main>' +
    '</div>' +
    modalHTML();
}

/* ── Org sign in ───────────────────────────────────────────── */

function vOrgLogin() {
  return '<div class="auth-screen">' +
    '<div class="auth-card card">' +
      '<div class="auth-brand"><img class="auth-logo brand-logo-img" src="' + brandLogoImgSrc() + '" alt="Seeker" width="132" height="41"></div>' +
      '<h1 class="auth-title">Organization sign in</h1>' +
      '<p class="auth-sub">Sign in to manage your team\u2019s candidates and assigned tests.</p>' +
      '<form id="orgLoginForm" data-form="org-login" novalidate>' +
        '<div class="auth-field">' +
          '<label class="field-label" for="orgUser">Username</label>' +
          '<div class="auth-input">' + ic('user', 15) +
            '<input class="input" id="orgUser" autocomplete="username" placeholder="your org username" required>' +
          '</div>' +
        '</div>' +
        '<div class="auth-field">' +
          '<label class="field-label" for="orgPass">Password</label>' +
          '<div class="auth-input">' + ic('key', 15) +
            '<input class="input" id="orgPass" type="password" autocomplete="current-password" placeholder="••••••••" required>' +
          '</div>' +
        '</div>' +
        '<button class="btn btn-primary btn-lg" style="width:100%" type="submit">' + ic('arrowL', 15, 'rot-180') + ' Sign in</button>' +
      '</form>' +
      '<div class="auth-divider"></div>' +
      '<button class="auth-link" data-action="go-console">' + ic('gear', 15) + ' Back to console</button>' +
    '</div>' +
  '</div>';
}

async function orgLogin() {
  const u = $('#orgUser'), p = $('#orgPass');
  const btn = u ? $('button[type="submit"]', u.closest('form')) : null;
  if (!u || !p) return;
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in\u2026'; }
  try {
    const r = await API.post('/api/org/login', { username: u.value, password: p.value });
    API.setOrgToken(r.token);
    S.orgAuth = r.org;
    S.orgView = 'dashboard';
    await refreshOrg();
    toast('Welcome, ' + (r.org.name || r.org.username), 'success');
  } catch (err) {
    toast(err.message, 'error');
    S.orgAuth = null;
    render();
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function orgLogout() {
  try { await API.post('/api/org/logout'); } catch (e) {}
  API.setOrgToken(null);
  S.orgAuth = null;
  S.orgCandidates = [];
  S.orgTests = [];
  S.orgAttempts = [];
  S.orgView = 'dashboard';
  render();
  toast('Signed out');
}

async function refreshOrg() {
  if (!API.orgToken) {
    S.orgAuth = null;
    S.orgCandidates = [];
    S.orgTests = [];
    S.orgAttempts = [];
    render();
    return;
  }
  try {
    const [me, tests, candidates, attempts] = await Promise.all([
      API.get('/api/org/me'),
      API.get('/api/org/tests'),
      API.get('/api/org/candidates'),
      API.get('/api/org/attempts')
    ]);
    S.orgAuth = me.org;
    S.orgTests = tests || [];
    S.orgCandidates = candidates || [];
    S.orgAttempts = attempts || [];
  } catch (e) {
    S.orgCandidates = [];
    S.orgTests = [];
    S.orgAttempts = [];
    if (e.status !== 401) toast(e.message, 'error');
  }
  render();
}

/* ── Org password change ───────────────────────────────────── */

function openOrgPasswordModal() {
  S.modal = {
    title: 'Change password',
    body:
      '<div class="field"><label class="field-label">Current password</label>' +
        '<input class="input" id="pwCurrent" type="password" autocomplete="current-password"></div>' +
      '<div class="field" style="margin-bottom:4px"><label class="field-label">New password</label>' +
        '<input class="input" id="pwNext" type="password" autocomplete="new-password" placeholder="Min. 6 characters"></div>',
    foot: '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" data-action="save-org-password">' + ic('check', 14) + ' Update password</button>'
  };
  render();
}

async function saveOrgPassword() {
  const cur = $('#pwCurrent'), nxt = $('#pwNext');
  if (!cur || !nxt) return;
  try {
    await API.post('/api/org/password', { current: cur.value, next: nxt.value });
    closeModal();
    toast('Password updated', 'success');
  } catch (e) { toast(e.message, 'error'); }
}

/* ── Org views ─────────────────────────────────────────────── */

function orgView() {
  if (S.orgView === 'candidates') return vOrgCandidates();
  if (S.orgView === 'attempts') return vOrgAttempts();
  if (S.orgView === 'profile') return vOrgProfile();
  return vOrgDashboard();
}

function vOrgDashboard() {
  const org = S.orgAuth || {};
  const tests = S.orgTests || [];
  const cands = S.orgCandidates || [];
  const atts = S.orgAttempts || [];
  const submitted = atts.filter(a => a.status === 'submitted');
  const passed = submitted.filter(a => a.passed);
  const passRate = submitted.length ? Math.round((passed.length / submitted.length) * 100) : 0;
  const recent = submitted.slice(0, 5);
  return '<div class="page-head">' +
    '<div><h1 class="page-title">Welcome, ' + esc(org.name || org.username || '') + '</h1>' +
    '<p class="page-desc">Manage your team\u2019s candidates and the tests they can take.</p></div>' +
    '<div class="page-actions"><button class="btn btn-primary" data-action="org-add-candidate">' + ic('plus', 15) + ' Add candidate</button></div>' +
  '</div>' +
  '<div class="stat-grid">' +
    statCard('users', 'Candidates', cands.length, 'in your organization') +
    statCard('layers', 'Assigned tests', tests.length, 'available to assign') +
    statCard('chart', 'Submitted', submitted.length, passRate + '% pass rate') +
    statCard('clock', 'In progress', atts.length - submitted.length, 'active sessions') +
  '</div>' +
  (recent.length ? '<div style="height:16px"></div>' +
    '<div class="card card-pad">' +
      '<div class="section-label">Recent results</div>' +
      recent.map(a =>
        '<div class="coverage-row">' +
          '<span class="coverage-icon">' + ic('users', 15) + '</span>' +
          '<div style="flex:1;min-width:0"><div class="coverage-name">' + esc(a.candidate) + ' <span style="color:var(--text-3);font-weight:500">\u00B7 ' + esc(a.testName) + '</span></div>' +
          '<div class="coverage-sub">' + fmtDate(a.submittedAt) + '</div></div>' +
          '<span class="badge ' + (a.passed ? 'b-pass' : 'b-fail') + '">' + (a.pct != null ? a.pct + '%' : '—') + '</span>' +
        '</div>').join('') +
    '</div>' : '');
}

function vOrgCandidates() {
  const f = S.qFilters.search;
  const list = f ? S.orgCandidates.filter(c => searchMatches(f, c.username, c.displayName, c.email)) : S.orgCandidates;
  return '<div class="page-head">' +
    '<div><h1 class="page-title">Candidates</h1>' +
    '<p class="page-desc">Add your team members and assign them the tests your organization can offer.</p></div>' +
    '<div class="page-actions"><button class="btn btn-primary" data-action="org-add-candidate">' + ic('plus', 15) + ' Add candidate</button></div>' +
  '</div>' +
  (list.length ? '<div class="card">' + pgSlice('orgCandidates', list).map(orgCandidateRowHTML).join('') + '</div>' + pagerHTML('orgCandidates', list.length)
    : emptyState('users', 'No candidates yet', f ? 'No candidates match your search.' : 'Add a candidate to give them access to your assigned tests.', 'org-add-candidate', 'Add candidate'));
}

function orgCandidateRowHTML(c) {
  const granted = (c.tests || []).length;
  return '<div class="row-item">' +
    '<span class="admin-avatar" style="width:34px;height:34px;font-size:14px">' + esc((c.displayName || c.username).slice(0, 1).toUpperCase()) + '</span>' +
    '<div class="row-main">' +
      '<div class="row-title">' + esc(c.displayName || c.username) + '</div>' +
      '<div class="row-meta">@' + esc(c.username) + (c.email ? ' \u00B7 ' + esc(c.email) : '') + ' \u00B7 joined ' + fmtDate(c.createdAt) + '</div>' +
    '</div>' +
    '<span class="badge ' + (c.active ? 'b-published' : 'b-fail') + '"><span class="dot"></span>' + (c.active ? 'Active' : 'Disabled') + '</span>' +
    '<span class="badge b-mcq">' + granted + ' test' + (granted === 1 ? '' : 's') + '</span>' +
    '<div class="row-actions">' +
      '<button class="btn btn-sm btn-secondary" data-action="org-edit-candidate" data-id="' + c.id + '">' + ic('key', 13) + ' Manage access</button>' +
      '<button class="btn-icon danger" data-action="org-delete-candidate" data-id="' + c.id + '" title="Remove candidate">' + ic('trash', 16) + '</button>' +
    '</div>' +
  '</div>';
}

let _orgCandDraft = null;

function orgCandidateModalBody(d) {
  return '<div class="field"><label class="field-label">Username</label>' +
      '<input class="input" id="orgCandUser" placeholder="e.g., ada.lovelace" autocomplete="off" ' + (d.id ? 'disabled' : '') + ' value="' + esc(d.username) + '"></div>' +
    '<div class="field"><label class="field-label">Display name <span class="field-help">Shown on the candidate\u2019s tests</span></label>' +
      '<input class="input" id="orgCandName" placeholder="e.g., Ada Lovelace" autocomplete="off" value="' + esc(d.displayName) + '"></div>' +
    '<div class="field"><label class="field-label">Email <span class="field-help">Optional</span></label>' +
      '<input class="input" id="orgCandEmail" type="email" placeholder="ada@company.com" autocomplete="off" value="' + esc(d.email) + '"></div>' +
    '<div class="field"><label class="field-label">Password <span class="field-help">' + (d.id ? 'Leave blank to keep the current one' : 'Min. 6 characters') + '</span></label>' +
      '<input class="input" id="orgCandPass" type="password" placeholder="' + (d.id ? 'Unchanged' : 'Min. 6 characters') + '" autocomplete="new-password"></div>' +
    '<div class="setting-row">' +
      '<div><div class="setting-label">Active</div><div class="setting-sub">Disabled accounts can\u2019t sign in</div></div>' +
      '<label class="switch"><input type="checkbox" id="orgCandActive" ' + (d.active ? 'checked' : '') + '><span class="track"></span><span class="thumb"></span></label>' +
    '</div>' +
    '<div class="field" style="margin-bottom:4px">' +
      '<div class="field-label">Assigned tests <span class="field-help">Only your organization\u2019s tests</span></div>' +
      (S.orgTests.length ? searchMultiHTML('orgcand-tests', S.orgTests.map(t => ({ id: t.id, name: t.name, sub: t.published ? 'Published' : 'Draft', subCls: t.published ? 'b-published' : 'b-draft' })), 'No tests available for your organization.')
        : '<p style="color:var(--text-3);font-size:13px">No tests assigned to your organization yet \u2014 contact the admin.</p>') +
    '</div>';
}

function rerenderOrgCandidateModal() {
  if (!_orgCandDraft) return;
  openModal({
    title: _orgCandDraft.id ? 'Manage access' : 'Add candidate',
    body: orgCandidateModalBody(_orgCandDraft),
    foot: '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" data-action="org-save-candidate">' + ic('check', 14) + ' ' + (_orgCandDraft.id ? 'Save changes' : 'Create candidate') + '</button>',
    wide: true
  });
}

function openOrgAddCandidateModal() {
  _orgCandDraft = { id: null, username: '', displayName: '', email: '', password: '', active: true, tests: new Set() };
  registerSM('orgcand-tests', _orgCandDraft.tests, rerenderOrgCandidateModal, null);
  rerenderOrgCandidateModal();
}

function openOrgEditCandidateModal(id) {
  const c = S.orgCandidates.find(x => x.id === id);
  if (!c) return;
  _orgCandDraft = {
    id: c.id,
    username: c.username,
    displayName: c.displayName || '',
    email: c.email || '',
    password: '',
    active: c.active !== false,
    tests: new Set(c.tests || [])
  };
  registerSM('orgcand-tests', _orgCandDraft.tests, rerenderOrgCandidateModal, null);
  rerenderOrgCandidateModal();
}

async function saveOrgCandidate() {
  if (!_orgCandDraft) return;
  const g = sel => (($(sel) || {}).value || '');
  const d = _orgCandDraft;
  d.username = g('#orgCandUser');
  d.displayName = g('#orgCandName');
  d.email = g('#orgCandEmail');
  d.password = g('#orgCandPass');
  d.active = !!((($('#orgCandActive') || {}).checked));
  if (!d.id && !/^[a-z0-9._-]{3,24}$/i.test(d.username.trim())) { toast('Username must be 3\u201324 letters, digits, dots, dashes or underscores', 'error'); return; }
  if (d.password && d.password.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
  const payload = {
    displayName: d.displayName,
    email: d.email,
    tests: Array.from(d.tests),
    active: d.active
  };
  if (!d.id) { payload.username = d.username; payload.password = d.password; }
  else if (d.password) payload.password = d.password;
  try {
    if (d.id) await API.put('/api/org/candidates/' + d.id, payload);
    else await API.post('/api/org/candidates', payload);
    _orgCandDraft = null;
    closeModal();
    await refreshOrg();
    toast(d.id ? 'Candidate updated' : 'Candidate created', 'success');
  } catch (e) { toast(e.message, 'error'); }
}

function confirmDeleteOrgCandidate(id) {
  const c = S.orgCandidates.find(x => x.id === id);
  if (!c) return;
  confirmModal({
    title: 'Remove candidate?',
    body: '@' + esc(c.username) + ' will lose access to the candidate portal immediately. Their submitted attempts are kept.',
    confirmLabel: 'Remove',
    danger: true,
    onConfirm: async () => {
      closeModal();
      try {
        await API.del('/api/org/candidates/' + id);
        await refreshOrg();
        toast('Candidate removed');
      } catch (e) { toast(e.message, 'error'); }
    }
  });
}

function vOrgAttempts() {
  const f = S.qFilters.search;
  const list = f ? S.orgAttempts.filter(a => searchMatches(f, a.candidate, a.email, a.testName)) : S.orgAttempts;
  const submitted = list.filter(a => a.status === 'submitted');
  const passed = submitted.filter(a => a.passed);
  const passRate = submitted.length ? Math.round((passed.length / submitted.length) * 100) : 0;
  return '<div class="page-head">' +
    '<div><h1 class="page-title">Results</h1>' +
    '<p class="page-desc">Attempts by your candidates, newest first.</p></div>' +
  '</div>' +
  '<div style="height:16px"></div>' +
  (submitted.length ? '<div class="card"><div class="table-wrap"><table class="tbl">' +
    '<thead><tr><th>Candidate</th><th>Test</th><th>Score</th><th>Status</th><th>Submitted</th></tr></thead><tbody>' +
    pgSlice('orgAttempts', submitted).map(orgAttemptRowHTML).join('') +
    '</tbody></table></div>' + pagerHTML('orgAttempts', submitted.length) + '</div>'
    : emptyState('chart', 'No results yet', f ? 'No results match your search.' : 'When your candidates submit a test, scores will appear here.', null, ''));
}

function orgAttemptRowHTML(a) {
  return '<tr>' +
    '<td style="font-weight:600">' + esc(a.candidate || '\u2014') +
      (a.email ? '<div style="font-weight:400;font-size:12px;color:var(--text-3)">' + esc(a.email) + '</div>' : '') + '</td>' +
    '<td style="font-size:13px">' + esc(a.testName || '\u2014') + '</td>' +
    '<td class="num"><span class="badge ' + (a.passed ? 'b-pass' : 'b-fail') + '">' + (a.pct != null ? a.pct + '%' : '—') + '</span></td>' +
    '<td><span class="badge ' + (a.passed ? 'b-published' : 'b-draft') + '"><span class="dot"></span>' + (a.passed ? 'Passed' : 'Not passed') + '</span></td>' +
    '<td class="num" style="color:var(--text-2)">' + fmtDate(a.submittedAt) + '</td>' +
  '</tr>';
}

function vOrgProfile() {
  const o = S.orgAuth || {};
  const initial = ((o.name || o.username || 'O') + '').slice(0, 1).toUpperCase();
  return '<div class="page-head">' +
    '<div><h1 class="page-title" style="font-size:28px">Organization profile</h1>' +
    '<p class="page-desc">Your organization\u2019s details in the Seeker portal.</p></div>' +
  '</div>' +
  '<div class="card card-pad" style="max-width:560px">' +
    '<div style="display:flex;align-items:center;gap:16px">' +
      '<span class="user-avatar" style="width:54px;height:54px;font-size:22px">' + esc(initial) + '</span>' +
      '<div>' +
        '<div style="font-size:19px;font-weight:700">' + esc(o.name || o.username) + '</div>' +
        '<div style="font-size:13px;color:var(--text-3)">' + esc(o.username) + (o.email ? ' \u00B7 ' + esc(o.email) : '') + '</div>' +
      '</div>' +
    '</div>' +
    '<div style="height:1px;background:var(--hairline-soft);margin:18px 0"></div>' +
    '<div class="row-item" style="padding:12px 0">' +
      '<span class="admin-avatar" style="width:30px;height:30px">' + ic('layers', 14) + '</span>' +
      '<div class="row-main"><div class="row-title">' + (o.tests || []).length + ' test' + ((o.tests || []).length === 1 ? '' : 's') + ' available</div><div class="row-meta">Tests the admin assigned to your organization</div></div>' +
    '</div>' +
    '<div class="row-item" style="padding:12px 0">' +
      '<span class="admin-avatar" style="width:30px;height:30px">' + ic('clock', 14) + '</span>' +
      '<div class="row-main"><div class="row-title">Member since ' + (o.createdAt ? fmtDate(o.createdAt) : '\u2014') + '</div><div class="row-meta">Organization account</div></div>' +
    '</div>' +
    '<div style="margin-top:18px"><button class="btn btn-danger-solid" data-action="org-logout">' + ic('logout', 14) + ' Sign out</button></div>' +
  '</div>';
}
