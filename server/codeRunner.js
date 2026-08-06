'use strict';
/* ============================================================
   Orion — code challenge runner
   Executes candidate code for "write-code" questions against test
   cases. Supported: javascript (sandboxed vm), python (subprocess).

   Conventions (LeetCode-style):
   - Candidate code defines `solution` (function OR class).
   - For linked-list/tree problems, ListNode/TreeNode classes and
     $list / $tree builders are injected; test args/expected use
     markers like {"$list": [1,2,3]} or {"$tree": [3,9,20,null,null,15,7]}.
   - For design problems, test cases use { ops, values, expected }
     where ops[0] is the constructor name and the rest are method calls.
   ============================================================ */
const vm = require('vm');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const JS_TIMEOUT = 2500;
const PY_TIMEOUT = 3500;

let PY_BIN = null;
function resolvePy() {
  if (PY_BIN) return PY_BIN;
  const candidates = process.platform === 'win32' ? ['python', 'python3'] : ['python3', 'python'];
  for (const bin of candidates) {
    const probe = spawnSync(bin, ['-c', 'import sys; print(sys.version_info[0])'], { timeout: 4000, encoding: 'utf8' });
    if (!probe.error && probe.status === 0 && /^\d/.test((probe.stdout || '').trim())) { PY_BIN = bin; return bin; }
  }
  PY_BIN = candidates[0];
  return PY_BIN;
}

/* ── JS prelude: node classes + builders + serializer ───────── */
const JS_PRELUDE = `
function ListNode(val, next) { this.val = val === undefined ? 0 : val; this.next = next === undefined ? null : next; }
function TreeNode(val, left, right) { this.val = val === undefined ? 0 : val; this.left = left === undefined ? null : left; this.right = right === undefined ? null : right; }
function $list(arr) { var d = new ListNode(0), c = d; for (var i = 0; i < arr.length; i++) { c.next = new ListNode(arr[i]); c = c.next; } return d.next; }
function $tree(arr) {
  if (!arr || !arr.length || arr[0] === null) return null;
  var root = new TreeNode(arr[0]), q = [root], i = 1;
  while (q.length && i < arr.length) {
    var n = q.shift();
    if (arr[i] !== null && arr[i] !== undefined) { n.left = new TreeNode(arr[i]); q.push(n.left); }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) { n.right = new TreeNode(arr[i]); q.push(n.right); }
    i++;
  }
  return root;
}
function $toList(h) { var out = []; while (h) { out.push(h.val); h = h.next; } return out; }
function $toTree(r) {
  if (!r) return [];
  var out = [], q = [r];
  while (q.length) {
    var n = q.shift();
    if (!n) { out.push(null); continue; }
    out.push(n.val); q.push(n.left); q.push(n.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
function $ser(v) {
  if (v && typeof v === 'object' && typeof v.val === 'number' && ('next' in v) && !('left' in v)) return $toList(v);
  if (v && typeof v === 'object' && ('left' in v) && ('right' in v)) return $toTree(v);
  if (Array.isArray(v)) return v.map($ser);
  return v;
}
`;

/* Recursively turn args (which may contain {$list}/{ $tree} markers)
   into a JS source expression. */
function argsToSource(args) {
  const esc = JSON.stringify;
  if (args && typeof args === 'object' && !Array.isArray(args)) {
    if ('$list' in args && Object.keys(args).length === 1) return '$list(' + esc(args.$list) + ')';
    if ('$tree' in args && Object.keys(args).length === 1) return '$tree(' + esc(args.$tree) + ')';
    if ('$lists' in args && Object.keys(args).length === 1) {
      return '[' + args.$lists.map(e => '$list(' + esc(e) + ')').join(',') + ']';
    }
    return '{' + Object.keys(args).map(k => esc(k) + ':' + argsToSource(args[k])).join(',') + '}';
  }
  if (Array.isArray(args)) return '[' + args.map(argsToSource).join(',') + ']';
  return esc(args);
}

/* Normalize an expected value (strip markers) for comparison. */
function normalizeExpected(v) {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    if ('$list' in v && Object.keys(v).length === 1) return v.$list;
    if ('$tree' in v && Object.keys(v).length === 1) return v.$tree;
    if ('$lists' in v && Object.keys(v).length === 1) return v.$lists;
    const o = {};
    for (const k of Object.keys(v)) o[k] = normalizeExpected(v[k]);
    return o;
  }
  if (Array.isArray(v)) return v.map(normalizeExpected);
  return v;
}

/* ── JS execution ───────────────────────────────────────────── */
function runJS(code, args, tc) {
  const sandbox = {};
  vm.createContext(sandbox);
  let harness;
  if (tc && Array.isArray(tc.ops)) {
    harness = ';globalThis.__orionOut = (function(){ var obj = new solution(...(JSON.parse(' + JSON.stringify(JSON.stringify((tc.values||[])[0]||[])) + '))); var out = []; var ops = ' +
      JSON.stringify(tc.ops) + '; var vals = ' + JSON.stringify(tc.values || []) + ';' +
      ' for (var i = 1; i < ops.length; i++) { var r = obj[ops[i]].apply(obj, vals[i] || []); out.push(r === undefined ? null : r); }' +
      ' return out; })();';
  } else {
    harness = ';globalThis.__orionOut = $ser(solution(...' + argsToSource(args) + '));';
  }
  const src = JS_PRELUDE + '\n' + String(code) + '\n' + harness;
  vm.runInContext(src, sandbox, { timeout: JS_TIMEOUT });
  return { ok: true, value: sandbox.__orionOut };
}

