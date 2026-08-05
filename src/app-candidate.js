/* ============================================================
   Orion — candidate portal: test list, timed runner, results
   (questions, answers and grading all live on the server)
   ============================================================ */

function normalizeAttempt(att) {
  if (!att) return att;
  if (!att.answers) att.answers = {};
  if (!Array.isArray(att.flagged)) att.flagged = (att.order || []).map(() => false);
  if (!att.optionOrder) att.optionOrder = {};
  if (att.remaining == null && att.remainingSec != null) att.remaining = att.remainingSec;
  if (att.remaining == null) att.remaining = att.durationSec || 0;
  if (att.leaves == null) att.leaves = 0;
  return att;
}

async function refreshCandidate() {
  if (!API.candToken) {
    S.candAuth = null;
    S.pubTests = [];
    S.live = null;
    S.liveQuestions = {};
    render();
    return;
  }
  try {
    const [me, tests, active] = await Promise.all([
      API.get('/api/candidate/me'),
      API.get('/api/candidate/tests'),
      API.get('/api/candidate/attempts/active')
    ]);
    S.candAuth = me.user;
    S.pubTests = tests;
    if (active.attempt) {
      S.live = normalizeAttempt(active.attempt);
      S.liveQuestions = active.questions || {};
      buildQPool(Object.values(S.liveQuestions));
      S.qIdx = 0;
    } else {
      S.live = null;
      S.liveQuestions = {};
    }
  } catch (e) {
    S.pubTests = [];
    S.live = null;
    S.liveQuestions = {};
    if (e.status === 401) {
      S.candAuth = null;
    } else {
      toast('Cannot reach the server', 'error');
    }
  }
  render();
}

function candidateShell() {
  if (!S.candAuth) return '<div class="auth-page">' + themeFabHTML() + vCandidateLogin() + modalHTML() + '</div>';
  return sidebarHTML([['home', 'Tests', 'doc']], 'candidate') +
    '<div class="app-main">' +
      '<header class="topbar">' + headerHTML('candidate') + '</header>' +
      '<main class="content"><div class="container">' + candidateView() + '</div></main>' +
    '</div>' +
    modalHTML();
}

/* ── Candidate sign in ─────────────────────────────────────── */

function vCandidateLogin() {
  return '<div class="auth-screen">' +
    '<div class="auth-card card">' +
      '<div class="auth-brand"><img class="auth-logo brand-logo-img" src="' + brandLogoImgSrc() + '" alt="Seeker" width="132" height="41"></div>' +
      '<h1 class="auth-title">Candidate sign in</h1>' +
      '<p class="auth-sub">Sign in with the account your recruiter created for you.</p>' +
      '<form id="candLoginForm" data-form="candidate-login" novalidate>' +
        '<div class="auth-field">' +
          '<label class="field-label" for="candUser">Username</label>' +
          '<div class="auth-input">' + ic('user', 15) +
            '<input class="input" id="candUser" autocomplete="username" placeholder="your username" required>' +
          '</div>' +
        '</div>' +
        '<div class="auth-field">' +
          '<label class="field-label" for="candPass">Password</label>' +
          '<div class="auth-input">' + ic('key', 15) +
            '<input class="input" id="candPass" type="password" autocomplete="current-password" placeholder="••••••••" required>' +
          '</div>' +
        '</div>' +
        '<button class="btn btn-primary btn-lg" style="width:100%" type="submit">' + ic('arrowL', 15, 'rot-180') + ' Sign in</button>' +
      '</form>' +
      '<div class="auth-divider"></div>' +
      '<button class="auth-link" data-action="go-console">' + ic('gear', 15) + ' Back to console</button>' +
    '</div>' +
  '</div>';
}

