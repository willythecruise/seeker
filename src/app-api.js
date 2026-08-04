/* ============================================================
   Orion — API client: talks to the Express/MongoDB backend
   ============================================================ */

const API = (() => {
  let token = store.get('orion.token', null);

  async function req(method, path, body) {
    const opts = { method, headers: {} };
    if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
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
      if (res.status === 401 && !path.startsWith('/api/auth/')) {
        setToken(null);
        S.auth = null;
      }
      throw err;
    }
    return data;
  }

  function setToken(t) {
    token = t || null;
    if (t) store.set('orion.token', t); else store.del('orion.token');
  }

  return {
    setToken,
    get token() { return token; },
    get: p => req('GET', p),
    post: (p, b) => req('POST', p, b || {}),
    put: (p, b) => req('PUT', p, b || {}),
    patch: (p, b) => req('PATCH', p, b || {}),
    del: p => req('DELETE', p)
  };
})();
