/* ============================================================
   Orion — init: boot, data loading, event delegation
   ============================================================ */

async function refreshAuth() {
  try {
    const r = await API.get('/api/auth/me');
    S.auth = r.admin;
    return true;
  } catch (e) {
    S.auth = null;
    return false;
  }
}

async function loadAdminData() {
  try {
    const [stats, questions, tests, attempts] = await Promise.all([
      API.get('/api/admin/stats'),
      API.get('/api/admin/questions'),
      API.get('/api/admin/tests'),
      API.get('/api/admin/attempts')
    ]);
    S.stats = stats;
    S.questions = questions;
    S.tests = tests;
    S.attempts = attempts;
    buildQPool(questions);
    if (S.auth && S.auth.role === 'superadmin') {
      try { S.admins = await API.get('/api/admin/admins'); } catch (e) { S.admins = []; }
    }
    try { S.candidates = await API.get('/api/admin/candidates'); } catch (e) { S.candidates = []; }
    try { S.signupRequests = await API.get('/api/signup/requests'); } catch (e) { S.signupRequests = []; }
  } catch (e) {
    if (e.status === 401) {
      S.auth = null;
      S.view = 'login';
    } else {
      toast(e.message, 'error');
    }
  }
  render();
}

/* ── Render dispatcher ─────────────────────────────────────── */

function render() {
  const app = $('#app');
  if (!app) return;
  app.innerHTML = S.mode === 'candidate' ? candidateShell() : consoleShell();
  postRender();
}

function postRender() {
  positionSeg('#modeSeg', '#modeThumb', S.mode === 'candidate' ? 1 : 0);

  if (S.mode === 'console' && !S.auth) {
    checkBootstrap();
    return;
  }
  if (S.mode === 'console' && S.tab === 'editor' && tDraft) {
    positionSeg('#diffSeg', '#diffThumb', ['beginner', 'balanced', 'advanced'].indexOf(tDraft.diffFocus));
  }
  if (S.mode === 'console' && S.tab === 'questions') {
    const ci = ['all'].concat(CATS.map(c => c.id)).indexOf(S.qFilters.cat);
    const di = ['all', 'beginner', 'intermediate', 'advanced'].indexOf(S.qFilters.diff);
    const ti = ['all', 'mcq', 'multi', 'fill'].indexOf(S.qFilters.type);
    positionSeg('#catSeg', '#catThumb', ci);
    positionSeg('#diffSeg2', '#diffThumb2', di);
    positionSeg('#typeSeg', '#typeThumb', ti);
    if (S._focusSearch === 'local') {
      const inp = $('#qSearch');
      if (inp) { inp.focus(); const l = inp.value.length; inp.setSelectionRange(l, l); }
    }
  }
  if (S._focusSearch === 'global') {
    const inp = $('#globalSearch');
    if (inp) { inp.focus(); const l = inp.value.length; inp.setSelectionRange(l, l); }
    S._focusSearch = null;
  }
  if (S.modal && qDraft) {
    positionSeg('#qDiffSeg', '#qDiffThumb', Math.max(0, ['beginner', 'intermediate', 'advanced'].indexOf(qDraft.diff)));
    positionSeg('#qTypeSeg', '#qTypeThumb', { fill: 5, multi: 1, matching: 2, ordering: 3, mcq: 0, code: 4 }[qDraft.type] || 0);
  }
  if (S.mode === 'candidate' && S.candView === 'result') animateScore();
  if (S.mode === 'candidate' && S.candView === 'runner' && S.live) {
    const cq = qOf(S.live.order[S.qIdx]);
    if (cq && cq.type === 'code' && $('#codeLangSeg')) {
      const langs = (cq.languages && cq.languages.length) ? cq.languages : [cq.codeLang || 'javascript'];
      const ans = S.live.answers[cq.id];
      const lang = ans && typeof ans === 'object' ? ans.lang : (cq.codeLang || 'javascript');
      positionSeg('#codeLangSeg', '#codeLangThumb', Math.max(0, langs.indexOf(lang)));
    }
    updateTimerUI();
  }
}

/* ── Navigation ────────────────────────────────────────────── */

