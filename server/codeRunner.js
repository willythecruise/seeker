'use strict';
/* ============================================================
   Orion — code challenge runner
   Executes candidate code for "write-code" questions against
   test cases. Supported languages: javascript (vm sandbox),
   python (subprocess). Convention: the candidate's code must
   define a function named `solution`.
   ============================================================ */
const vm = require('vm');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const JS_TIMEOUT = 2000;
const PY_TIMEOUT = 3000;

function jsStringify(v) {
  if (v === undefined) return 'undefined';
  if (typeof v === 'function') return '[Function]';
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}

/* Run JS in a sandboxed VM context (no require/process). Returns { ok, value } */
function runJS(code, args) {
  const sandbox = {};
  vm.createContext(sandbox);
  const src = String(code) + '\n;globalThis.__orionOut = solution(...' + JSON.stringify(args) + ');';
  vm.runInContext(src, sandbox, { timeout: JS_TIMEOUT });
  return { ok: true, value: sandbox.__orionOut };
}

/* Run Python via subprocess with a timeout. Returns { ok, value } */
function runPy(code, args) {
  const harness =
    String(code) + '\n' +
    'import sys, json\n' +
    'print(json.dumps(solution(*json.loads(sys.argv[1]))))\n';
  const tmp = path.join(os.tmpdir(), 'orion-py-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.py');
  fs.writeFileSync(tmp, harness, 'utf8');
  try {
    const r = spawnSync('python3', [tmp, JSON.stringify(args)], { timeout: PY_TIMEOUT, maxBuffer: 2 * 1024 * 1024, encoding: 'utf8' });
    if (r.error) {
      if (r.error.code === 'ETIMEDOUT' || r.signal) return { ok: false, error: 'Execution timed out (3s)' };
      return { ok: false, error: 'Failed to run python3: ' + r.error.message };
    }
    if (r.status !== 0) {
      const msg = (r.stderr || '').trim().split('\n').pop() || 'Runtime error';
      return { ok: false, error: msg.slice(0, 200) };
    }
    const out = (r.stdout || '').trim();
    return { ok: true, value: JSON.parse(out) };
  } finally {
    try { fs.unlinkSync(tmp); } catch (e) {}
  }
}

/* Run one test case. args/expected come from the question. */
function runCase(lang, code, args, expected) {
  try {
    const res = lang === 'python' ? runPy(code, args) : runJS(code, args);
    if (!res.ok) return { pass: false, error: res.error };
    const got = jsStringify(res.value);
    const want = jsStringify(expected);
    return { pass: got === want, got: got.slice(0, 400), want: want.slice(0, 400) };
  } catch (e) {
    const msg = (e && e.message) || String(e);
    return { pass: false, error: msg.slice(0, 200) };
  }
}

/* Grade a code submission against all its test cases.
   Returns { passed, total, correct, detail } where detail describes
   the first failing case (for review). */
function gradeCode(code, testCases, lang) {
  if (!code || !String(code).trim()) return { passed: 0, total: 0, correct: null, detail: 'No code submitted' };
  const cases = Array.isArray(testCases) ? testCases : [];
  if (!cases.length) return { passed: 0, total: 0, correct: false, detail: 'No test cases' };
  const language = lang || 'javascript';
  let passed = 0;
  let detail = '';
  for (const tc of cases) {
    const r = runCase(language, code, tc.args, tc.expected);
    if (r.pass) { passed++; continue; }
    if (!detail) {
      detail = 'Test case failed' +
        (r.error ? ': ' + r.error : ' — expected ' + r.want + ', got ' + r.got);
    }
  }
  return { passed, total: cases.length, correct: passed === cases.length, detail: detail || 'All tests passed' };
}

module.exports = { gradeCode, runCase };
