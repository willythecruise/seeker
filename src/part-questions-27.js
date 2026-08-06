/* Orion question bank — part 27: DSA hard & LeetCode-typical
   Real ListNode/TreeNode classes via $list/$tree markers, design
   problems via ops format, hard algorithms, theory, matching/ordering. */
  /* ── DSA: design problems (ops format) ────────────────────── */
  { id: 'dsah01', cat: 'dsa', tags: ['design', 'hard'], diff: 'advanced', type: 'code',
    q: 'Design an LRU Cache. `get(key)` returns the value (or -1 if absent); `put(key, value)` inserts/updates. Both must run in O(1) average time; the least-recently-used entry is evicted when capacity is exceeded.',
    codeLang: 'javascript',
    codeStub: 'class solution {\n  constructor(capacity) {\n    // initialize\n  }\n  get(key) {\n    // return value or -1\n  }\n  put(key, value) {\n    // insert or update\n  }\n}',
    testCases: [
      { ops: ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'], values: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]], expected: [null, null, 1, null, -1, null, -1, 3, 4] },
      { ops: ['LRUCache', 'put', 'get', 'get'], values: [[1], [2, 1], [2], [3]], expected: [null, 1, -1], hidden: true },
      { ops: ['LRUCache', 'put', 'put', 'put', 'get'], values: [[2], [1, 1], [2, 2], [3, 3], [1]], expected: [null, null, null, -1], hidden: true }
    ],
    explain: 'A hash map plus a doubly linked list gives O(1) get/put with LRU eviction (JS Map keeps insertion order, so delete+reinsert also works).' },
  { id: 'dsah02', cat: 'dsa', tags: ['design', 'hard'], diff: 'intermediate', type: 'code',
    q: 'Design a Min Stack supporting push, pop, top, and getMin — all in O(1) time.',
    codeLang: 'javascript',
    codeStub: 'class solution {\n  constructor() { }\n  push(val) { }\n  pop() { }\n  top() { }\n  getMin() { }\n}',
    testCases: [
      { ops: ['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'], values: [[], [-2], [0], [-3], [], [], [], []], expected: [null, null, null, -3, null, 0, -2] },
      { ops: ['MinStack', 'push', 'push', 'getMin', 'push', 'getMin'], values: [[], [5], [3], [], [4], []], expected: [null, null, 3, null, 3], hidden: true }
    ],
    explain: 'Keep a parallel stack of current minimums — every push stores min(value, top of min stack), so getMin is O(1).' },
  { id: 'dsah03', cat: 'dsa', tags: ['design', 'hard'], diff: 'intermediate', type: 'code',
    q: 'Implement a first-in-first-out queue using only two stacks. Support push, pop, peek, and empty (pop/peek amortized O(1)).',
    codeLang: 'javascript',
    codeStub: 'class solution {\n  constructor() { }\n  push(x) { }\n  pop() { }\n  peek() { }\n  empty() { }\n}',
    testCases: [
      { ops: ['MyQueue', 'push', 'push', 'peek', 'pop', 'empty'], values: [[], [1], [2], [], [], []], expected: [null, null, 1, 1, false] },
      { ops: ['MyQueue', 'push', 'push', 'push', 'pop', 'pop', 'pop', 'empty'], values: [[], [1], [2], [3], [], [], [], []], expected: [null, null, null, 1, 2, 3, true], hidden: true }
    ],
    explain: 'Push onto stack 1; when popping, transfer everything to stack 2 (reversing order) and pop from it — each element moves at most twice, amortized O(1).' },
  { id: 'dsah04', cat: 'dsa', tags: ['design', 'hard'], diff: 'intermediate', type: 'code',
    q: 'Design a time-based key-value store. set(key, value, timestamp) stores; get(key, timestamp) returns the value with the greatest timestamp <= given, or "" if none.',
    codeLang: 'javascript',
    codeStub: 'class solution {\n  constructor() { }\n  set(key, value, timestamp) { }\n  get(key, timestamp) { }\n}',
    testCases: [
      { ops: ['TimeMap', 'set', 'get', 'get', 'set', 'get', 'get'], values: [[], ['foo', 'bar', 1], ['foo', 1], ['foo', 3], ['foo', 'bar2', 4], ['foo', 4], ['foo', 5]], expected: [null, 'bar', 'bar', null, 'bar2', 'bar2'] },
      { ops: ['TimeMap', 'set', 'set', 'get', 'get', 'get'], values: [[], ['a', 'v1', 10], ['a', 'v2', 20], ['a', 15], ['a', 20], ['a', 30]], expected: [null, null, 'v1', 'v2', 'v2'], hidden: true }
    ],
    explain: 'Store per-key arrays of [timestamp, value]; get binary-searches for the largest timestamp <= target — O(log n) per get.' },
  { id: 'dsah05', cat: 'dsa', tags: ['design', 'hard'], diff: 'advanced', type: 'code',
    q: 'Design a class that finds the median from a data stream. addNum adds an integer; findMedian returns the median in O(1) (add can be O(log n)).',
    codeLang: 'javascript',
    codeStub: 'class solution {\n  constructor() { }\n  addNum(num) { }\n  findMedian() { }\n}',
    testCases: [
      { ops: ['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'], values: [[], [1], [2], [], [3], []], expected: [null, null, 1.5, null, 2] },
      { ops: ['MedianFinder', 'addNum', 'findMedian', 'addNum', 'findMedian'], values: [[], [1], [], [2], []], expected: [null, 1, null, 1.5], hidden: true },
      { ops: ['MedianFinder', 'addNum', 'findMedian'], values: [[], [-1], []], expected: [null, -1], hidden: true }
    ],
    explain: 'Two heaps (max-heap of the lower half, min-heap of the upper half) keep the median at the tops — the classic O(log n) add, O(1) median.' },

  /* ── DSA: linked lists (real ListNode) ────────────────────── */
  { id: 'dsah06', cat: 'dsa', diff: 'beginner', type: 'code',
    q: 'Given the head of a singly linked list, reverse the list and return its head.',
    codeLang: 'javascript',
    codeStub: 'var solution = function(head) {\n  // head is a ListNode or null; return the new head\n};',
    testCases: [
      { args: [{ $list: [1, 2, 3, 4, 5] }], expected: { $list: [5, 4, 3, 2, 1] } },
      { args: [{ $list: [1, 2] }], expected: { $list: [2, 1] } },
      { args: [null], expected: null, hidden: true },
      { args: [{ $list: [1] }], expected: { $list: [1] }, hidden: true }
    ],
    explain: 'Iterative three-pointer reversal (prev, curr, next) — O(n) time, O(1) space.' },
  { id: 'dsah07', cat: 'dsa', diff: 'beginner', type: 'code',
    q: 'Merge two sorted linked lists into one sorted linked list and return its head.',
    codeLang: 'javascript',
    codeStub: 'var solution = function(list1, list2) {\n  // return merged sorted list\n};',
    testCases: [
      { args: [{ $list: [1, 2, 4] }, { $list: [1, 3, 4] }], expected: { $list: [1, 1, 2, 3, 4, 4] } },
      { args: [null, null], expected: null },
      { args: [null, { $list: [0] }], expected: { $list: [0] }, hidden: true },
      { args: [{ $list: [5] }, { $list: [1, 2, 3] }], expected: { $list: [1, 2, 3, 5] }, hidden: true }
    ],
    explain: 'Two-pointer merge with a dummy head, always linking the smaller head — O(n + m).' },
  { id: 'dsah08', cat: 'dsa', diff: 'beginner', type: 'code',
    q: 'Return the middle node of a linked list. If there are two middles (even length), return the second one.',
    codeLang: 'javascript',
    codeStub: 'var solution = function(head) {\n  // return the middle ListNode\n};',
    testCases: [
      { args: [{ $list: [1, 2, 3, 4, 5] }], expected: { $list: [3, 4, 5] } },
      { args: [{ $list: [1, 2, 3, 4, 5, 6] }], expected: { $list: [4, 5, 6] } },
      { args: [{ $list: [1] }], expected: { $list: [1] }, hidden: true }
    ],
    explain: 'Fast and slow pointers: slow advances one step, fast two — slow lands on the middle — O(n).' },
  { id: 'dsah09', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'You are given two non-empty linked lists representing two non-negative integers, digits stored in reverse order. Add the two numbers and return the sum as a linked list.',
    codeLang: 'javascript',
    codeStub: 'var solution = function(l1, l2) {\n  // return sum as a linked list\n};',
    testCases: [
      { args: [{ $list: [2, 4, 3] }, { $list: [5, 6, 4] }], expected: { $list: [7, 0, 8] } },
      { args: [{ $list: [0] }, { $list: [0] }], expected: { $list: [0] } },
      { args: [{ $list: [9, 9, 9, 9, 9, 9, 9] }, { $list: [9, 9, 9, 9] }], expected: { $list: [8, 9, 9, 9, 0, 0, 0, 1] }, hidden: true }
    ],
    explain: 'Walk both lists with a carry: sum = carry + l1.val + l2.val, node = sum % 10, carry = floor(sum / 10) — O(max(n, m)).' },
  { id: 'dsah10', cat: 'dsa', tags: ['hard'], diff: 'advanced', type: 'code',
    q: 'Merge k sorted linked lists into one sorted list and return its head.',
    codeLang: 'javascript',
    codeStub: 'var solution = function(lists) {\n  // lists is an array of ListNode heads; return merged head\n};',
    testCases: [
      { args: [{ $lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }], expected: { $list: [1, 1, 2, 3, 4, 4, 5, 6] } },
      { args: [[]], expected: null },
      { args: [null], expected: null, hidden: true },
      { args: [{ $lists: [[1], [0], [2]] }], expected: { $list: [0, 1, 2] }, hidden: true }
    ],
    explain: 'Repeated two-list merge is O(k·n); a min-heap over list heads gives O(n log k) — either is correct here.' },
  { id: 'dsah11', cat: 'dsa', tags: ['hard'], diff: 'advanced', type: 'code',
    q: 'Reverse the nodes of a linked list k at a time, leaving the remainder (fewer than k) untouched. Return the new head.',
    codeLang: 'javascript',
    codeStub: 'var solution = function(head, k) {\n  // return head after reversing in groups of k\n};',
    testCases: [
      { args: [{ $list: [1, 2, 3, 4, 5] }, 2], expected: { $list: [2, 1, 4, 3, 5] } },
      { args: [{ $list: [1, 2, 3, 4, 5] }, 3], expected: { $list: [3, 2, 1, 4, 5] } },
      { args: [{ $list: [1, 2, 3, 4, 5] }, 1], expected: { $list: [1, 2, 3, 4, 5] }, hidden: true },
      { args: [{ $list: [1] }, 1], expected: { $list: [1] }, hidden: true }
    ],
    explain: 'Count the nodes, then for each group of k reverse in place by moving each following node to the front of the group — O(n).' },
  { id: 'dsah12', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Reorder a linked list to L0 → Ln → L1 → Ln-1 → L2 → ... in place (do not change node values). Return the head.',
    codeLang: 'javascript',
    codeStub: 'var solution = function(head) {\n  // reorder in place and return head\n};',
    testCases: [
      { args: [{ $list: [1, 2, 3, 4] }], expected: { $list: [1, 4, 2, 3] } },
      { args: [{ $list: [1, 2, 3, 4, 5] }], expected: { $list: [1, 5, 2, 4, 3] } },
      { args: [null], expected: null, hidden: true },
      { args: [{ $list: [1] }], expected: { $list: [1] }, hidden: true }
    ],
    explain: 'Find the middle, reverse the second half, then interleave the two halves — O(n) time, O(1) space.' },

  /* ── DSA: trees (real TreeNode) ───────────────────────────── */
  { id: 'dsah13', cat: 'dsa', tags: ['hard'], diff: 'advanced', type: 'code',
    q: 'Given the root of a binary tree, return the maximum path sum — a path may start and end at any node, and follows parent-child connections.',
    codeLang: 'javascript',
    codeStub: 'var solution = function(root) {\n  // return maximum path sum\n};',
    testCases: [
      { args: [{ $tree: [1, 2, 3] }], expected: 6 },
      { args: [{ $tree: [-10, 9, 20, null, null, 15, 7] }], expected: 42 },
      { args: [{ $tree: [-3] }], expected: -3, hidden: true },
      { args: [{ $tree: [2, -1, -2] }], expected: 2, hidden: true }
    ],
    explain: 'Post-order DFS: each node returns the best downward branch (clamped at 0), while the global answer tracks left + right + value — O(n).' },
  { id: 'dsah14', cat: 'dsa', diff: 'beginner', type: 'code',
    q: 'Given the root of a binary tree, return its maximum depth (number of nodes on the longest root-to-leaf path).',
    codeLang: 'javascript',
    codeStub: 'var solution = function(root) {\n  // return maximum depth\n};',
    testCases: [
      { args: [{ $tree: [3, 9, 20, null, null, 15, 7] }], expected: 3 },
      { args: [null], expected: 0 },
      { args: [{ $tree: [1, null, 2] }], expected: 2, hidden: true }
    ],
    explain: 'maxDepth = 0 for null, else 1 + max(left, right) — O(n).' },
  { id: 'dsah15', cat: 'dsa', diff: 'beginner', type: 'code',
    q: 'Given the root of a binary tree, invert the tree (swap every node\u2019s children) and return its root.',
    codeLang: 'javascript',
    codeStub: 'var solution = function(root) {\n  // return inverted root\n};',
    testCases: [
      { args: [{ $tree: [4, 2, 7, 1, 3, 6, 9] }], expected: { $tree: [4, 7, 2, 9, 6, 3, 1] } },
      { args: [null], expected: null },
      { args: [{ $tree: [1, 2, 3] }], expected: { $tree: [1, 3, 2] }, hidden: true }
    ],
    explain: 'Recursively invert the children, then swap them — O(n).' },
  { id: 'dsah16', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given the root of a binary tree, return its level-order traversal as an array of levels (left to right, top to bottom).',
    codeLang: 'javascript',
    codeStub: 'var solution = function(root) {\n  // return [[...], [...], ...]\n};',
    testCases: [
      { args: [{ $tree: [3, 9, 20, null, null, 15, 7] }], expected: [[3], [9, 20], [15, 7]] },
      { args: [null], expected: [] },
      { args: [{ $tree: [1, null, 2] }], expected: [[1], [2]], hidden: true }
    ],
    explain: 'BFS with a queue, collecting one array per level — O(n).' },
  { id: 'dsah17', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Construct a binary tree from its preorder and inorder traversals (all values distinct) and return its root.',
    codeLang: 'javascript',
    codeStub: 'var solution = function(preorder, inorder) {\n  // return root of the rebuilt tree\n};',
    testCases: [
      { args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expected: { $tree: [3, 9, 20, null, null, 15, 7] } },
      { args: [[-1], [-1]], expected: { $tree: [-1] } },
      { args: [[1, 2], [2, 1]], expected: { $tree: [1, 2] }, hidden: true }
    ],
    explain: 'The preorder root splits the inorder range; recurse on left/right with an advancing preorder index — O(n) with a value-to-index map.' },
  { id: 'dsah18', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given the root of a binary search tree and an integer k, return the kth smallest value (1-indexed).',
    codeLang: 'javascript',
    codeStub: 'var solution = function(root, k) {\n  // return kth smallest value\n};',
    testCases: [
      { args: [{ $tree: [3, 1, 4, null, 2] }, 1], expected: 1 },
      { args: [{ $tree: [5, 3, 6, 2, 4, null, null, 1] }, 3], expected: 3 },
      { args: [{ $tree: [2, 1] }, 2], expected: 2, hidden: true }
    ],
    explain: 'In-order traversal visits BST values in sorted order; stop at the kth — iterative with a stack is O(h + k).' },
  { id: 'dsah19', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given the root of a binary search tree and two node values p and q, return the value of their lowest common ancestor (both nodes exist in the tree).',
    codeLang: 'javascript',
    codeStub: 'var solution = function(root, p, q) {\n  // return LCA value\n};',
    testCases: [
      { args: [{ $tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5] }, 2, 8], expected: 6 },
      { args: [{ $tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5] }, 2, 4], expected: 2 },
      { args: [{ $tree: [2, 1] }, 2, 1], expected: 2, hidden: true }
    ],
    explain: 'Walk the BST: if both values are less go left, both greater go right, otherwise this node is the LCA — O(h).' },

  /* ── DSA: hard algorithms (LeetCode hard / typical) ───────── */
  { id: 'dsah20', cat: 'dsa', tags: ['hard'], diff: 'advanced', type: 'code',
    q: 'Given two sorted arrays, return the median of the two sorted arrays. The overall run time must be O(log(min(m, n))).',
    codeLang: 'javascript',
    codeStub: 'function solution(nums1, nums2) {\n  // return median number\n}',
    testCases: [
      { args: [[1, 3], [2]], expected: 2 },
      { args: [[1, 2], [3, 4]], expected: 2.5 },
      { args: [[], [1]], expected: 1, hidden: true },
      { args: [[2], []], expected: 2, hidden: true },
      { args: [[0, 0], [0, 0]], expected: 0, hidden: true }
    ],
    explain: 'Binary search the partition point on the smaller array so the left halves together have exactly half the elements and max(left) <= min(right) — O(log(min(m, n))).' },
  { id: 'dsah21', cat: 'dsa', tags: ['hard'], diff: 'advanced', type: 'code',
    q: 'A transformation sequence changes one letter at a time, each intermediate word must be in the word list, and every word is the same length. Return the number of words in the shortest sequence from beginWord to endWord, or 0 if impossible.',
    codeLang: 'javascript',
    codeStub: 'function solution(beginWord, endWord, wordList) {\n  // return shortest length or 0\n}',
    testCases: [
      { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']], expected: 5 },
      { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], expected: 0 },
      { args: ['a', 'c', ['a', 'b', 'c']], expected: 2, hidden: true },
      { args: ['hot', 'dog', ['hot', 'dot', 'dog']], expected: 3, hidden: true }
    ],
    explain: 'BFS over words, generating each single-letter neighbour — the first time endWord is reached is the shortest — O(words × length × 26).' },
  { id: 'dsah22', cat: 'dsa', tags: ['hard'], diff: 'advanced', type: 'code',
    q: 'Given an array of integers heights representing bar heights in a histogram, return the area of the largest rectangle that can be formed.',
    codeLang: 'javascript',
    codeStub: 'function solution(heights) {\n  // return largest rectangle area\n}',
    testCases: [
      { args: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { args: [[2, 4]], expected: 4 },
      { args: [[3]], expected: 3, hidden: true },
      { args: [[2, 1, 2]], expected: 3, hidden: true }
    ],
    explain: 'Monotonic stack: when a bar is shorter than the stack top, pop and compute the area using the popped height and the distance to the next smaller bar — O(n).' },
  { id: 'dsah23', cat: 'dsa', tags: ['hard'], diff: 'advanced', type: 'code',
    q: 'Children are in a line with ratings. Each child must get at least 1 candy and a child with a higher rating than a neighbour must get more candy than that neighbour. Return the minimum total candies.',
    codeLang: 'javascript',
    codeStub: 'function solution(ratings) {\n  // return minimum candies\n}',
    testCases: [
      { args: [[1, 0, 2]], expected: 5 },
      { args: [[1, 2, 2]], expected: 4 },
      { args: [[1, 3, 2, 2, 1]], expected: 7, hidden: true },
      { args: [[1]], expected: 1, hidden: true }
    ],
    explain: 'Give everyone 1, then a left-to-right pass raises candies where ratings increase, and a right-to-left pass does the same — O(n).' },
  { id: 'dsah24', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given an array of intervals [start, end], return the minimum number of conference rooms required.',
    codeLang: 'javascript',
    codeStub: 'function solution(intervals) {\n  // return min rooms\n}',
    testCases: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expected: 2 },
      { args: [[[7, 10], [2, 4]]], expected: 1 },
      { args: [[[0, 5], [5, 10], [10, 15]]], expected: 1, hidden: true },
      { args: [[[1, 5], [2, 6], [3, 7]]], expected: 3, hidden: true }
    ],
    explain: 'Sort by start; a min-heap of end times reveals how many rooms are still busy; the heap size is the answer — O(n log n).' },
  { id: 'dsah25', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given an m×n binary matrix, return a matrix of the same size where each cell holds the distance to the nearest 0.',
    codeLang: 'javascript',
    codeStub: 'function solution(mat) {\n  // return distance matrix\n}',
    testCases: [
      { args: [[[0, 0, 0], [0, 1, 0], [1, 1, 1]]], expected: [[0, 0, 0], [0, 1, 0], [1, 2, 1]] },
      { args: [[[0], [1]]], expected: [[0], [1]] },
      { args: [[[1, 1], [1, 0]]], expected: [[2, 1], [1, 0]], hidden: true }
    ],
    explain: 'Multi-source BFS starting from every 0 — each cell\u2019s distance is its BFS level — O(m×n).' },
  { id: 'dsah26', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'A lock has 4 wheels from 0 to 9. Each move rotates one wheel by one digit. Deadends cannot be visited. Return the minimum total moves to reach the target from "0000", or -1 if impossible.',
    codeLang: 'javascript',
    codeStub: 'function solution(deadends, target) {\n  // return min moves or -1\n}',
    testCases: [
      { args: [['0201', '0101', '0102', '1212', '2002'], '0202'], expected: 6 },
      { args: [['8888'], '0009'], expected: 1 },
      { args: [['0000'], '8888'], expected: -1, hidden: true },
      { args: [[], '0000'], expected: 0, hidden: true }
    ],
    explain: 'BFS over the 8 neighbours of each state (each wheel ±1), skipping visited and deadends — first reach of the target is minimal.' },
  { id: 'dsah27', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Decode an encoded string where k[encoded_string] means the string inside repeats k times (nesting allowed). Return the decoded string.',
    codeLang: 'javascript',
    codeStub: 'function solution(s) {\n  // return decoded string\n}',
    testCases: [
      { args: ['3[a]2[bc]'], expected: 'aaabcbc' },
      { args: ['3[a2[c]]'], expected: 'accaccacc' },
      { args: ['2[abc]3[cd]ef'], expected: 'abcabccdcdcdef', hidden: true },
      { args: ['abc3[cd]xyz'], expected: 'abccdcdcdxyz', hidden: true }
    ],
    explain: 'Stack of [previousString, repeatCount]: on "]" pop and repeat — O(n) over the output length.' },
  { id: 'dsah28', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given n pairs of parentheses, generate all combinations of well-formed parentheses.',
    codeLang: 'javascript',
    codeStub: 'function solution(n) {\n  // return array of combinations\n}',
    testCases: [
      { args: [3], expected: ['((()))', '(()())', '(())()', '()(())', '()()()'] },
      { args: [1], expected: ['()'] },
      { args: [2], expected: ['(())', '()()'], hidden: true }
    ],
    explain: 'Backtracking: add "(" while open < n, add ")" while close < open — every complete string is well-formed.' },
  { id: 'dsah29', cat: 'dsa', diff: 'beginner', type: 'code',
    q: 'Given a string of digits from 2-9, return all possible letter combinations the number could represent (phone keypad).',
    codeLang: 'javascript',
    codeStub: 'function solution(digits) {\n  // return array of combinations\n}',
    testCases: [
      { args: ['23'], expected: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'] },
      { args: [''], expected: [] },
      { args: ['2'], expected: ['a', 'b', 'c'], hidden: true }
    ],
    explain: 'Backtracking over digits, appending each mapped letter — O(4^n × n).' },
  { id: 'dsah30', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given a string s, partition it so every substring is a palindrome. Return all possible palindrome partitions.',
    codeLang: 'javascript',
    codeStub: 'function solution(s) {\n  // return array of partitions\n}',
    testCases: [
      { args: ['aab'], expected: [['a', 'a', 'b'], ['aa', 'b']] },
      { args: ['a'], expected: [['a']] },
      { args: ['ab'], expected: [['a', 'b']], hidden: true }
    ],
    explain: 'Backtracking: for each start, extend the end while the slice is a palindrome (checked with two pointers), then recurse — O(n·2^n).' },
  { id: 'dsah31', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Arrange non-negative integers to form the largest possible number (as a string).',
    codeLang: 'javascript',
    codeStub: 'function solution(nums) {\n  // return largest number string\n}',
    testCases: [
      { args: [[10, 2]], expected: '210' },
      { args: [[3, 30, 34, 5, 9]], expected: '9534330' },
      { args: [[0, 0]], expected: '0', hidden: true },
      { args: [[1]], expected: '1', hidden: true }
    ],
    explain: 'Sort with comparator (b + a) vs (a + b), join, and strip leading zeros — O(n log n).' },
  { id: 'dsah32', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given an array with possible duplicates, return all possible subsets (without duplicate subsets). Output: subsets sorted, then sorted lexicographically.',
    codeLang: 'javascript',
    codeStub: 'function solution(nums) {\n  // return array of subsets\n}',
    testCases: [
      { args: [[1, 2, 2]], expected: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]] },
      { args: [[0]], expected: [[], [0]] },
      { args: [[2, 1, 2]], expected: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]], hidden: true }
    ],
    explain: 'Sort, then backtrack skipping duplicates at the same depth — O(n·2^n) with a canonical sorted output.' },
  { id: 'dsah33', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given an array with duplicates, return all unique permutations.',
    codeLang: 'javascript',
    codeStub: 'function solution(nums) {\n  // return array of permutations\n}',
    testCases: [
      { args: [[1, 1, 2]], expected: [[1, 1, 2], [1, 2, 1], [2, 1, 1]] },
      { args: [[1, 2]], expected: [[1, 2], [2, 1]] },
      { args: [[1]], expected: [[1]], hidden: true }
    ],
    explain: 'Sort, backtrack with a used set, skipping a duplicate when its earlier twin is unused — O(n·n!).' },
  { id: 'dsah34', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given candidates (with duplicates) and a target, return all unique combinations where the chosen numbers sum to target — each candidate used at most once. Output: each combo sorted, combos sorted lexicographically.',
    codeLang: 'javascript',
    codeStub: 'function solution(candidates, target) {\n  // return array of combinations\n}',
    testCases: [
      { args: [[10, 1, 2, 7, 6, 1, 5], 8], expected: [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]] },
      { args: [[2, 5, 2, 1, 2], 5], expected: [[1, 2, 2], [5]] },
      { args: [[1], 2], expected: [], hidden: true }
    ],
    explain: 'Sort, backtrack with the index always increasing and duplicates skipped at the same depth, then sort the output canonically.' },
  { id: 'dsah35', cat: 'dsa', tags: ['hard'], diff: 'advanced', type: 'code',
    q: 'Given an m×n heights matrix, water can flow to the Pacific from the top/left edges and to the Atlantic from the bottom/right edges. Return all cells where water can flow to BOTH oceans, sorted by row then column.',
    codeLang: 'javascript',
    codeStub: 'function solution(heights) {\n  // return array of [r, c] cells\n}',
    testCases: [
      { args: [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]], expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] },
      { args: [[[1, 2], [3, 4]]], expected: [[0, 1], [1, 0], [1, 1]] },
      { args: [[[1]]], expected: [[0, 0]], hidden: true }
    ],
    explain: 'DFS from both ocean borders flowing to equal-or-higher cells, then intersect the two reachable sets — O(m×n).' },
  { id: 'dsah36', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given an n×n matrix where each row and column is sorted ascending, return the kth smallest value in the matrix.',
    codeLang: 'javascript',
    codeStub: 'function solution(matrix, k) {\n  // return kth smallest\n}',
    testCases: [
      { args: [[[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8], expected: 13 },
      { args: [[[-5]], 1], expected: -5 },
      { args: [[[1, 2], [1, 3]], 3], expected: 2, hidden: true }
    ],
    explain: 'Binary search on the value range, counting how many elements are <= mid per row — O(n log(max-min)).' },
  { id: 'dsah37', cat: 'dsa', tags: ['hard'], diff: 'intermediate', type: 'code',
    q: 'Given an array of words and an integer k, return the k most frequent words — ties broken by lexicographic (alphabetical) order.',
    codeLang: 'javascript',
    codeStub: 'function solution(words, k) {\n  // return k most frequent words\n}',
    testCases: [
      { args: [['i', 'love', 'leetcode', 'i', 'love', 'coding'], 2], expected: ['i', 'love'] },
      { args: [['the', 'day', 'is', 'sunny', 'the', 'the', 'the', 'sunny', 'is', 'is'], 4], expected: ['the', 'is', 'sunny', 'day'] },
      { args: [['a', 'a', 'b'], 2], expected: ['a', 'b'], hidden: true }
    ],
    explain: 'Count with a map, sort by (-count, word), take the first k — O(n log n).' },
  { id: 'dsah38', cat: 'dsa', tags: ['hard'], diff: 'advanced', type: 'code',
    q: 'In an alien language the letters are ordered somehow. Given words sorted lexicographically by that order, return the order as a string of distinct letters, or "" if invalid.',
    codeLang: 'javascript',
    codeStub: 'function solution(words) {\n  // return alien alphabet order or ""\n}',
    testCases: [
      { args: [['wrt', 'wrf', 'er', 'ett', 'rftt']], expected: 'wertf' },
      { args: [['z', 'x']], expected: 'zx' },
      { args: [['z', 'x', 'z']], expected: '', hidden: true },
      { args: [['a', 'b', 'c']], expected: 'abc', hidden: true }
    ],
    explain: 'Build a DAG of letter precedence from adjacent words, topologically sort with Kahn\u2019s algorithm ("" on cycle or invalid prefix) — O(V + E).' },
  { id: 'dsah39', cat: 'dsa', tags: ['hard'], diff: 'advanced', type: 'code',
    q: 'There are n nodes labelled 1..n. A signal starts at node k and travels along directed edges times = [u, v, w] (u→v takes w). Return the minimum time for all nodes to receive the signal, or -1 if any node is unreachable.',
    codeLang: 'javascript',
    codeStub: 'function solution(times, n, k) {\n  // return min time or -1\n}',
    testCases: [
      { args: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expected: 2 },
      { args: [[[1, 2, 1]], 2, 1], expected: 1 },
      { args: [[[1, 2, 1]], 2, 2], expected: -1, hidden: true },
      { args: [[[1, 2, 2], [1, 3, 4], [2, 3, 1]], 3, 1], expected: 3, hidden: true }
    ],
    explain: 'Dijkstra from k with a min-heap; the answer is the maximum shortest distance among reachable nodes — O(E log V).' },

  /* ── DSA: hard theory ─────────────────────────────────────── */
  { id: 'dsat1', cat: 'dsa', diff: 'advanced', type: 'mcq',
    q: 'What is the amortized time complexity of union-find operations with path compression and union by rank?',
    options: [
      'Nearly O(1) — inverse Ackermann',
      'O(log n)',
      'O(n)',
      'O(n log n)'
    ],
    answer: 0,
    explain: 'With both heuristics the amortized cost per operation is O(α(n)) — the inverse Ackermann function — effectively constant.' },
  { id: 'dsat2', cat: 'dsa', diff: 'advanced', type: 'fill',
    q: 'A problem that is in NP and to which every problem in NP can be reduced in polynomial time is called NP-___.',
    answer: ['complete', 'np-complete', 'np complete'],
    explain: 'NP-complete problems are the hardest in NP: solving one in polynomial time would prove P = NP.' },
  { id: 'dsat3', cat: 'dsa', diff: 'advanced', type: 'mcq',
    q: 'Which of the following is a classic NP-complete problem?',
    options: ['Boolean satisfiability (SAT)', 'Sorting', 'Finding the shortest path', 'Computing the GCD'],
    answer: 0,
    explain: 'SAT (and 3-SAT, subset-sum, TSP decision, graph coloring) are NP-complete; sorting, shortest path, and GCD have polynomial algorithms.' },
  { id: 'dsat4', cat: 'dsa', diff: 'advanced', type: 'mcq',
    q: 'If a polynomial-time algorithm is found for one NP-complete problem, what follows?',
    options: [
      'P = NP — every NP problem becomes polynomial',
      'P ≠ NP is proven',
      'Nothing changes',
      'The problem was misclassified'
    ],
    answer: 0,
    explain: 'NP-complete problems are all reducible to each other, so a polynomial algorithm for one gives one for every problem in NP.' },
  { id: 'dsat5', cat: 'dsa', diff: 'intermediate', type: 'mcq',
    q: 'What is the time complexity of building a binary heap from an unsorted array (bottom-up heapify)?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
    answer: 0,
    explain: 'Most nodes are near the leaves and sift down in O(1)–O(h) total, summing to O(n) — not O(n log n).' },
  { id: 'dsat6', cat: 'dsa', diff: 'advanced', type: 'mcq',
    q: 'What is the time complexity of the optimal solution for the Longest Common Subsequence problem?',
    options: ['O(m × n) time and O(m × n) space', 'O(m + n) time', 'O(n log n)', 'O(m × n) time, O(1) space'],
    answer: 0,
    explain: 'The classic DP table is O(m × n) in both time and space; space can be optimized to O(min(m, n)) but time stays O(m × n).' },
  { id: 'dsat7', cat: 'dsa', diff: 'advanced', type: 'mcq',
    q: 'Which statement about the master theorem is correct?',
    options: [
      'It solves recurrences of the form T(n) = aT(n/b) + f(n) by comparing f(n) with n^(log_b a)',
      'It only applies to sorting algorithms',
      'It computes the exact runtime of any program',
      'It applies only to dynamic programming'
    ],
    answer: 0,
    explain: 'The master theorem classifies divide-and-conquer recurrences by comparing f(n) to the critical exponent n^(log_b a) — giving Θ bounds.' },
  { id: 'dsat8', cat: 'dsa', diff: 'advanced', type: 'mcq',
    q: 'What is the space complexity of the optimal two-pointer solution for trapping rain water?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    answer: 0,
    explain: 'The two-pointer version tracks only two running maximums — constant extra space, unlike the O(n) prefix/suffix arrays.' },
  { id: 'dsat9', cat: 'dsa', diff: 'intermediate', type: 'mcq',
    q: 'Which data structure supports O(log n) insert and O(log n) extract-max while also being the basis of heapsort?',
    options: ['Binary heap', 'Hash map', 'Doubly linked list', 'Binary search tree only'],
    answer: 0,
    explain: 'Binary heaps give O(log n) insert/extract and enable in-place heapsort — the standard priority-queue structure.' },
  { id: 'dsat10', cat: 'dsa', diff: 'advanced', type: 'mcq',
    q: 'What distinguishes a greedy algorithm from dynamic programming?',
    options: [
      'Greedy makes one locally optimal choice and never revisits it; DP explores overlapping subproblems',
      'Greedy always finds the global optimum',
      'DP never uses recursion',
      'They are identical'
    ],
    answer: 0,
    explain: 'Greedy commits to choices with no backtracking (works when local optimality implies global); DP evaluates subproblems and picks the best combination.' },

  /* ── DSA: hard matching & ordering ────────────────────────── */
  { id: 'dsahm1', cat: 'dsa', diff: 'advanced', type: 'matching',
    q: 'Match each problem to its optimal time complexity.',
    pairs: [
      { l: 'Median of two sorted arrays', r: 'O(log(min(m, n)))' },
      { l: 'LRU cache get/put', r: 'O(1) amortized' },
      { l: 'Word ladder (shortest path)', r: 'O(V + E) BFS' },
      { l: 'Merge k sorted lists', r: 'O(n log k)' }
    ],
    explain: 'Median uses binary search on the smaller array, LRU uses map + list, word ladder is BFS, and merging k lists with a heap is O(n log k).' },
  { id: 'dsahm2', cat: 'dsa', diff: 'advanced', type: 'matching',
    q: 'Match each complexity class to its defining property.',
    pairs: [
      { l: 'P', r: 'Solvable in polynomial time' },
      { l: 'NP', r: 'Verifiable in polynomial time' },
      { l: 'NP-hard', r: 'At least as hard as every NP problem' },
      { l: 'NP-complete', r: 'Both in NP and NP-hard' }
    ],
    explain: 'P is efficiently solvable, NP efficiently verifiable, NP-hard is at least as hard as NP, and NP-complete sits at the intersection.' },
  { id: 'dsahm3', cat: 'dsa', diff: 'intermediate', type: 'ordering',
    q: 'Order the steps of the LRU cache get operation (O(1)).',
    ordered: ['Look up the key in the hash map', 'If present, remove and re-insert the key to mark it most-recently-used', 'If absent, return -1', 'Return the cached value'],
    explain: 'The hash map finds the entry, re-insertion (or list move) refreshes recency, and the value is returned — all constant time.' },
  { id: 'dsahm4', cat: 'dsa', diff: 'advanced', type: 'ordering',
    q: 'Order the steps of finding the median of two sorted arrays via binary search.',
    ordered: ['Ensure nums1 is the smaller array', 'Binary search a partition point in nums1', 'Derive the matching partition in nums2', 'Check max(left1, left2) <= min(right1, right2)', 'Adjust the partition until the condition holds', 'Return the median from the boundary values'],
    explain: 'Partition the smaller array, infer the other partition, verify the boundary invariant, and read the median — O(log(min)).' },
  { id: 'dsahm5', cat: 'dsa', diff: 'intermediate', type: 'ordering',
    q: 'Order the steps of a topological sort with Kahn\u2019s algorithm.',
    ordered: ['Compute in-degrees of every vertex', 'Queue all vertices with in-degree 0', 'Dequeue a vertex and add it to the order', 'Decrement the in-degrees of its neighbours', 'Enqueue neighbours whose in-degree becomes 0', 'If fewer than V vertices were ordered, a cycle exists'],
    explain: 'Kahn\u2019s repeatedly removes zero in-degree vertices; running out early signals a cycle.' },