async function setMode(m) {
  if (S.mode === m) return;
  if (m === 'candidate') {
    if (S.live && S.candView === 'runner') stopTimer();
    S.mode = m;
    S.candView = 'home';
    S.candLoginView = 'login';
    render();
    await refreshCandidate();
  } else {
    S.mode = m;
    S.candView = 'home';
    if (!S.auth) {
      S.view = 'login';
      render();
    } else {
      await loadAdminData();   // refresh stats/attempts when returning to console
    }
  }
}

function setTab(t) {
  if (S.tab === 'editor' && t !== 'editor' && tDraft && (tDraft.name.trim() || tDraft.cats.size !== CATS.length)) {
    confirmModal({
      title: 'Discard draft?',
      body: 'Your unsaved test configuration will be lost.',
      confirmLabel: 'Discard',
      danger: true,
      onConfirm: () => { tDraft = null; closeModal(); setTab(t); }
    });
    return;
  }
  S.tab = t;
  if (t === 'activity') loadEvents();
  if (t === 'candidates') loadCandidates();
  if (t === 'signups') loadSignupRequests();
  render();
}

/* ── Test editor helpers ───────────────────────────────────── */

function toggleCat(cid) {
  if (!tDraft) return;
  if (tDraft.cats.has(cid)) tDraft.cats.delete(cid); else tDraft.cats.add(cid);
  clampCount();
  render();
}

function setDiffFocus(v) { if (tDraft) { tDraft.diffFocus = v; clampCount(); render(); } }

function toggleType(t) {
  if (!tDraft) return;
  if (tDraft.types.has(t)) tDraft.types.delete(t); else tDraft.types.add(t);
  clampCount();
  render();
}

function stepField(field, dir) {
  if (!tDraft) return;
  if (field === 'duration') tDraft.duration = Math.min(240, Math.max(1, tDraft.duration + dir * 5));
  if (field === 'pass') tDraft.pass = Math.min(100, Math.max(0, tDraft.pass + dir * 5));
  if (field === 'count') { tDraft.count = Math.min(eligibleQuestions().length, Math.max(1, tDraft.count + dir)); }
  render();
}

function setDraft(field, value) {
  if (!tDraft) return;
  if (field === 'name' || field === 'desc') { tDraft[field] = value; return; }
  tDraft[field] = value;
  render();
}

function closeEditor() { S.tab = 'tests'; tDraft = null; render(); }

async function duplicateTest(id) {
  try {
    await API.post('/api/admin/tests/' + id + '/duplicate');
    await loadAdminData();
    toast('Test duplicated');
  } catch (e) { toast(e.message, 'error'); }
}

async function togglePublish(id) {
  const t = S.tests.find(x => x.id === id);
  if (!t) return;
  try {
    const r = await API.patch('/api/admin/tests/' + id + '/publish', { published: !t.published });
    await loadAdminData();
    toast(r.published ? '\u201C' + r.name + '\u201D published' : '\u201C' + r.name + '\u201D moved to drafts');
  } catch (e) { toast(e.message, 'error'); }
}

function confirmDeleteTest(id) {
  const t = S.tests.find(x => x.id === id);
  if (!t) return;
  confirmModal({
    title: 'Delete test?',
    body: '\u201C' + esc(t.name) + '\u201D will be permanently removed. Attempts already submitted are kept.',
    confirmLabel: 'Delete',
    danger: true,
    onConfirm: async () => {
      closeModal();
      try {
        await API.del('/api/admin/tests/' + id);
        await loadAdminData();
        toast('Test deleted');
      } catch (e) { toast(e.message, 'error'); }
    }
  });
}

function confirmDeleteQuestion(id) {
  const q = qOf(id);
  if (!q) return;
  confirmModal({
    title: 'Delete question?',
    body: 'This question will be removed from the bank and excluded from future tests.',
    confirmLabel: 'Delete',
    danger: true,
    onConfirm: async () => {
      closeModal();
      try {
        await API.del('/api/admin/questions/' + id);
        await loadAdminData();
        toast('Question deleted');
      } catch (e) { toast(e.message, 'error'); }
    }
  });
}

function setQFilter(field, value) { S.qFilters[field] = value; render(); }

