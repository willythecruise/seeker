#!/usr/bin/env node
/* Screenshot walkthrough of the Orion suite (headless Chrome → live server). */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'shots');
fs.mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:3000';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', e => console.log('  [pageerror]', e.message.slice(0, 160)));
  await page.setViewport({ width: 1280, height: 820, deviceScaleFactor: 1 });

  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.auth-title');
  await sleep(400);

  const shot = async name => { await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('  📸', name); };
  const click = async sel => { await page.waitForSelector(sel); await page.click(sel); await sleep(400); };
  const type = async (sel, txt) => { await page.waitForSelector(sel); await page.click(sel, { clickCount: 3 }); await page.type(sel, txt); await sleep(120); };

  /* 1. Login screen */
  await shot('01-login');
  await type('#loginUser', 'admin');
  await type('#loginPass', 'admin1234');
  await click('#loginForm button[type="submit"]');
  await page.waitForSelector('.page-title');
  await sleep(600);

  /* 2. Console dashboard */
  await shot('02-dashboard');

  /* 3. Tests */
  await click('[data-action="tab"][data-value="tests"]');
  await shot('03-tests');

  /* 4. Test editor */
  await click('[data-action="new-test"]');
  await shot('04-test-editor');
  await click('[data-action="editor-cancel"]');

  /* 5. Questions bank */
  await click('[data-action="tab"][data-value="questions"]');
  await shot('05-questions');

  /* 6. Question modal (code question) */
  await click('[data-action="add-question"]');
  await shot('06-question-modal');
  await click('[data-action="close-modal"]');

  /* 7. Admins (superadmin) */
  await click('[data-action="tab"][data-value="admins"]');
  await shot('07-admins');
  await click('[data-action="add-admin"]');
  await shot('08-add-admin-modal');
  await click('[data-action="close-modal"]');

  /* 8. Candidate home */
  await click('[data-action="mode"][data-value="candidate"]');
  await page.waitForFunction(() => document.querySelectorAll('.test-card').length > 0);
  await sleep(400);
  await shot('09-candidate-home');

  /* 9. Start modal */
  await click('.test-card [data-action="start-test"]');
  await shot('10-start-modal');
  await type('#startName', 'Ada Lovelace');
  await click('[data-action="begin-attempt"]');
  await page.waitForSelector('.q-text');
  await sleep(600);

  /* 10. Runner q1 */
  await shot('11-runner-q1');

  /* 11. Runner with a code question (jump to one) */
  const jumped = await page.evaluate(() => {
    const idx = [...document.querySelectorAll('#palette .palette-item')].findIndex(b => {
      const i = +b.dataset.idx;
      return i >= 0;
    });
    return idx;
  });
  await page.evaluate(() => {
    const items = [...document.querySelectorAll('#palette .palette-item')];
    const idx = items.findIndex(() => true);
    if (idx >= 0) items[idx].click();
  });
  await sleep(300);

  // answer first option of the current question, then flag, then submit
  await page.evaluate(() => { const o = document.querySelector('.opts .opt'); if (o) o.click(); });
  await sleep(200);
  await page.evaluate(() => { const f = document.querySelector('[data-action="flag"]'); if (f) f.click(); });
  await sleep(300);
  await click('[data-action="ask-submit"]');
  await shot('12-submit-confirm');
  await click('[data-action="modal-confirm"]');
  await sleep(1600);
  await shot('13-results');

  /* 14. Admin results table */
  await click('[data-action="back-home"]');
  await click('[data-action="mode"][data-value="console"]');
  await page.waitForFunction(() => document.querySelector('[data-action="tab"][data-value="results"]'));
  await click('[data-action="tab"][data-value="results"]');
  await page.waitForSelector('.tbl tbody tr');
  await shot('14-results-table');

  /* 15. Attempt detail */
  await click('[data-action="view-attempt"]');
  await page.waitForSelector('.modal .review-item');
  await shot('15-attempt-detail');
  await click('[data-action="close-modal"]');

  /* 16. Mobile */
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await click('[data-action="tab"][data-value="dashboard"]');
  await shot('16-mobile-dashboard');
  await click('[data-action="mode"][data-value="candidate"]');
  await page.waitForFunction(() => document.querySelectorAll('.test-card').length > 0);
  await shot('17-mobile-candidate');

  await browser.close();
  console.log('\nScreenshots saved to', OUT);
})().catch(e => { console.error('CAPTURE FAIL:', e); process.exit(1); });