async function candLogin() {
  const u = $('#candUser'), p = $('#candPass');
  const btn = u ? $('button[type="submit"]', u.closest('form')) : null;
  if (!u || !p) return;
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
  try {
    const r = await API.post('/api/candidate/login', { username: u.value, password: p.value });
    API.setCandToken(r.token);
    S.candAuth = r.user;
    S.candView = 'home';
    await refreshCandidate();
    toast('Welcome, ' + (r.user.displayName || r.user.username), 'success');
  } catch (err) {
    toast(err.message, 'error');
    S.candAuth = null;
    render();
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function candLogout() {
  try { await API.post('/api/candidate/logout'); } catch (e) {}
  stopTimer();
  API.setCandToken(null);
  S.candAuth = null;
  S.live = null;
  S.liveQuestions = {};
  S.candResult = null;
  S.candView = 'home';
  render();
  toast('Signed out');
}

function candidateView() {
  if (S.candView === 'runner' && S.live) return vRunner();
  if (S.candView === 'result' && S.candResult) return vCandidateResult();
  return vCandidateHome();
}

/* ── Candidate home ────────────────────────────────────────── */

function vCandidateHome() {
  const name = (S.candAuth && (S.candAuth.displayName || S.candAuth.username)) || 'there';
  return '<div class="page-head" style="margin-top:34px">' +
    '<div><h1 class="page-title" style="font-size:34px">Good to see you, ' + esc(name) + '</h1>' +
    '<p class="page-desc">Select one of your assigned tests. Each test is timed and graded automatically.</p></div>' +
  '</div>' +
  (S.live ? resumeCardHTML() : '') +
  (S.pubTests.length ? S.pubTests.map(candidateTestCardHTML).join('')
    : emptyState('lock', 'No tests assigned yet', 'Your administrator has not assigned any tests to you yet.', 'cand-logout', 'Sign out'));
}

function resumeCardHTML() {
  const l = S.live;
  const remaining = l.remainingSec != null ? l.remainingSec : l.remaining;
  return '<div class="card test-card" style="border:1.5px solid var(--accent-ring);box-shadow:var(--shadow)">' +
    '<div class="test-card-top">' +
      '<div><div class="test-card-title" style="display:flex;align-items:center;gap:10px">' + ic('clock', 18) + ' Test in progress</div>' +
      '<div class="test-card-desc">' + esc(l.testName) + ' — ' + countAnsweredIn(l) + ' of ' + l.order.length + ' answered · ' + fmtClock(remaining) + ' remaining</div></div>' +
      '<span class="badge b-intermediate"><span class="dot"></span>Resumable</span>' +
    '</div>' +
    '<div class="test-card-foot">' +
      '<button class="btn btn-danger-solid" data-action="discard-attempt">' + ic('trash', 14) + ' Discard</button>' +
      '<button class="btn btn-primary btn-lg" data-action="resume-attempt">' + ic('play', 15) + ' Resume test</button>' +
    '</div>' +
  '</div>';
}

function candidateTestCardHTML(t) {
  const cats = (t.categories || []).map(catOf);
  return '<div class="card test-card">' +
    '<div class="test-card-top">' +
      '<div><div class="test-card-title">' + esc(t.name) + '</div>' +
      '<div class="test-card-desc">' + esc(t.description || 'No description provided.') + '</div></div>' +
    '</div>' +
    '<div class="test-card-meta">' +
      '<span class="meta-pill">' + ic('clock', 13) + ' ' + t.durationMin + ' min</span>' +
      '<span class="meta-pill">' + ic('doc', 13) + ' ' + t.count + ' questions</span>' +
      '<span class="meta-pill">' + ic('check', 13) + ' ' + t.passPct + '% to pass</span>' +
    '</div>' +
    '<div class="test-card-chips">' +
      cats.map(c => '<span class="badge b-mcq">' + ic(c.icon, 11) + ' ' + esc(c.name) + '</span>').join('') +
    '</div>' +
    '<div class="test-card-foot">' +
      '<div style="font-size:12.5px;color:var(--text-3)">' + diffFocusLabel(t.diffFocus) + '</div>' +
      '<button class="btn btn-primary" data-action="start-test" data-id="' + t.id + '">' + ic('play', 13) + ' Start test</button>' +
    '</div>' +
  '</div>';
}

/* ── Start modal ───────────────────────────────────────────── */

function openStartModal(testId) {
  const t = S.pubTests.find(x => x.id === testId);
  if (!t) return;
  S._pendingTestId = testId;
  S.modal = {
    title: 'Start \u201C' + t.name + '\u201D',
    body:
      '<div class="test-card-meta" style="margin-bottom:16px">' +
        '<span class="meta-pill">' + ic('clock', 13) + ' ' + t.durationMin + ' min</span>' +
        '<span class="meta-pill">' + ic('doc', 13) + ' ' + t.count + ' questions</span>' +
        '<span class="meta-pill">' + ic('check', 13) + ' ' + t.passPct + '% to pass</span>' +
      '</div>' +
      '<p style="font-size:12.5px;color:var(--text-3);line-height:1.6">The timer starts when you begin. It cannot be paused during the test. The system records your attempt under ' +
      esc((S.candAuth.displayName || S.candAuth.username)) + '.</p>',
    foot: '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" data-action="begin-attempt">' + ic('play', 14) + ' Begin</button>'
  };
  render();
}

async function beginAttemptFromModal() {
  const testId = S._pendingTestId;
  if (!testId) return;
  S._pendingTestId = null;
  try {
    const { attempt, questions } = await API.post('/api/candidate/tests/' + testId + '/start');
    S.live = normalizeAttempt(attempt);
    S.liveQuestions = questions || {};
    buildQPool(Object.values(S.liveQuestions));
    S.qIdx = 0;
    S.candView = 'runner';
    closeModal();
    render();
    startTimer();
    toast('Test started', 'success');
  } catch (e) {
    toast(e.message, 'error');
    render();
  }
}

function resumeAttempt() {
  S.candView = 'runner';
  if (S.live.remainingSec != null) S.live.remaining = S.live.remainingSec;
  render();
  startTimer();
  toast('Welcome back. You have ' + fmtClock(S.live.remaining) + ' left');
}

function discardAttempt() {
  confirmModal({
    title: 'Discard this attempt?',
    body: 'The system permanently deletes your answers and remaining time.',
    confirmLabel: 'Discard',
    danger: true,
    onConfirm: async () => {
      const id = S.live && S.live.id;
      const leaves = S.live ? (S.live.leaves || 0) : 0;
      stopTimer();
      S.live = null;
      S.liveQuestions = {};
      closeModal();
      render();
      if (id) { try {     await API.post('/api/candidate/attempts/' + id + '/discard', { leaves }); } catch (e) {} }
      toast('Attempt discarded');
    }
  });
}

/* ── Timer ─────────────────────────────────────────────────── */

function startTimer() {
  stopTimer();
  updateTimerUI();
  S.timerId = setInterval(tick, 1000);
}

function stopTimer() {
  if (S.timerId) { clearInterval(S.timerId); S.timerId = null; }
}

function tick() {
  if (!S.live) { stopTimer(); return; }
  S.live.remaining = Math.max(0, (S.live.remaining || 0) - 1);
  updateTimerUI();
  if (S.live.remaining <= 0) {
    stopTimer();
    if (S.live.autoSubmit) {
      submitAttempt(true);
    } else {
      S.modal = {
        title: 'Time\u2019s up',
        body: '<p style="font-size:14.5px;color:var(--text-2);line-height:1.65">Your time has expired. Submit now to record your answers. Unanswered questions count as incorrect.</p>',
        foot: '<button class="btn btn-primary" data-action="confirm-submit">Submit now</button>'
      };
      render();
    }
  }
}

function updateTimerUI() {
  const els = $$('#timerDisplay');
  if (!els.length || !S.live) return;
  els.forEach(el => {
    el.innerHTML = ic('clock', 15) + ' ' + fmtClock(S.live.remaining);
    el.className = 'timer' + (S.live.remaining <= 60 ? ' danger' : S.live.remaining <= 300 ? ' warn' : '');
  });
}

/* ── Runner ────────────────────────────────────────────────── */

function vRunner() {
  const l = S.live;
  const q = qOf(l.order[S.qIdx]);
  if (!q) return '';
  const idx = S.qIdx, total = l.order.length;
  const answered = countAnsweredIn(l);

  return '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin:20px 0 18px;flex-wrap:wrap">' +
    '<div>' +
      '<div style="font-size:13px;color:var(--text-3);font-weight:650;display:flex;align-items:center;gap:7px">' + ic('doc', 13) + ' ' + esc(l.testName) + '</div>' +
      '<div style="font-size:12.5px;color:var(--text-3);margin-top:3px">Question ' + (idx + 1) + ' of ' + total + '</div>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">' +
      '<div class="progress"><div class="progress-fill" id="progFill" style="width:' + (total ? Math.round(answered / total * 100) : 0) + '%"></div></div>' +
      '<span id="answeredCount" style="font-size:12.5px;color:var(--text-2);font-weight:600;font-variant-numeric:tabular-nums">' + answered + '/' + total + ' answered</span>' +
      '<span class="timer" id="timerDisplay">' + ic('clock', 15) + ' ' + fmtClock(l.remaining) + '</span>' +
    '</div>' +
  '</div>' +

  '<div class="runner">' +
    '<div class="card q-card">' +
      '<div class="q-head">' +
        '<div class="q-badges">' +
          '<span class="badge b-' + q.diff + '"><span class="dot"></span>' + diffOf(q.diff).name + '</span>' +
          '<span class="badge b-mcq">' + ic(catOf(q.cat).icon, 11) + ' ' + esc(catOf(q.cat).name) + '</span>' +
          '<span class="badge ' + (q.type === 'mcq' ? 'b-mcq' : 'b-fill') + '">' + (q.type === 'mcq' ? 'Multiple choice' : 'Fill in the blank') + '</span>' +
        '</div>' +
        '<button class="flag-btn ' + (l.flagged[idx] ? 'flagged' : '') + '" id="flagBtn" data-action="flag">' + ic('flag', 14) + ' <span id="flagLabel">' + (l.flagged[idx] ? 'Flagged' : 'Flag for review') + '</span></button>' +
      '</div>' +
      questionTextHTML(q) +
      (q.type === 'mcq' || q.type === 'multi' ? runnerOptsHTML(q, l.answers[q.id]) : q.type === 'matching' ? runnerMatchingHTML(q, l.answers[q.id]) : q.type === 'ordering' ? runnerOrderingHTML(q, l.answers[q.id]) : q.type === 'code' ? runnerCodeHTML(q, l.answers[q.id]) : runnerFillHTML(l.answers[q.id])) +
      '<div class="q-nav">' +
        '<button class="btn btn-secondary" data-action="prev-q" ' + (idx === 0 ? 'disabled' : '') + '>' + ic('arrowL', 15) + ' Previous</button>' +
        '<span class="hint-keys">1\u20134 answer · F flag</span>' +
        (idx < total - 1
          ? '<button class="btn btn-primary" data-action="next-q">Next ' + ic('chevronR', 15) + '</button>'
          : '<button class="btn btn-primary" data-action="ask-submit">' + ic('check', 14) + ' Submit test</button>') +
      '</div>' +
    '</div>' +

    '<aside class="card side-card">' +
      '<div class="side-title">Question navigator</div>' +
      '<div class="palette" id="palette">' +
        l.order.map((qid, i) => {
          const v = l.answers[qid];
          const has = v !== undefined && v !== null && v !== '';
          return '<button class="palette-item ' + (has ? 'answered' : '') + ' ' + (i === idx ? 'current' : '') + ' ' + (l.flagged[i] ? 'flagged' : '') + '" data-action="jump" data-idx="' + i + '" aria-label="Question ' + (i + 1) + '">' + (i + 1) + '</button>';
        }).join('') +
      '</div>' +
      '<div class="legend">' +
        '<div class="legend-item"><span class="legend-swatch ls-answered"></span> Answered</div>' +
        '<div class="legend-item"><span class="legend-swatch ls-current"></span> Current</div>' +
        '<div class="legend-item"><span class="legend-swatch ls-flagged"></span> Flagged</div>' +
        '<div class="legend-item"><span class="legend-swatch ls-unanswered"></span> Unanswered</div>' +
      '</div>' +
      '<div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">' +
        '<button class="btn btn-primary" style="width:100%" data-action="ask-submit">' + ic('check', 14) + ' Submit test</button>' +
        '<button class="btn btn-secondary" style="width:100%" data-action="leave-test">' + ic('logout', 14) + ' Leave &amp; save</button>' +
      '</div>' +
    '</aside>' +
  '</div>';
}

function runnerOptsHTML(q, val) {
  if (q.type === 'multi') {
    const sel = Array.isArray(val) ? val : [];
    return '<div class="opts" aria-label="Answer options (choose all that apply)">' +
      q.options.map((o, i) =>
        '<button class="opt ' + (sel.includes(i) ? 'selected' : '') + '" data-action="opt" data-opt="' + i + '" role="checkbox" aria-checked="' + sel.includes(i) + '">' +
          '<span class="opt-key">' + LETTERS[i] + '</span><span>' + esc(o) + '</span>' +
          '<span class="opt-multi-mark" style="margin-left:auto;display:grid;place-items:center;color:' + (sel.includes(i) ? 'var(--accent)' : 'var(--text-3)') + '">' + ic('check', 14) + '</span>' +
        '</button>').join('') +
    '</div>';
  }
  return '<div class="opts" role="radiogroup" aria-label="Answer options">' +
    q.options.map((o, i) =>
      '<button class="opt ' + (val === i ? 'selected' : '') + '" data-action="opt" data-opt="' + i + '" role="radio" aria-checked="' + (val === i) + '">' +
        '<span class="opt-key">' + LETTERS[i] + '</span><span>' + esc(o) + '</span>' +
      '</button>').join('') +
  '</div>';
}

function runnerMatchingHTML(q, val) {
  const sel = Array.isArray(val) ? val : [];
  return '<div class="match-grid">' +
    (q.pairsLeft || []).map((left, i) =>
      '<div class="match-row">' +
        '<span class="match-left">' + esc(left) + '</span>' +
        '<select class="input match-select" data-action="match" data-i="' + i + '" aria-label="Match for: ' + esc(left) + '">' +
          '<option value="">— choose —</option>' +
          q.options.map((o, oi) => '<option value="' + oi + '" ' + (sel[i] === oi ? 'selected' : '') + '>' + esc(o) + '</option>').join('') +
        '</select>' +
      '</div>').join('') +
  '</div>';
}

function runnerOrderingHTML(q, val) {
  const items = q.items || [];
  const order = Array.isArray(val) && val.length === items.length ? val.slice() : items.map((_, i) => i);
  return '<div class="order-list" id="orderList">' +
    order.map((itemIdx, pos) =>
      '<div class="order-row" data-pos="' + pos + '">' +
        '<span class="order-num">' + (pos + 1) + '</span>' +
        '<span class="order-item">' + esc(items[itemIdx]) + '</span>' +
        '<button class="btn-icon order-btn" data-action="order-move" data-dir="-1" data-pos="' + pos + '" ' + (pos === 0 ? 'disabled' : '') + ' title="Move up">' + ic('chevronD', 15) + '</button>' +
        '<button class="btn-icon order-btn" data-action="order-move" data-dir="1" data-pos="' + pos + '" ' + (pos === order.length - 1 ? 'disabled' : '') + ' title="Move down">' + ic('chevronR', 15) + '</button>' +
      '</div>').join('') +
  '</div>';
}

function runnerCodeHTML(q, val) {
  const code = val || q.codeStub || '';
  return '<div class="code-box">' +
    '<div class="code-box-head">' +
      '<span class="badge b-mcq">' + ic('terminal2', 11) + ' ' + esc(q.codeLang === 'python' ? 'Python' : 'JavaScript') + '</span>' +
      '<span style="font-size:12px;color:var(--text-3)">Define <b>solution</b>. Press Run to test against the sample</span>' +
    '</div>' +
    '<textarea class="code-editor" id="codeEditor" data-action="code" spellcheck="false" autocapitalize="off" autocomplete="off">' + esc(code) + '</textarea>' +
    '<div class="code-box-foot">' +
      '<button class="btn btn-secondary btn-sm" data-action="run-code">' + ic('play', 13) + ' Run sample</button>' +
      '<span id="codeOut" class="code-out"></span>' +
    '</div>' +
  '</div>';
}

function runnerFillHTML(val) {
  return '<input class="fill-input" id="fillInput" data-action="fill" placeholder="Type your answer\u2026" value="' + esc(val || '') + '" autocomplete="off" autocapitalize="off" spellcheck="false">';
}

/* ── Runner interactions ───────────────────────────────────── */

function selectOpt(i) {
  if (!S.live) return;
  const q = qOf(S.live.order[S.qIdx]);
  if (!q || (q.type !== 'mcq' && q.type !== 'multi')) return;
  if (q.type === 'multi') {
    const sel = Array.isArray(S.live.answers[q.id]) ? S.live.answers[q.id].slice() : [];
    const at = sel.indexOf(i);
    if (at >= 0) sel.splice(at, 1); else sel.push(i);
    sel.sort((a, b) => a - b);
    S.live.answers[q.id] = sel;
    $$('.opts .opt').forEach(o => {
      const on = sel.includes(+o.dataset.opt);
      o.classList.toggle('selected', on);
      o.setAttribute('aria-checked', on);
      const mark = o.querySelector('.opt-multi-mark');
      if (mark) mark.style.color = on ? 'var(--accent)' : 'var(--text-3)';
    });
    $$('#palette .palette-item').forEach(b => { if (+b.dataset.idx === S.qIdx) b.classList.toggle('answered', sel.length > 0); });
  } else {
    S.live.answers[q.id] = i;
    $$('#palette .palette-item').forEach(b => { if (+b.dataset.idx === S.qIdx) b.classList.add('answered'); });
    $$('.opts .opt').forEach(o => {
      o.classList.toggle('selected', +o.dataset.opt === i);
      o.setAttribute('aria-checked', +o.dataset.opt === i);
    });
  }
  updateRunnerCounters();
  saveAnswerToServer(q.id, S.live.answers[q.id]);
}

let _fillTimer = null;
function handleFillInput(el) {
  if (!S.live) return;
  const q = qOf(S.live.order[S.qIdx]);
  if (!q || q.type !== 'fill') return;
  S.live.answers[q.id] = el.value;
  $$('#palette .palette-item').forEach(b => {
    if (+b.dataset.idx === S.qIdx) b.classList.toggle('answered', el.value.trim() !== '');
  });
  updateRunnerCounters();
  clearTimeout(_fillTimer);
  _fillTimer = setTimeout(() => saveAnswerToServer(q.id, el.value), 400);
}

async function saveAnswerToServer(qid, value) {
  if (!S.live) return;
  try {
    await API.post('/api/candidate/attempts/' + S.live.id + '/answer', { qid, value });
  } catch (e) {
    if (e.status === 409) { toast('This attempt was already submitted', 'error'); }
    else if (e.status === 400) { toast(e.message, 'error'); }
    else { toast('Answer not saved: ' + e.message, 'error'); }
  }
}

function handleMatchSelect(i, optIdx) {
  if (!S.live) return;
  const q = qOf(S.live.order[S.qIdx]);
  if (!q || q.type !== 'matching') return;
  const arr = Array.isArray(S.live.answers[q.id]) ? S.live.answers[q.id].slice() : (q.pairsLeft || []).map(() => -1);
  arr[i] = optIdx === '' ? -1 : +optIdx;
  S.live.answers[q.id] = arr;
  $$('#palette .palette-item').forEach(b => { if (+b.dataset.idx === S.qIdx) b.classList.toggle('answered', arr.some(v => v !== -1 && v !== '')); });
  updateRunnerCounters();
  saveAnswerToServer(q.id, arr);
}

function moveOrderItem(pos, dir) {
  if (!S.live) return;
  const q = qOf(S.live.order[S.qIdx]);
  if (!q || q.type !== 'ordering') return;
  const items = q.items || [];
  const cur = Array.isArray(S.live.answers[q.id]) && S.live.answers[q.id].length === items.length ? S.live.answers[q.id].slice() : items.map((_, i) => i);
  const np = pos + dir;
  if (np < 0 || np >= cur.length) return;
  [cur[pos], cur[np]] = [cur[np], cur[pos]];
  S.live.answers[q.id] = cur;
  updateRunnerCounters();
  saveAnswerToServer(q.id, cur);
  // re-render the list in place
  const wrap = $('#orderList');
  if (wrap) wrap.outerHTML = runnerOrderingHTML(q, cur);
}

function handleCodeInput(el) {
  if (!S.live) return;
  const q = qOf(S.live.order[S.qIdx]);
  if (!q || q.type !== 'code') return;
  S.live.answers[q.id] = el.value;
  $$('#palette .palette-item').forEach(b => { if (+b.dataset.idx === S.qIdx) b.classList.toggle('answered', el.value.trim() !== ''); });
  updateRunnerCounters();
  clearTimeout(_fillTimer);
  _fillTimer = setTimeout(() => saveAnswerToServer(q.id, el.value), 400);
}

async function runCode() {
  if (!S.live) return;
  const q = qOf(S.live.order[S.qIdx]);
  if (!q || q.type !== 'code') return;
  const code = ($('#codeEditor') || {}).value || '';
  if (!code.trim()) { toast('Write code first', 'error'); return; }
  const out = $('#codeOut');
  if (out) out.textContent = 'Running…';
  try {
    const r = await API.post('/api/candidate/attempts/' + S.live.id + '/run-code', {
      qid: q.id, code: code, args: q.sample ? q.sample.args : [], expected: q.sample ? q.sample.expected : null
    });
    if (out) {
      if (r.pass) out.textContent = '✓ Passed — got ' + (r.got !== undefined ? r.got : 'expected');
      else if (r.error) out.textContent = '✗ ' + r.error;
      else out.textContent = '✗ Expected ' + r.want + ', got ' + r.got;
    }
  } catch (e) {
    if (out) out.textContent = '✗ ' + e.message;
  }
}

function toggleFlag() {
  if (!S.live) return;
  S.live.flagged[S.qIdx] = !S.live.flagged[S.qIdx];
  const btn = $('#flagBtn'), label = $('#flagLabel');
  if (btn) { btn.classList.toggle('flagged', S.live.flagged[S.qIdx]); if (label) label.textContent = S.live.flagged[S.qIdx] ? 'Flagged' : 'Flag for review'; }
  $$('#palette .palette-item').forEach(b => { if (+b.dataset.idx === S.qIdx) b.classList.toggle('flagged', S.live.flagged[S.qIdx]); });
  API.post('/api/candidate/attempts/' + S.live.id + '/flag', { idx: S.qIdx, flagged: S.live.flagged[S.qIdx] }).catch(() => {});
}

function updateRunnerCounters() {
  if (!S.live) return;
  const total = S.live.order.length;
  const answered = countAnsweredIn(S.live);
  const c = $('#answeredCount');
  if (c) c.textContent = answered + '/' + total + ' answered';
  const pf = $('#progFill');
  if (pf) pf.style.width = (total ? Math.round(answered / total * 100) : 0) + '%';
}

function navQ(dir) {
  if (!S.live) return;
  const next = S.qIdx + dir;
  if (next < 0 || next >= S.live.order.length) return;
  S.qIdx = next;
  render();
}

function jumpTo(i) {
  if (!S.live || i < 0 || i >= S.live.order.length) return;
  S.qIdx = i;
  render();
}

function leaveTest() {
  stopTimer();
  S.candView = 'home';
  render();
  toast('Progress saved. You can resume the test later');
}

function askSubmit() {
  if (!S.live) return;
  const total = S.live.order.length;
  const answered = countAnsweredIn(S.live);
  const unanswered = total - answered;
  confirmModal({
    title: 'Submit this test?',
    body: 'You have answered <b>' + answered + '</b> of <b>' + total + '</b> questions' +
      (unanswered ? ' — <b>' + unanswered + '</b> unanswered question' + (unanswered > 1 ? 's' : '') + ' count as incorrect.' : '.') +
      ' You have <b>' + fmtClock(S.live.remaining) + '</b> left.',
    confirmLabel: 'Submit test',
    onConfirm: () => { closeModal(); submitAttempt(false); }
  });
}

async function submitAttempt(auto) {
  stopTimer();
  const att = S.live;
  if (!att) return;
  try {
    const { attempt, questions } = await API.post('/api/candidate/attempts/' + att.id + '/submit', { leaves: att.leaves || 0 });
    S.candResult = normalizeAttempt(attempt);
    S.live = null;
    S.liveQuestions = {};
    buildQPool(Object.values(questions || {}));
    S.candView = 'result';
    render();
    toast(auto ? 'Time is up. Test submitted' : 'Test submitted', 'success');
  } catch (e) {
    toast(e.message, 'error');
    if (e.status === 409) { S.live = null; S.candView = 'home'; render(); }
    else { startTimer(); }
  }
}

/* ── Candidate results ─────────────────────────────────────── */

function vCandidateResult() {
  const rec = S.candResult;
  if (!rec) return '';
  const passed = rec.passed;
  const color = passed ? 'var(--green)' : 'var(--red)';
  const used = rec.durationSec - (rec.remainingSec != null ? rec.remainingSec : rec.durationSec);
  return '<div class="card result-hero">' +
    '<div class="ring-wrap">' +
      '<svg width="168" height="168" viewBox="0 0 168 168">' +
        '<circle class="ring-bg" cx="84" cy="84" r="74"/>' +
        '<circle class="ring-fg" id="ringFg" cx="84" cy="84" r="74" stroke="' + color + '" stroke-dasharray="464.96" stroke-dashoffset="464.96"/>' +
      '</svg>' +
      '<div class="ring-label"><div><div class="ring-value">' + rec.pct + '%</div><div class="ring-sub">score</div></div></div>' +
    '</div>' +
    '<div>' +
      '<span class="result-verdict ' + (passed ? 'b-pass' : 'b-fail') + '">' + ic(passed ? 'check' : 'x', 14) + ' ' + (passed ? 'Passed' : 'Not passed') + '</span>' +
      '<div style="margin-top:8px;font-size:14px;color:var(--text-2)">' + esc(rec.candidate) + ' · ' + esc(rec.testName) + '</div>' +
    '</div>' +
    '<div class="result-stats">' +
      '<div class="result-stat"><div class="result-stat-val">' + rec.correct + '/' + rec.total + '</div><div class="result-stat-lbl">Correct</div></div>' +
      '<div class="result-stat"><div class="result-stat-val">' + fmtMins(used) + '</div><div class="result-stat-lbl">Time used</div></div>' +
      '<div class="result-stat"><div class="result-stat-val">' + rec.passPct + '%</div><div class="result-stat-lbl">Pass mark</div></div>' +
    '</div>' +
    '<div style="margin-top:22px;display:flex;gap:10px;justify-content:center">' +
      '<button class="btn btn-secondary" data-action="back-home">' + ic('arrowL', 15) + ' All tests</button>' +
    '</div>' +
  '</div>' +

  '<div class="card card-pad" style="margin-top:16px">' +
    '<div class="section-label">Performance by category</div>' +
    breakdownHTML(rec.byCat) +
  '</div>' +

  (rec.showAnswers !== false ? '<div class="card" style="margin-top:16px">' +
    '<div style="padding:18px 24px 8px"><div class="section-label" style="margin-bottom:8px">Answer review</div></div>' +
    reviewHTML(rec) +
  '</div>' : '');
}

async function backToHome() {
  S.candView = 'home';
  S.candResult = null;
  render();
  await refreshCandidate();
}

function animateRing() {
  const el = $('#ringFg');
  if (!el || !S.candResult) return;
  const rec = S.candResult;
  const C = 464.96; // 2 * PI * 74
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.3,0.9,0.4,1)';
      el.style.strokeDashoffset = String(C * (1 - rec.pct / 100));
    });
  });
}