function setQDraft(field, value) {
  if (!qDraft) return;
  qDraft[field] = value;
  if (field === 'type' && value === 'fill' && !qDraft.fillans) qDraft.fillans = '';
  if (field === 'type' && value === 'multi' && !qDraft.multiSel) qDraft.multiSel = new Set();
  if (field === 'type' && value === 'multi' && qDraft.multiSel.size === 0) qDraft.multiSel = new Set([0]);
  if (field === 'type' && value === 'matching' && (!qDraft.pairs || !qDraft.pairs.length)) qDraft.pairs = [{ l: '', r: '' }, { l: '', r: '' }];
  if (field === 'type' && value === 'ordering' && (!qDraft.ordered || !qDraft.ordered.length)) qDraft.ordered = ['', '', ''];
  if (field === 'type' && value === 'code' && (!qDraft.testCases || !qDraft.testCases.length)) qDraft.testCases = [{ args: '', expected: '', hidden: false }];
  if (field === 'type' && value === 'code' && !qDraft.codeStub) qDraft.codeStub = 'function solution(args) {\n  // write your code here\n  return null;\n}';
  openModal({
    title: qDraft.id ? 'Edit question' : 'Add question',
    body: questionModalBody(qDraft),
    foot: '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" data-action="save-question">' + ic('check', 14) + ' Save question</button>',
    wide: true
  });
}

function rerenderQuestionModal() {
  openModal({
    title: qDraft.id ? 'Edit question' : 'Add question',
    body: questionModalBody(qDraft),
    foot: '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" data-action="save-question">' + ic('check', 14) + ' Save question</button>',
    wide: true
  });
}

function setQDraftField(el) {
  if (!qDraft) return;
  const f = el.dataset.qdraft;
  if (f === 'opt') { qDraft.options[+el.dataset.i] = el.value; return; }
  if (f === 'fillans') { qDraft.fillans = el.value; return; }
  qDraft[f] = el.value;
}

/* ── Review toggle ─────────────────────────────────────────── */

function toggleReview(i) {
  const item = $$('.review-item')[i];
  if (item) item.classList.toggle('open');
}

/* ── Event delegation ──────────────────────────────────────── */