/* ── Python prelude + harness ───────────────────────────────── */
const PY_PRELUDE = `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
def _l(arr):
    d = ListNode(0); c = d
    for v in arr:
        c.next = ListNode(v); c = c.next
    return d.next
def _t(arr):
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0]); q = [root]; i = 1
    while q and i < len(arr):
        node = q.pop(0)
        if arr[i] is not None:
            node.left = TreeNode(arr[i]); q.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i]); q.append(node.right)
        i += 1
    return root
def _expand(a):
    if isinstance(a, dict):
        if '$list' in a: return _l(a['$list'])
        if '$tree' in a: return _t(a['$tree'])
        if '$lists' in a: return [_l(e) for e in a['$lists']]
    if isinstance(a, list):
        return [_expand(x) for x in a]
    return a
def _ser(v):
    if isinstance(v, ListNode):
        out = []
        while v is not None:
            out.append(v.val); v = v.next
        return out
    if isinstance(v, TreeNode):
        out = []; q = [v]
        while q:
            n = q.pop(0)
            if n is None:
                out.append(None); continue
            out.append(n.val); q.append(n.left); q.append(n.right)
        while out and out[-1] is None:
            out.pop()
        return out
    if isinstance(v, list):
        return [_ser(x) for x in v]
    return v
`;

function runPy(code, args, tc) {
  let harness;
  if (tc && Array.isArray(tc.ops)) {
    harness = (
      'import sys, json\n' +
      'ops = json.loads(sys.argv[1])\n' +
      'vals = json.loads(sys.argv[2])\n' +
      'obj = solution(*vals[0])\n' +
      'out = []\n' +
      'for i in range(1, len(ops)):\n' +
      '    r = getattr(obj, ops[i])(*vals[i])\n' +
      '    out.append(None if r is None else r)\n' +
      'print(json.dumps(out))\n'
    );
  } else {
    harness = (
      'import sys, json\n' +
      'args = _expand(json.loads(sys.argv[1]))\n' +
      'print(json.dumps(_ser(solution(*args))))\n'
    );
  }
  const tmp = path.join(os.tmpdir(), 'orion-py-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.py');
  const src = PY_PRELUDE + '\n' + String(code) + '\n' + harness;
  fs.writeFileSync(tmp, src, 'utf8');
  try {
    const argv = [];
    if (tc && Array.isArray(tc.ops)) {
      argv.push(JSON.stringify(tc.ops), JSON.stringify(tc.values || []));
    } else {
      argv.push(JSON.stringify(args));
    }
    const r = spawnSync(resolvePy(), [tmp].concat(argv), { timeout: PY_TIMEOUT, maxBuffer: 2 * 1024 * 1024, encoding: 'utf8' });
    if (r.error) {
      if (r.error.code === 'ETIMEDOUT' || r.signal) return { ok: false, error: 'Execution timed out (3.5s)' };
      return { ok: false, error: 'Failed to run python: ' + r.error.message };
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

/* ── Public API ─────────────────────────────────────────────── */
function runCase(lang, code, args, expected, tc) {
  try {
    const res = lang === 'python' ? runPy(code, args, tc) : runJS(code, args, tc);
    if (!res.ok) return { pass: false, error: res.error };
    const got = JSON.stringify(res.value);
    const want = JSON.stringify(normalizeExpected(expected));
    return { pass: got === want, got: (res.value === undefined ? 'undefined' : got).slice(0, 400), want: want.slice(0, 400) };
  } catch (e) {
    const msg = (e && e.message) || String(e);
    return { pass: false, error: msg.slice(0, 200) };
  }
}

function gradeCode(code, testCases, lang) {
  if (!code || !String(code).trim()) return { passed: 0, total: 0, correct: null, detail: 'No code submitted' };
  const cases = Array.isArray(testCases) ? testCases : [];
  if (!cases.length) return { passed: 0, total: 0, correct: false, detail: 'No test cases' };
  const language = lang || 'javascript';
  let passed = 0;
  let detail = '';
  for (const tc of cases) {
    const r = tc && Array.isArray(tc.ops)
      ? runCase(language, code, undefined, tc.expected, tc)
      : runCase(language, code, tc.args, tc.expected, tc);
    if (r.pass) { passed++; continue; }
    if (!detail) {
      detail = 'Test case failed' +
        (r.error ? ': ' + r.error : ' — expected ' + r.want + ', got ' + r.got);
    }
  }
  return { passed, total: cases.length, correct: passed === cases.length, detail: detail || 'All tests passed' };
}

module.exports = { gradeCode, runCase };
