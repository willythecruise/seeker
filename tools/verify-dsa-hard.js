#!/usr/bin/env node
/* Verify every new "hard/typical" DSA solver against the upgraded runner. */
const { gradeCode } = require('../server/codeRunner');
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'questions.js'), 'utf8');
const m = src.match(/const BUILTIN_QUESTIONS = \[([\s\S]*?)\n\];/);
eval('const Q=[' + m[1] + ']; globalThis.Q = Q;');
const qs = globalThis.Q.filter(q => q.type === 'code' && q.id.startsWith('dsah'));

const solvers = {
  /* design (class solution) */
  dsah01: `class solution {
    constructor(c){ this.cap=c; this.m=new Map(); }
    get(k){ if(!this.m.has(k)) return -1; const v=this.m.get(k); this.m.delete(k); this.m.set(k,v); return v; }
    put(k,v){ if(this.m.has(k)) this.m.delete(k); this.m.set(k,v); if(this.m.size>this.cap){ const f=this.m.keys().next().value; this.m.delete(f); } }
  }`,
  dsah02: `class solution {
    constructor(){ this.s=[]; this.m=[]; }
    push(x){ this.s.push(x); this.m.push(this.m.length?Math.min(x,this.m[this.m.length-1]):x); }
    pop(){ this.s.pop(); this.m.pop(); }
    top(){ return this.s[this.s.length-1]; }
    getMin(){ return this.m[this.m.length-1]; }
  }`,
  dsah03: `class solution {
    constructor(){ this.a=[]; this.b=[]; }
    push(x){ this.a.push(x); }
    _t(){ if(!this.b.length) while(this.a.length) this.b.push(this.a.pop()); }
    pop(){ this._t(); return this.b.pop(); }
    peek(){ this._t(); return this.b[this.b.length-1]; }
    empty(){ return !this.a.length && !this.b.length; }
  }`,
  dsah04: `class solution {
    constructor(){ this.m={}; }
    set(k,v,t){ (this.m[k]=this.m[k]||[]).push([t,v]); }
    get(k,t){ const a=this.m[k]||[]; let lo=0,hi=a.length-1,res=""; while(lo<=hi){ const mid=(lo+hi)>>1; if(a[mid][0]<=t){ res=a[mid][1]; lo=mid+1; } else hi=mid-1; } return res; }
  }`,
  dsah05: `class solution {
    constructor(){ this.a=[]; }
    addNum(x){ this.a.push(x); this.a.sort((a,b)=>a-b); }
    findMedian(){ const n=this.a.length, m=n>>1; return n%2?this.a[m]:(this.a[m-1]+this.a[m])/2; }
  }`,
  /* linked lists */
  dsah06: `var solution = function(head) { let p=null,c=head; while(c){ const n=c.next; c.next=p; p=c; c=n; } return p; };`,
  dsah07: `var solution = function(l1,l2){ const d=new ListNode(0); let c=d; while(l1&&l2){ if(l1.val<=l2.val){ c.next=l1; l1=l1.next; } else { c.next=l2; l2=l2.next; } c=c.next; } c.next=l1||l2; return d.next; };`,
  dsah08: `var solution = function(head){ let s=head,f=head; while(f&&f.next){ s=s.next; f=f.next.next; } return s; };`,
  dsah09: `var solution = function(l1,l2){ const d=new ListNode(0); let c=d,carry=0; while(l1||l2||carry){ let sum=carry; if(l1){ sum+=l1.val; l1=l1.next; } if(l2){ sum+=l2.val; l2=l2.next; } c.next=new ListNode(sum%10); c=c.next; carry=Math.floor(sum/10); } return d.next; };`,
  dsah10: `var solution = function(lists){ if(!lists||!lists.length) return null; const merge=(a,b)=>{ const d=new ListNode(0); let c=d; while(a&&b){ if(a.val<=b.val){ c.next=a; a=a.next; } else { c.next=b; b=b.next; } c=c.next; } c.next=a||b; return d.next; }; let res=null; for(const l of lists) res=merge(res,l); return res; };`,
  dsah11: `var solution = function(head,k){ if(!head||k<2) return head; const d=new ListNode(0); d.next=head; let pre=d,cur=head,n=0; { let t=head; while(t){ n++; t=t.next; } } while(n>=k){ const tail=cur; for(let i=0;i<k-1;i++){ const nxt=cur.next; cur.next=nxt.next; nxt.next=pre.next; pre.next=nxt; } pre=tail; cur=tail.next; n-=k; } return d.next; };`,
  dsah12: `var solution = function(head){ if(!head||!head.next) return head; let slow=head,fast=head; while(fast&&fast.next){ slow=slow.next; fast=fast.next.next; } let prev=null,cur=slow; while(cur){ const n=cur.next; cur.next=prev; prev=cur; cur=n; } let first=head,second=prev; while(second.next){ const t1=first.next,t2=second.next; first.next=second; second.next=t1; first=t1; second=t2; } return head; };`,
  /* trees */
  dsah13: `var solution = function(root){ let best=-Infinity; const dfs=(n)=>{ if(!n) return 0; const l=Math.max(0,dfs(n.left)), r=Math.max(0,dfs(n.right)); best=Math.max(best,l+r+n.val); return Math.max(l,r)+n.val; }; dfs(root); return best; };`,
  dsah14: `var solution = function(root){ if(!root) return 0; return 1+Math.max(solution(root.left),solution(root.right)); };`,
  dsah15: `var solution = function(root){ if(!root) return null; const l=solution(root.left), r=solution(root.right); root.left=r; root.right=l; return root; };`,
  dsah16: `var solution = function(root){ if(!root) return []; const out=[],q=[root]; while(q.length){ const n=q.length,lvl=[]; for(let i=0;i<n;i++){ const x=q.shift(); lvl.push(x.val); if(x.left) q.push(x.left); if(x.right) q.push(x.right); } out.push(lvl); } return out; };`,
  dsah17: `var solution = function(pre,ino){ const m={}; ino.forEach((v,i)=>m[v]=i); let pi=0; const b=(lo,hi)=>{ if(lo>hi) return null; const v=pre[pi++], n=new TreeNode(v); n.left=b(lo,m[v]-1); n.right=b(m[v]+1,hi); return n; }; return b(0,ino.length-1); };`,
  dsah18: `var solution = function(root,k){ let c=0; const st=[]; let cur=root; while(cur||st.length){ while(cur){ st.push(cur); cur=cur.left; } cur=st.pop(); if(++c===k) return cur.val; cur=cur.right; } return null; };`,
  dsah19: `var solution = function(root,p,q){ while(root){ if(p<root.val&&q<root.val) root=root.left; else if(p>root.val&&q>root.val) root=root.right; else return root.val; } return null; };`,
  /* hard algorithms */
  dsah20: `function solution(a,b){ if(a.length>b.length) [a,b]=[b,a]; const m=a.length,n=b.length; let lo=0,hi=m; while(lo<=hi){ const i=(lo+hi)>>1, j=((m+n+1)>>1)-i; const al=i===0?-Infinity:a[i-1], ar=i===m?Infinity:a[i]; const bl=j===0?-Infinity:b[j-1], br=j===n?Infinity:b[j]; if(al<=br&&bl<=ar){ if((m+n)%2) return Math.max(al,bl); return (Math.max(al,bl)+Math.min(ar,br))/2; } if(al>br) hi=i-1; else lo=i+1; } return 0; }`,
  dsah21: `function solution(b,e,list){ const set=new Set(list); if(!set.has(e)) return 0; const q=[[b,1]]; const seen=new Set([b]); while(q.length){ const [w,d]=q.shift(); if(w===e) return d; for(let i=0;i<w.length;i++) for(let ch=97;ch<=122;ch++){ const nw=w.slice(0,i)+String.fromCharCode(ch)+w.slice(i+1); if(nw===e&&set.has(nw)) return d+1; if(set.has(nw)&&!seen.has(nw)){ seen.add(nw); q.push([nw,d+1]); } } } return 0; }`,
  dsah22: `function solution(h){ h.push(0); const st=[]; let best=0; for(let i=0;i<h.length;i++){ while(st.length&&h[st[st.length-1]]>h[i]){ const he=h[st.pop()]; const w=st.length?i-st[st.length-1]-1:i; best=Math.max(best,he*w); } st.push(i); } return best; }`,
  dsah23: `function solution(r){ const n=r.length, c=Array(n).fill(1); for(let i=1;i<n;i++) if(r[i]>r[i-1]) c[i]=c[i-1]+1; for(let i=n-2;i>=0;i--) if(r[i]>r[i+1]) c[i]=Math.max(c[i],c[i+1]+1); return c.reduce((a,b)=>a+b,0); }`,
  dsah24: `function solution(iv){ if(!iv.length) return 0; iv.sort((a,b)=>a[0]-b[0]); const ends=[]; for(const [s,e] of iv){ ends.push(e); ends.sort((a,b)=>a-b); if(ends.length&&ends[0]<=s) ends.shift(); } return ends.length; }`,
  dsah25: `function solution(mx){ const r=mx.length,c=mx[0].length,q=[]; for(let i=0;i<r;i++)for(let j=0;j<c;j++){ if(mx[i][j]===0) q.push([i,j]); else mx[i][j]=Infinity; } while(q.length){ const [i,j]=q.shift(); for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]){ const ni=i+di,nj=j+dj; if(ni>=0&&nj>=0&&ni<r&&nj<c&&mx[ni][nj]>mx[i][j]+1){ mx[ni][nj]=mx[i][j]+1; q.push([ni,nj]); } } } return mx; }`,
  dsah26: `function solution(dead,target){ const seen=new Set(dead); if(seen.has("0000")) return -1; if(target==="0000") return 0; const q=[["0000",0]]; seen.add("0000"); while(q.length){ const [s,d]=q.shift(); for(let i=0;i<4;i++) for(const del of [-1,1]){ const arr=s.split(""); arr[i]=(((Number(arr[i])+del)%10)+10)%10; const ns=arr.join(""); if(ns===target) return d+1; if(!seen.has(ns)){ seen.add(ns); q.push([ns,d+1]); } } } return -1; }`,
  dsah27: `function solution(s){ const st=[]; let cur="",num=0; for(const ch of s){ if(ch>='0'&&ch<='9'){ num=num*10+Number(ch); } else if(ch==='['){ st.push([cur,num]); cur=""; num=0; } else if(ch===']'){ const [prev,n]=st.pop(); cur=prev+cur.repeat(n); } else cur+=ch; } return cur; }`,
  dsah28: `function solution(n){ const out=[]; const bt=(s,o,c)=>{ if(s.length===2*n){ out.push(s); return; } if(o<n) bt(s+"(",o+1,c); if(c<o) bt(s+")",o,c+1); }; bt("",0,0); return out.sort(); }`,
  dsah29: `function solution(d){ if(!d) return []; const map={2:"abc",3:"def",4:"ghi",5:"jkl",6:"mno",7:"pqrs",8:"tuv",9:"wxyz"}; const out=[]; const bt=(i,cur)=>{ if(i===d.length){ out.push(cur); return; } for(const ch of map[d[i]]) bt(i+1,cur+ch); }; bt(0,""); return out.sort(); }`,
  dsah30: `function solution(s){ const out=[]; const pal=(a,b)=>{ while(a<b){ if(s[a]!==s[b]) return false; a++; b--; } return true; }; const bt=(i,cur)=>{ if(i===s.length){ out.push(cur.slice()); return; } for(let j=i;j<s.length;j++){ if(pal(i,j)){ cur.push(s.slice(i,j+1)); bt(j+1,cur); cur.pop(); } } }; bt(0,[]); return out; }`,
  dsah31: `function solution(n){ const s=n.map(String).sort((a,b)=>(b+a).localeCompare(a+b)); const r=s.join(""); return r[0]==="0"?"0":r; }`,
  dsah32: `function solution(n){ n.sort((a,b)=>a-b); const out=[]; const bt=(i,cur)=>{ out.push(cur.slice()); for(let j=i;j<n.length;j++){ if(j>i&&n[j]===n[j-1]) continue; cur.push(n[j]); bt(j+1,cur); cur.pop(); } }; bt(0,[]); return out.sort((a,b)=>{ for(let k=0;k<Math.min(a.length,b.length);k++) if(a[k]!==b[k]) return a[k]-b[k]; return a.length-b.length; }); }`,
  dsah33: `function solution(n){ n.sort((a,b)=>a-b); const out=[],used=Array(n.length).fill(false); const bt=(cur)=>{ if(cur.length===n.length){ out.push(cur.slice()); return; } for(let i=0;i<n.length;i++){ if(used[i]) continue; if(i>0&&n[i]===n[i-1]&&!used[i-1]) continue; used[i]=true; cur.push(n[i]); bt(cur); cur.pop(); used[i]=false; } }; bt([]); return out; }`,
  dsah34: `function solution(c,t){ c.sort((a,b)=>a-b); const out=[]; const bt=(i,rem,cur)=>{ if(rem===0){ out.push(cur.slice()); return; } for(let j=i;j<c.length;j++){ if(j>i&&c[j]===c[j-1]) continue; if(c[j]>rem) break; cur.push(c[j]); bt(j+1,rem-c[j],cur); cur.pop(); } }; bt(0,t,[]); return out.sort((a,b)=>{ for(let k=0;k<Math.min(a.length,b.length);k++) if(a[k]!==b[k]) return a[k]-b[k]; return a.length-b.length; }); }`,
  dsah35: `function solution(h){ const m=h.length,n=h[0].length; const P=Array.from({length:m},()=>Array(n).fill(false)); const A=Array.from({length:m},()=>Array(n).fill(false)); const dfs=(i,j,vis,prev)=>{ if(i<0||j<0||i>=m||j>=n||vis[i][j]||h[i][j]<prev) return; vis[i][j]=true; dfs(i+1,j,vis,h[i][j]); dfs(i-1,j,vis,h[i][j]); dfs(i,j+1,vis,h[i][j]); dfs(i,j-1,vis,h[i][j]); }; for(let i=0;i<m;i++){ dfs(i,0,P,-Infinity); dfs(i,n-1,A,-Infinity); } for(let j=0;j<n;j++){ dfs(0,j,P,-Infinity); dfs(m-1,j,A,-Infinity); } const out=[]; for(let i=0;i<m;i++)for(let j=0;j<n;j++) if(P[i][j]&&A[i][j]) out.push([i,j]); return out.sort((a,b)=>a[0]-b[0]||a[1]-b[1]); }`,
  dsah36: `function solution(mx,k){ const n=mx.length; let lo=mx[0][0],hi=mx[n-1][n-1]; while(lo<hi){ const mid=(lo+hi)>>1; let cnt=0,j=n-1; for(let i=0;i<n;i++){ while(j>=0&&mx[i][j]>mid) j--; cnt+=j+1; } if(cnt<k) lo=mid+1; else hi=mid; } return lo; }`,
  dsah37: `function solution(w,k){ const m={}; for(const x of w) m[x]=(m[x]||0)+1; return Object.keys(m).sort((a,b)=>m[b]-m[a]||a.localeCompare(b)).slice(0,k); }`,
  dsah38: `function solution(w){ const g={},ind={}; for(const s of w) for(const c of s){ g[c]=[]; if(!(c in ind)) ind[c]=0; } for(let i=0;i<w.length-1;i++){ const a=w[i],b=w[i+1]; const n=Math.min(a.length,b.length); let found=false; for(let j=0;j<n;j++){ if(a[j]!==b[j]){ if(!g[a[j]].includes(b[j])){ g[a[j]].push(b[j]); ind[b[j]]++; } found=true; break; } } if(!found&&a.length>b.length) return ""; } const q=[]; for(const c in ind) if(ind[c]===0) q.push(c); let out=""; while(q.length){ q.sort(); const c=q.shift(); out+=c; for(const nxt of g[c]){ if(--ind[nxt]===0) q.push(nxt); } } return out.length===Object.keys(ind).length?out:""; }`,
  dsah39: `function solution(times,n,k){ const g=Array.from({length:n+1},()=>[]); for(const [u,v,w] of times) g[u].push([v,w]); const dist=Array(n+1).fill(Infinity); dist[k]=0; const pq=[[0,k]]; while(pq.length){ pq.sort((a,b)=>a[0]-b[0]); const [d,u]=pq.shift(); if(d>dist[u]) continue; for(const [v,w] of g[u]){ if(d+w<dist[v]){ dist[v]=d+w; pq.push([d+w,v]); } } } let mx=0; for(let i=1;i<=n;i++){ if(dist[i]===Infinity) return -1; mx=Math.max(mx,dist[i]); } return mx; }`
};

let fails = 0, count = 0;
for (const q of qs) {
  const s = solvers[q.id];
  if (!s) { console.log('NO-SOLVER', q.id); continue; }
  count++;
  const g = gradeCode(s, q.testCases, q.codeLang || 'javascript');
  if (!g.correct) { fails++; console.log('FAIL', q.id, '->', JSON.stringify(g.detail)); }
  else console.log('OK  ', q.id, g.passed + '/' + g.total, q.testCases[0].ops ? '(design)' : '');
}
console.log('\n' + count + ' checked, ' + (fails ? fails + ' FAILURES' : 'ALL PASSED'));
process.exit(fails ? 1 : 0);