function onClick(e) {
  if (e.target.closest('[data-action="overlay-close"]') && e.target === e.target.closest('.modal-overlay')) {
    closeModal();
    return;
  }
  const el = e.target.closest('[data-action]');
  if (!el) {
    const menu = $('.user-menu.open');
    if (menu) { menu.classList.remove('open'); const chip = $('.user-chip'); if (chip) chip.setAttribute('aria-expanded', 'false'); }
    return;
  }
  const act = el.dataset.action;
  const val = el.dataset.value;
  const id = el.dataset.id;

  switch (act) {
    /* shell / navigation */
    case 'brand': S.mode = 'console'; S.tab = 'dashboard'; S.candView = 'home'; if (!S.auth) S.view = 'login'; render(); break;
    case 'mode': setMode(val); break;
    case 'tab': setTab(val); break;
    case 'cand-nav': S.candView = val; render(); break;
    case 'logout': logout(); break;
    case 'change-password': openPasswordModal(); break;
    case 'save-password': savePassword(); break;
    case 'sidebar-open':
      $('#sidebar').classList.add('open');
      $('#sidebarOverlay').classList.add('show');
      break;
    case 'sidebar-close':
      $('#sidebar').classList.remove('open');
      $('#sidebarOverlay').classList.remove('show');
      break;
    case 'user-menu':
    case 'cand-user-menu':
      const menu = el.nextElementSibling;
      const open = menu.classList.toggle('open');
      el.setAttribute('aria-expanded', open);
      break;

    /* auth */
    case 'show-register': S.view = 'register'; render(); break;
    case 'back-to-login': S.view = 'login'; render(); break;
    case 'go-candidate': setMode('candidate'); break;
    case 'go-console': S.mode = 'console'; S.view = S.auth ? 'app' : 'login'; render(); break;
    case 'show-signup': S.candLoginView = 'request'; render(); break;
    case 'back-login': S.candLoginView = 'login'; render(); break;
    case 'signup-cat': toggleSignupCat(val); break;
    case 'cand-logout': candLogout(); break;
    case 'theme-toggle': toggleTheme(); break;

    /* console: tests */
    case 'new-test': startTestEditor(); break;
    case 'edit-test': startTestEditor(id); break;
    case 'duplicate-test': duplicateTest(id); break;
    case 'delete-test': confirmDeleteTest(id); break;
    case 'preview-test': openPreview(id); break;
    case 'editor-cancel': closeEditor(); break;
    case 'step': stepField(el.dataset.field, +el.dataset.dir); break;
    case 'toggle-cat': toggleCat(val); break;
    case 'set-diff': setDiffFocus(val); break;
    case 'toggle-type': toggleType(val); break;
    case 'save-test': saveTest(el.dataset.mode); break;

    /* console: questions */
    case 'add-question': openQuestionModal(); break;
    case 'edit-question': openQuestionModal(id); break;
    case 'delete-question': confirmDeleteQuestion(id); break;
    case 'reseed': reseedBank(); break;
    case 'qfilter': _pg.questions = 0; setQFilter(el.dataset.field, val); break;
    case 'qdiff': setQDraft('diff', val); break;
    case 'qtype': setQDraft('type', val); break;
    case 'qcorrect': setQDraft('answer', +val); break;
    case 'qmulti':
      if (qDraft) {
        const i = +val;
        if (qDraft.multiSel.has(i)) qDraft.multiSel.delete(i); else qDraft.multiSel.add(i);
        render();
        positionSeg('#qDiffSeg', '#qDiffThumb', Math.max(0, ['beginner', 'intermediate', 'advanced'].indexOf(qDraft.diff)));
        positionSeg('#qTypeSeg', '#qTypeThumb', { fill: 5, multi: 1, matching: 2, ordering: 3, mcq: 0, code: 4 }[qDraft.type] || 0);
      }
      break;
    case 'pair-add':
      if (qDraft) { qDraft.pairs.push({ l: '', r: '' }); rerenderQuestionModal(); }
      break;
    case 'pair-remove':
      if (qDraft) { qDraft.pairs.splice(+el.dataset.i, 1); if (!qDraft.pairs.length) qDraft.pairs = [{ l: '', r: '' }, { l: '', r: '' }]; rerenderQuestionModal(); }
      break;
    case 'pair-l':
      if (qDraft) { qDraft.pairs[+el.dataset.i].l = el.value; }
      break;
    case 'pair-r':
      if (qDraft) { qDraft.pairs[+el.dataset.i].r = el.value; }
      break;
    case 'order-add':
      if (qDraft) { qDraft.ordered.push(''); rerenderQuestionModal(); }
      break;
    case 'order-remove':
      if (qDraft) { qDraft.ordered.splice(+el.dataset.i, 1); if (!qDraft.ordered.length) qDraft.ordered = ['', '']; rerenderQuestionModal(); }
      break;
    case 'order-up':
      if (qDraft && +el.dataset.i > 0) { const i = +el.dataset.i; const a = qDraft.ordered; [a[i - 1], a[i]] = [a[i], a[i - 1]]; rerenderQuestionModal(); }
      break;
    case 'order-down':
      if (qDraft && +el.dataset.i < qDraft.ordered.length - 1) { const i = +el.dataset.i; const a = qDraft.ordered; [a[i + 1], a[i]] = [a[i], a[i + 1]]; rerenderQuestionModal(); }
      break;
    case 'order-item':
      if (qDraft) { qDraft.ordered[+el.dataset.i] = el.value; }
      break;
    case 'code-lang':
      if (qDraft) { qDraft.codeLang = val; rerenderQuestionModal(); }
      break;
    case 'code-stub':
      if (qDraft) { qDraft.codeStub = el.value; }
      break;
    case 'py-stub':
      if (qDraft) { qDraft.pyStub = el.value; }
      break;
    case 'toggle-code-lang':
      if (qDraft) {
        if (qDraft.languages.has(val)) qDraft.languages.delete(val); else qDraft.languages.add(val);
        if (!qDraft.languages.size) qDraft.languages.add(qDraft.codeLang || 'javascript');
        rerenderQuestionModal();
      }
      break;
    case 'tc-args':
      if (qDraft) { qDraft.testCases[+el.dataset.i].args = el.value; }
      break;
    case 'tc-expected':
      if (qDraft) { qDraft.testCases[+el.dataset.i].expected = el.value; }
      break;
    case 'tc-hidden':
      if (qDraft) { qDraft.testCases[+el.dataset.i].hidden = el.checked; }
      break;
    case 'tc-add':
      if (qDraft) { qDraft.testCases.push({ args: '', expected: '', hidden: false }); rerenderQuestionModal(); }
      break;
    case 'tc-remove':
      if (qDraft) { qDraft.testCases.splice(+el.dataset.i, 1); if (!qDraft.testCases.length) qDraft.testCases = [{ args: '', expected: '', hidden: false }]; rerenderQuestionModal(); }
      break;
    case 'save-question': saveQuestion(); break;

    /* console: results */
    case 'view-attempt': openAttempt(id); break;
    case 'force-submit': forceSubmit(id); break;

    /* console: admins */
    case 'add-admin': openAddAdminModal(); break;
    case 'new-admin-role':
      _newAdminRole = val;
      $$('#newRoleSeg .seg-item').forEach(b => b.classList.toggle('active', b.dataset.value === val));
      positionSeg('#newRoleSeg', '#newRoleThumb', val === 'superadmin' ? 1 : 0);
      break;
    case 'save-admin': saveNewAdmin(); break;
    case 'delete-admin': confirmDeleteAdmin(id); break;

    /* console: candidates */
    case 'add-candidate': openAddCandidateModal(); break;
    case 'edit-candidate': openEditCandidateModal(id); break;
    case 'save-candidate': saveCandidate(); break;
    case 'delete-candidate': confirmDeleteCandidate(id); break;
    case 'pg': _pg[el.dataset.key] = +el.dataset.pg; render(); break;

    /* console: signup requests */
    case 'approve-signup': confirmApproveSignup(id); break;
    case 'reject-signup': confirmRejectSignup(id, true); break;
    case 'delete-signup': confirmRejectSignup(id, false); break;

    /* modals */
    case 'close-modal': closeModal(); break;
    case 'modal-confirm': if (modalConfirmCb) modalConfirmCb(); break;

    /* candidate: home */
    case 'start-test': openStartModal(id); break;
    case 'begin-attempt': beginAttemptFromModal(); break;
    case 'resume-attempt': resumeAttempt(); break;
    case 'discard-attempt': discardAttempt(); break;
    case 'back-home': backToHome(); break;

    /* candidate: runner */
    case 'opt': selectOpt(+el.dataset.opt); break;
    case 'match': handleMatchSelect(+el.dataset.i, el.value); break;
    case 'order-move': moveOrderItem(+el.dataset.pos, +el.dataset.dir); break;
    case 'run-code': runCode(); break;
    case 'code-lang-pick': pickCodeLang(val); break;
    case 'flag': toggleFlag(); break;
    case 'prev-q': navQ(-1); break;
    case 'next-q': navQ(1); break;
    case 'jump': jumpTo(+el.dataset.idx); break;
    case 'ask-submit': askSubmit(); break;
    case 'confirm-submit': closeModal(); submitAttempt(false); break;
    case 'leave-test': leaveTest(); break;

    /* candidate: results */
    case 'toggle-review': toggleReview(+el.dataset.idx); break;
    case 'share-results': shareResults(); break;
    case 'share-result': shareResult(); break;
  }
}

