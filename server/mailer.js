'use strict';
/* Outbound email via Resend (https://resend.com).
   Configure with RESEND_API_KEY in the environment (`.env`). RESEND_FROM is
   the sender (must be a domain verified in Resend; defaults to the Resend
   sandbox sender). MAIL_TO is where signup notifications go (defaults to
   register@seekerhq.co).
   If RESEND_API_KEY is missing the mailer degrades to a console log so the
   app keeps working in local development. Sending never throws. */

const RESEND_URL = 'https://api.resend.com/emails';

function mailTo() {
  return String(process.env.MAIL_TO || 'register@seekerhq.co').trim();
}

function mailFrom() {
  return String(process.env.RESEND_FROM || 'Seeker <onboarding@resend.dev>').trim();
}

/* Send an email; never throws. Returns { ok: true } on success or
   { ok: false, error } when Resend is unconfigured or the send fails. */
async function sendMail({ to, subject, html }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[mailer] Resend not configured — would send to "${to}":\n  Subject: ${subject}\n  ${String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`);
    return { ok: false, error: 'Resend not configured' };
  }
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({ from: mailFrom(), to, subject, html })
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const err = `Resend ${res.status}: ${body}`;
      console.error('[mailer] send failed:', err);
      return { ok: false, error: err };
    }
    return { ok: true };
  } catch (e) {
    console.error('[mailer] send failed:', e.message);
    return { ok: false, error: e.message };
  }
}

function categoryListHTML(cats) {
  return (cats || []).map(c => {
    const label = c.replace(/-/g, ' ').replace(/\b\w/g, x => x.toUpperCase());
    return `<li>${label}</li>`;
  }).join('');
}

/* Notify the recruitment inbox that a new signup request arrived. */
function notifyNewSignup(r) {
  const cats = categoryListHTML(r.categories);
  return sendMail({
    to: mailTo(),
    subject: `New signup request: ${r.displayName || r.username}`,
    html:
      '<div style="font-family:Arial,sans-serif;color:#1f2430">' +
        '<h2 style="margin:0 0 4px">New candidate signup request</h2>' +
        `<p style="color:#66708a;margin:0 0 16px">Someone requested an account on Seeker.</p>` +
        '<table style="border-collapse:collapse;font-size:14px">' +
          `<tr><td style="padding:4px 12px 4px 0;color:#66708a">Name</td><td style="padding:4px 0"><strong>${r.displayName || '—'}</strong></td></tr>` +
          `<tr><td style="padding:4px 12px 4px 0;color:#66708a">Username</td><td style="padding:4px 0">@${r.username}</td></tr>` +
          `<tr><td style="padding:4px 12px 4px 0;color:#66708a">Email</td><td style="padding:4px 0">${r.email}</td></tr>` +
          `<tr><td style="padding:4px 12px 4px 0;color:#66708a">Requested fields</td><td style="padding:4px 0"><ul style="margin:4px 0 0 18px;padding:0">${cats}</ul></td></tr>` +
        '</table>' +
        '<p style="color:#66708a;font-size:13px;margin:20px 0 0">Approve or reject this request from the admin console &gt; Signups.</p>' +
      '</div>'
  });
}

/* Tell the candidate their signup request was received. */
function sendSignupReceived({ email, username, displayName, categories }) {
  const cats = categoryListHTML(categories);
  return sendMail({
    to: email,
    subject: 'Your Seeker signup request',
    html:
      '<div style="font-family:Arial,sans-serif;color:#1f2430">' +
        `<h2 style="margin:0 0 8px">Thanks${displayName ? ', ' + displayName : ''} — request received</h2>` +
        '<p style="color:#66708a;margin:0 0 16px">We got your request for a candidate account on Seeker. An admin will review it and email you your sign-in details once approved.</p>' +
        '<table style="border-collapse:collapse;font-size:14px;margin-bottom:16px">' +
          `<tr><td style="padding:4px 12px 4px 0;color:#66708a">Username</td><td style="padding:4px 0"><strong>@${username}</strong></td></tr>` +
          `<tr><td style="padding:4px 12px 4px 0;color:#66708a">Requested fields</td><td style="padding:4px 0"><ul style="margin:4px 0 0 18px;padding:0">${cats}</ul></td></tr>` +
        '</table>' +
        '<p style="color:#66708a;font-size:13px;margin:0">You can sign in as soon as your account is ready.</p>' +
      '</div>'
  });
}

/* Tell the candidate their account is ready. */
function sendApproval({ email, username, displayName, tempPassword }) {
  return sendMail({
    to: email,
    subject: 'Your Seeker account is ready',
    html:
      '<div style="font-family:Arial,sans-serif;color:#1f2430">' +
        `<h2 style="margin:0 0 8px">Welcome${displayName ? ', ' + displayName : ''}!</h2>` +
        '<p style="color:#66708a;margin:0 0 16px">An admin approved your signup request. Sign in to the candidate portal with these details:</p>' +
        '<table style="border-collapse:collapse;font-size:14px;margin-bottom:16px">' +
          `<tr><td style="padding:4px 12px 4px 0;color:#66708a">Username</td><td style="padding:4px 0"><strong>@${username}</strong></td></tr>` +
          `<tr><td style="padding:4px 12px 4px 0;color:#66708a">Temporary password</td><td style="padding:4px 0"><code style="background:#eef1f7;padding:2px 8px;border-radius:6px">${tempPassword}</code></td></tr>` +
        '</table>' +
        '<p style="color:#66708a;font-size:13px;margin:0">Please change your password after signing in.</p>' +
      '</div>'
  });
}

/* Tell the candidate their request was declined. */
function sendRejection({ email, username }) {
  return sendMail({
    to: email,
    subject: 'Your Seeker signup request',
    html:
      '<div style="font-family:Arial,sans-serif;color:#1f2430">' +
        '<h2 style="margin:0 0 8px">Signup request update</h2>' +
        `<p style="color:#66708a;margin:0">Thanks for your interest${username ? ' (' + username + ')' : ''}, but your signup request was not approved at this time. Contact the recruiting team if you think this is a mistake.</p>` +
      '</div>'
  });
}

/* Tell the candidate that new test(s) were assigned to them. */
function sendTestAssigned({ email, name, tests }) {
  const rows = (tests || []).map(t =>
    `<li style="margin:2px 0"><strong>${t}</strong></li>`).join('');
  return sendMail({
    to: email,
    subject: (tests || []).length === 1 ? `You have a new test: ${(tests || [])[0]}` : 'New tests assigned to you',
    html:
      '<div style="font-family:Arial,sans-serif;color:#1f2430">' +
        `<h2 style="margin:0 0 8px">Hello${name ? ' ' + name : ''}!</h2>` +
        '<p style="color:#66708a;margin:0 0 16px">The following test' + ((tests || []).length === 1 ? ' has been' : 's have been') + ' assigned to you on Seeker:</p>' +
        '<ul style="color:#1f2430;font-size:14px;margin:0 0 16px 18px;padding:0">' + rows + '</ul>' +
        '<p style="color:#66708a;font-size:13px;margin:0">Sign in to the candidate portal to see your tests and get started.</p>' +
      '</div>'
  });
}

module.exports = { sendMail, notifyNewSignup, sendSignupReceived, sendApproval, sendRejection, sendTestAssigned };
