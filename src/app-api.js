/* ============================================================
   Orion — API client: talks to the Express/MongoDB backend
   Admin and candidate sessions use separate bearer tokens.
   ============================================================ */

const API = (() => {
  let token = store.get('orion.token', null);
  let candToken = store.get('orion.candToken', null);

  async function req(method, path, body) {
    const opts = { method, headers: {} };
    if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    const isCandidate = path.startsWith('/api/candidate/');
    const t = isCandidate ? candToken : token;
    if (t) opts.headers['Authorization'] = 'Bearer ' + t;
    let res;
    try {
      res = await fetch(path, opts);
    } catch (e) {
      throw new Error('Cannot reach the server — is it running?');
    }
    let data = null;
    try { data = await res.json(); } catch (e) { /* non-JSON */ }
    if (!res.ok) {
      const err = new Error((data && data.error) || 'Request failed (' + res.status + ')');
      err.status = res.status;
      err.data = data;
      if (res.status === 401) {
        if (isCandidate) { setCandToken(null); S.candAuth = null; }
        else if (!path.startsWith('/api/auth/')) { setToken(null); S.auth = null; }
      }
      throw err;
    }
    return data;
  }

  function setToken(t) {
    token = t || null;
    if (t) store.set('orion.token', t); else store.del('orion.token');
  }

  function setCandToken(t) {
    candToken = t || null;
    if (t) store.set('orion.candToken', t); else store.del('orion.candToken');
  }

  return {
    setToken,
    setCandToken,
    get token() { return token; },
    get candToken() { return candToken; },
    get: p => req('GET', p),
    post: (p, b) => req('POST', p, b || {}),
    put: (p, b) => req('PUT', p, b || {}),
    patch: (p, b) => req('PATCH', p, b || {}),
    del: p => req('DELETE', p)
  };
})();