function onInput(e) {
  const el = e.target;
  if (el.id === 'signupName') { signupDraft.name = el.value; return; }
  if (el.id === 'signupEmail') { signupDraft.email = el.value; return; }
  if (el.id === 'signupUser') { signupDraft.username = el.value; checkSignupUsername(); return; }
  if (el.id === 'globalSearch') {
    S.qFilters.search = el.value.toLowerCase();
    S._focusSearch = 'global';
    if (S.mode === 'console') {
      if (S.tab === 'editor') return;
      if (S.tab === 'questions') _pg.questions = 0;
      else if (S.tab === 'tests') _pg.tests = 0;
      else if (S.tab === 'results') _pg.results = 0;
      else if (S.tab === 'activity') _pg.activity = 0;
      else if (S.tab === 'candidates') _pg.candidates = 0;
      else if (S.tab === 'signups') _pg.signups = 0;
      else if (S.tab === 'admins') _pg.admins = 0;
      render();
    } else if (S.mode === 'candidate') {
      if (S.candView === 'runner') return;
      _pg.candTests = 0; _pg.candPassed = 0; _pg.candFailed = 0;
      render();
    }
    return;
  }
  if (el.id === 'qSearch') {
    S.qFilters.search = el.value.toLowerCase();
    S._focusSearch = 'local';
    _pg.questions = 0;
    render();
    return;
  }
  if (el.dataset && (el.dataset.action === 'pair-l' || el.dataset.action === 'pair-r' || el.dataset.action === 'order-item' || el.dataset.action === 'code-stub' || el.dataset.action === 'py-stub' || el.dataset.action === 'tc-args' || el.dataset.action === 'tc-expected')) {
    if (!qDraft) return;
    if (el.dataset.action === 'pair-l') qDraft.pairs[+el.dataset.i].l = el.value;
    else if (el.dataset.action === 'pair-r') qDraft.pairs[+el.dataset.i].r = el.value;
    else if (el.dataset.action === 'order-item') qDraft.ordered[+el.dataset.i] = el.value;
    else if (el.dataset.action === 'code-stub') qDraft.codeStub = el.value;
    else if (el.dataset.action === 'py-stub') qDraft.pyStub = el.value;
    else if (el.dataset.action === 'tc-args') qDraft.testCases[+el.dataset.i].args = el.value;
    else qDraft.testCases[+el.dataset.i].expected = el.value;
    return;
  }
  if (el.dataset && el.dataset.qdraft) { setQDraftField(el); return; }
  if (el.dataset && el.dataset.draft) { setDraft(el.dataset.draft, el.type === 'checkbox' ? el.checked : el.value); return; }
  if (el.dataset && el.dataset.action === 'fill') { handleFillInput(el); return; }
  if (el.dataset && el.dataset.action === 'code') { handleCodeInput(el); return; }
}

function onChange(e) {
  const el = e.target;
  if (el.dataset && el.dataset.action === 'toggle-publish') { togglePublish(el.dataset.id); return; }
  if (el.dataset && el.dataset.action === 'cand-test-toggle') { toggleCandidateTest(el.dataset.value); return; }
  if (el.dataset && el.dataset.qdraft) { setQDraftField(el); return; }
  if (el.dataset && el.dataset.draft) { setDraft(el.dataset.draft, el.type === 'checkbox' ? el.checked : el.value); return; }
}

function onSubmit(e) {
  const form = e.target;
  if (form.dataset.form === 'login') { e.preventDefault(); doLogin(e); }
  else if (form.dataset.form === 'register') { e.preventDefault(); doRegister(e); }
  else if (form.dataset.form === 'candidate-login') { e.preventDefault(); candLogin(); }
  else if (form.dataset.form === 'candidate-signup') { e.preventDefault(); candSignupRequest(); }
}

function onKey(e) {
  if (S.mode !== 'candidate' || S.candView !== 'runner' || !S.live) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  const q = qOf(S.live.order[S.qIdx]);
  if (!q) return;
  if ((q.type === 'mcq' || q.type === 'multi') && ['1', '2', '3', '4'].includes(e.key)) { e.preventDefault(); selectOpt(+e.key - 1); }
  else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFlag(); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); navQ(1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); navQ(-1); }
}

/* ── Proctoring: count tab / window switches during a live test ── */

function onVisibility() {
  if (document.hidden && S.mode === 'candidate' && S.candView === 'runner' && S.live) {
    S.live.leaves = (S.live.leaves || 0) + 1;
  }
}

function onWindowBlur() {
  if (S.mode === 'candidate' && S.candView === 'runner' && S.live && !document.hidden) {
    S.live.leaves = (S.live.leaves || 0) + 1;
  }
}

/* ── Boot ──────────────────────────────────────────────────── */

async function boot() {
  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  document.addEventListener('submit', onSubmit);
  document.addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('blur', onWindowBlur);

  if (API.candToken) {
    S.mode = 'candidate';
    S.view = 'app';
    S.candView = 'home';
    await refreshCandidate();
  } else {
    const authed = await refreshAuth();
    if (authed) {
      S.view = 'app';
      await loadAdminData();
    } else {
      S.view = 'login';
    }
  }
  render();
}

boot();
