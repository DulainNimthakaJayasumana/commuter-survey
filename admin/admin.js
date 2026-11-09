import { firebaseConfig, COLLECTION } from "/firebase-config.js";
import { QUESTIONS } from "/questions.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const XLSX_URL = "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";
// Demo mode: Firebase not configured, or open /admin/?demo to try the page with sample data.
const DEMO = !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("YOUR_") || new URLSearchParams(location.search).has("demo");
const TARGET = 250; // planned sample size from the proposal
const PAGE_SIZE = 50;

const $root = document.getElementById("root");
const $who = document.getElementById("who");
const $dlg = document.getElementById("editDlg");
const $colsDlg = document.getElementById("colsDlg");
const $toast = document.getElementById("toast");

const Q = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
const FIELDS = QUESTIONS.map((q) => q.id);
const LANG_NAME = { en: "English", si: "Sinhala", ta: "Tamil" };

let fb = null;          // { auth, A, db, fs }
let user = null;
let rows = [];          // [{ id, ...data, _ts: Date }]
let surveyOpen = true;
let unsub = [];
let filter = { status: "complete", lang: "", search: "" };
let page = 0;
let denied = false;

// Hidden columns are remembered in this browser and also left out of the Excel download.
const HIDDEN_KEY = "admin-hidden-cols";
let hidden = new Set(["A1", "A2"]);
try { const h = JSON.parse(localStorage.getItem(HIDDEN_KEY)); if (Array.isArray(h)) hidden = new Set(h); } catch {}
const visibleFields = () => FIELDS.filter((f) => !hidden.has(f));
function saveHidden() { try { localStorage.setItem(HIDDEN_KEY, JSON.stringify([...hidden])); } catch {} }

// ─────────────────────────────────────────────── helpers
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function toast(msg) {
  $toast.textContent = msg;
  $toast.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => $toast.classList.remove("show"), 2600);
}

/** English label for a stored code. */
function label(id, v) {
  if (v === undefined || v === null || v === "") return "";
  const q = Q[id];
  if (!q) return String(v);
  if (q.type === "scale7") return `${v > 0 ? "+" : ""}${v} ${q.points[v + 3]?.en ?? ""}`.trim();
  const o = q.options.find((o) => o.v === v);
  return o ? o.label.en : String(v);
}
const shortLabel = (id, v) => {
  const l = label(id, v);
  return l.length > 28 ? l.slice(0, 26) + "…" : l;
};
const fmtDate = (d) => d ? d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// ─────────────────────────────────────────────── firebase
async function loadFirebase() {
  const [{ initializeApp }, A, fs] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-auth.js`),
    import(`${SDK}/firebase-firestore.js`),
  ]);
  const app = initializeApp(firebaseConfig);
  return { auth: A.getAuth(app), A, db: fs.getFirestore(app), fs };
}

function stopListening() {
  unsub.forEach((u) => u());
  unsub = [];
}

function listen() {
  const { db, fs } = fb;
  unsub.push(fs.onSnapshot(
    fs.query(fs.collection(db, COLLECTION), fs.orderBy("submittedAt", "desc")),
    (snap) => {
      rows = snap.docs.map((d) => {
        const data = d.data();
        return { id: d.id, ...data, _ts: data.submittedAt?.toDate?.() ?? null };
      });
      renderApp();
    },
    (err) => {
      console.error(err);
      if (err.code === "permission-denied") renderDenied();
      else renderError(err.message);
    },
  ));
  unsub.push(fs.onSnapshot(fs.doc(db, "config", "survey"),
    (snap) => { surveyOpen = !snap.exists() || snap.data().open !== false; renderApp(); },
    (err) => console.warn("config", err)));
}

async function setOpen(open) {
  if (DEMO) { surveyOpen = open; renderApp(); return toast(open ? "Survey reopened (demo)" : "Survey stopped (demo)"); }
  const { db, fs } = fb;
  await fs.setDoc(fs.doc(db, "config", "survey"), { open, updatedAt: fs.serverTimestamp(), updatedBy: user.email }, { merge: true });
  toast(open ? "Survey is open — accepting responses" : "Survey stopped — new responses are blocked");
}

async function saveRow(id, changes, removed) {
  if (DEMO) {
    const r = rows.find((r) => r.id === id);
    Object.assign(r, changes);
    removed.forEach((k) => delete r[k]);
    return;
  }
  const { db, fs } = fb;
  const upd = { ...changes };
  removed.forEach((k) => (upd[k] = fs.deleteField()));
  await fs.updateDoc(fs.doc(db, COLLECTION, id), upd);
}

async function deleteRow(id) {
  if (DEMO) { rows = rows.filter((r) => r.id !== id); return; }
  const { db, fs } = fb;
  await fs.deleteDoc(fs.doc(db, COLLECTION, id));
}

// ─────────────────────────────────────────────── views
function renderWho() {
  if (!user) { $who.innerHTML = ""; return; }
  $who.innerHTML = `<span>${esc(user.email)}</span>${DEMO ? "" : `<button id="signOut">Sign out</button>`}`;
  document.getElementById("signOut")?.addEventListener("click", () => { stopListening(); fb.A.signOut(fb.auth); });
}

function renderSignIn() {
  renderWho();
  $root.innerHTML = `
    <div class="card signin">
      <h2>Admin sign-in</h2>
      <p>Sign in with a Google account that is on the admin list to see responses, download data and open or close the survey.</p>
      <button class="btn primary" id="googleBtn">
        <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#fff" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/></svg>
        Sign in with Google
      </button>
    </div>`;
  document.getElementById("googleBtn").addEventListener("click", async () => {
    try {
      await fb.A.signInWithPopup(fb.auth, new fb.A.GoogleAuthProvider());
    } catch (e) {
      console.error(e);
      toast(e.code === "auth/unauthorized-domain" ? "This domain isn't authorised in Firebase Authentication settings." : "Sign-in failed: " + (e.code || e.message));
    }
  });
}

function renderDenied() {
  denied = true;
  renderWho();
  $root.innerHTML = `
    <div class="card signin">
      <h2>No access</h2>
      <p><b>${esc(user?.email)}</b> isn't on the admin list. Ask the project owner to add this email in <code>firestore.rules</code> (the <code>isAdmin()</code> list) and publish the rules.</p>
      <button class="btn" id="out">Sign in with another account</button>
    </div>`;
  document.getElementById("out").addEventListener("click", () => { stopListening(); fb.A.signOut(fb.auth); });
}

function renderError(msg) {
  $root.innerHTML = `<div class="card signin"><h2>Something went wrong</h2><p>${esc(msg)}</p></div>`;
}

function filtered() {
  const s = filter.search.trim().toLowerCase();
  return rows.filter((r) =>
    (!filter.status || r.status === filter.status) &&
    (!filter.lang || r.lang === filter.lang) &&
    (!s || [r.id, r.A6_other, ...FIELDS.map((f) => label(f, r[f]))].join(" ").toLowerCase().includes(s)));
}

function count(list, id) {
  const q = Q[id];
  const m = new Map(q.options.map((o) => [o.v, 0]));
  list.forEach((r) => { if (m.has(r[id])) m.set(r[id], m.get(r[id]) + 1); });
  return q.options.map((o) => ({ label: o.label.en, n: m.get(o.v) }));
}

function hbars(items) {
  const max = Math.max(1, ...items.map((i) => i.n));
  if (!items.some((i) => i.n)) return `<div class="empty">No responses yet.</div>`;
  return `<div class="hbars">${items.map((i) => `
    <div class="hbar"><span class="name" title="${esc(i.label)}">${esc(i.label)}</span>
      <span class="track"><span class="fill" style="width:${(i.n / max) * 100}%;display:block"></span></span>
      <span class="n">${i.n}</span></div>`).join("")}</div>`;
}

/** Average of C1–C3 (−3 stressed … +3 relaxed) per main transport mode. */
function feelingByMode(list) {
  const items = Q.B2.options.map((o) => {
    const vals = list.filter((r) => r.B2 === o.v && [r.C1, r.C2, r.C3].every((x) => typeof x === "number"))
      .map((r) => (r.C1 + r.C2 + r.C3) / 3);
    return { label: o.label.en, n: vals.length, avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null };
  });
  if (!items.some((i) => i.n)) return `<div class="empty">No responses yet.</div>`;
  return `<div class="hbars diverge">${items.map((i) => {
    if (i.avg === null) return `<div class="hbar"><span class="name">${esc(i.label)}</span><span class="track"><span class="mid"></span></span><span class="n">–</span></div>`;
    const w = (Math.abs(i.avg) / 3) * 50;
    const left = i.avg < 0 ? 50 - w : 50;
    return `<div class="hbar"><span class="name" title="${esc(i.label)} (n=${i.n})">${esc(i.label)} <span style="color:var(--ink-3)">n=${i.n}</span></span>
      <span class="track"><span class="fill ${i.avg < 0 ? "neg" : ""}" style="left:${left}%;width:${w}%"></span><span class="mid"></span></span>
      <span class="n">${i.avg > 0 ? "+" : ""}${i.avg.toFixed(1)}</span></div>`;
  }).join("")}</div>
  <div class="axis"><span>−3 stressed</span><span>0</span><span>+3 relaxed</span></div>`;
}

function perDay(list) {
  const days = [];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = 13; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate() - i); days.push({ key: dayKey(d), d, n: 0 }); }
  const idx = Object.fromEntries(days.map((d, i) => [d.key, i]));
  list.forEach((r) => { if (r._ts) { const k = dayKey(r._ts); if (k in idx) days[idx[k]].n++; } });
  const max = Math.max(1, ...days.map((d) => d.n));
  return `<div class="cols">${days.map((d, i) => `
    <div class="col" title="${d.key}: ${d.n}"><span class="cnt">${d.n || ""}</span>
      <div class="bar" style="height:${(d.n / max) * 100}%"></div>
      <span class="d">${(13 - i) % 2 === 0 ? `${d.d.getDate()}/${d.d.getMonth() + 1}` : "&nbsp;"}</span></div>`).join("")}</div>`;
}

function renderApp() {
  if (!user || denied) return;
  renderWho();
  const complete = rows.filter((r) => r.status === "complete");
  const screened = rows.length - complete.length;
  const todayKey = dayKey(new Date());
  const today = rows.filter((r) => r._ts && dayKey(r._ts) === todayKey && r.status === "complete").length;
  const durs = complete.map((r) => r.durationSec).filter((x) => typeof x === "number" && x > 0 && x < 3600).sort((a, b) => a - b);
  const median = durs.length ? durs[Math.floor(durs.length / 2)] : null;
  const pct = Math.min(100, Math.round((complete.length / TARGET) * 100));

  const list = filtered();
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  page = Math.min(page, pages - 1);
  const shown = list.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const scrollY = window.scrollY;
  $root.innerHTML = `
    ${DEMO ? `<div class="banner demo"><b>Demo mode.</b> Firebase isn't configured yet, so this page shows made-up sample data. Changes here aren't saved.</div>` : ""}

    <div class="card status">
      <div class="state">
        <span class="pill ${surveyOpen ? "open" : "closed"}">${surveyOpen ? "Accepting responses" : "Stopped"}</span>
        <span class="desc">${surveyOpen ? "Anyone with the link can fill the survey." : "Visitors see a “survey closed” page. Existing data is kept."}</span>
      </div>
      <div class="status-actions">
        <label style="display:flex;align-items:center;gap:8px;font-weight:500">
          ${surveyOpen ? "Open" : "Closed"}
          <button class="switch" id="openSwitch" role="switch" aria-checked="${surveyOpen}" aria-label="Accept responses"></button>
        </label>
        <button class="btn primary" id="xlsxBtn">
          <svg width="15" height="15" viewBox="0 0 24 24"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Download Excel
        </button>
      </div>
    </div>

    <div class="kpis">
      <div class="card kpi"><div class="label">Complete responses</div><div class="value">${complete.length}</div>
        <div class="target"><div style="width:${pct}%"></div></div><div class="sub">${pct}% of target ${TARGET}</div></div>
      <div class="card kpi"><div class="label">Today</div><div class="value">${today}</div><div class="sub">complete, since midnight</div></div>
      <div class="card kpi"><div class="label">Screened out</div><div class="value">${screened}</div>
        <div class="sub">${rows.filter((r) => r.status === "declined").length} declined · ${rows.filter((r) => r.status === "ineligible").length} &lt; 3 days/week</div></div>
      <div class="card kpi"><div class="label">Median time</div><div class="value">${median ? `${Math.floor(median / 60)}:${String(median % 60).padStart(2, "0")}` : "–"}</div><div class="sub">minutes to complete</div></div>
      <div class="card kpi"><div class="label">Language</div><div class="value" style="font-size:16px;line-height:1.5;padding-top:4px">
        ${["si", "en", "ta"].map((l) => `${LANG_NAME[l]} <b>${complete.filter((r) => r.lang === l).length}</b>`).join("<br>")}</div></div>
    </div>

    <div class="charts">
      <div class="card"><h3>Complete responses per day <small>last 14 days</small></h3>${perDay(complete)}</div>
      <div class="card"><h3>Journey feeling by main transport <small>avg of C1–C3</small></h3>${feelingByMode(complete)}</div>
      <div class="card"><h3>Main transport mode <small>B2</small></h3>${hbars(count(complete, "B2"))}</div>
      <div class="card"><h3>One-way distance <small>B1</small></h3>${hbars(count(complete, "B1"))}</div>
      <div class="card"><h3>Vehicle changes <small>B3</small></h3>${hbars(count(complete, "B3"))}</div>
      <div class="card"><h3>Stress these days <small>C4</small></h3>${hbars(count(complete, "C4"))}</div>
      <div class="card"><h3>Faculty <small>A3</small></h3>${hbars(count(complete, "A3"))}</div>
      <div class="card"><h3>Seat during journey <small>B6</small></h3>${hbars(count(complete, "B6"))}</div>
    </div>

    <div class="card">
      <div class="tbl-head">
        <h3>Responses <small>${list.length} shown of ${rows.length}</small></h3>
        <div class="filters">
          <select id="fStatus" aria-label="Status">
            <option value="">All statuses</option>
            ${["complete", "declined", "ineligible"].map((s) => `<option value="${s}" ${filter.status === s ? "selected" : ""}>${s[0].toUpperCase() + s.slice(1)}</option>`).join("")}
          </select>
          <select id="fLang" aria-label="Language">
            <option value="">All languages</option>
            ${["si", "en", "ta"].map((l) => `<option value="${l}" ${filter.lang === l ? "selected" : ""}>${LANG_NAME[l]}</option>`).join("")}
          </select>
          <input id="fSearch" type="search" placeholder="Search…" value="${esc(filter.search)}" />
          <button class="btn" id="colsBtn">
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
            Columns${hidden.size ? ` <span style="color:var(--ink-3)">(${hidden.size} hidden)</span>` : ""}
          </button>
        </div>
      </div>
      <div class="scroll">
        <table>
          <thead><tr>
            <th>Submitted</th><th>Status</th><th>Lang</th>
            ${visibleFields().map((f) => `<th title="${esc(Q[f].q.en)}">${f}</th>`).join("")}
            <th></th>
          </tr></thead>
          <tbody>
            ${shown.length ? shown.map((r) => `
              <tr>
                <td>${fmtDate(r._ts)}</td>
                <td><span class="tag ${esc(r.status)}">${esc(r.status)}</span></td>
                <td>${esc(r.lang?.toUpperCase())}</td>
                ${visibleFields().map((f) => {
                  const v = r[f];
                  if (Q[f].type === "scale7" || typeof v === "number") return `<td class="num" title="${esc(label(f, v))}">${v ?? ""}</td>`;
                  const l = f === "A6" && v === "other" && r.A6_other ? `Other: ${r.A6_other}` : shortLabel(f, v);
                  return `<td title="${esc(label(f, v))}">${esc(l)}</td>`;
                }).join("")}
                <td class="actions">
                  <button class="btn sm" data-edit="${esc(r.id)}">Edit</button>
                  <button class="btn sm danger" data-del="${esc(r.id)}">Delete</button>
                </td>
              </tr>`).join("") : `<tr><td colspan="30" class="empty" style="text-align:center">No responses match.</td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="pager">
        <span>Page ${page + 1} of ${pages}</span>
        <span class="btns">
          <button class="btn sm" id="prevPg" ${page === 0 ? "disabled" : ""}>← Prev</button>
          <button class="btn sm" id="nextPg" ${page >= pages - 1 ? "disabled" : ""}>Next →</button>
        </span>
      </div>
    </div>`;
  window.scrollTo(0, scrollY);
  bind();
}

function bind() {
  document.getElementById("openSwitch").addEventListener("click", async () => {
    const next = !surveyOpen;
    if (!next && !confirm("Stop accepting responses?\n\nPeople opening the link will see a “survey closed” page. You can reopen it any time.")) return;
    try { await setOpen(next); } catch (e) { console.error(e); toast("Couldn't change status: " + (e.code || e.message)); }
  });
  document.getElementById("xlsxBtn").addEventListener("click", exportExcel);
  document.getElementById("colsBtn").addEventListener("click", openColumns);
  document.getElementById("fStatus").addEventListener("change", (e) => { filter.status = e.target.value; page = 0; renderApp(); });
  document.getElementById("fLang").addEventListener("change", (e) => { filter.lang = e.target.value; page = 0; renderApp(); });
  const s = document.getElementById("fSearch");
  s.addEventListener("input", (e) => {
    filter.search = e.target.value; page = 0;
    clearTimeout(bind.t);
    bind.t = setTimeout(() => { renderApp(); const el = document.getElementById("fSearch"); el.focus(); el.setSelectionRange(el.value.length, el.value.length); }, 250);
  });
  document.getElementById("prevPg").addEventListener("click", () => { page--; renderApp(); });
  document.getElementById("nextPg").addEventListener("click", () => { page++; renderApp(); });
  $root.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => openEdit(b.dataset.edit)));
  $root.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", async () => {
    const r = rows.find((x) => x.id === b.dataset.del);
    if (!confirm(`Permanently delete this response?\n\nSubmitted ${fmtDate(r._ts)} (${r.status}). This can't be undone.`)) return;
    try { await deleteRow(r.id); toast("Response deleted"); if (DEMO) renderApp(); }
    catch (e) { console.error(e); toast("Delete failed: " + (e.code || e.message)); }
  }));
}

// ─────────────────────────────────────────────── edit dialog
function openEdit(id) {
  const r = rows.find((x) => x.id === id);
  const sel = (name, opts, cur) => `<select name="${name}">
      <option value="">— blank —</option>
      ${opts.map(([v, l]) => `<option value='${esc(JSON.stringify(v))}' ${JSON.stringify(v) === JSON.stringify(cur) ? "selected" : ""}>${esc(l)}</option>`).join("")}
    </select>`;
  const optsFor = (q) => q.type === "scale7"
    ? [-3, -2, -1, 0, 1, 2, 3].map((v) => [v, `${v > 0 ? "+" : ""}${v}  ${q.points[v + 3].en}`])
    : q.options.map((o) => [o.v, `${typeof o.v === "number" ? o.v + " · " : ""}${o.label.en}`]);

  $dlg.innerHTML = `
    <form method="dialog" id="editForm">
      <div class="dlg-head">
        <div><h3>Edit response</h3><div class="meta">${esc(r.id)} · ${fmtDate(r._ts)} · ${LANG_NAME[r.lang] || ""}</div></div>
        <button class="btn sm" value="cancel" formnovalidate>✕</button>
      </div>
      <div class="dlg-body">
        <div class="field"><label><b>Status</b></label>
          ${sel("status", [["complete", "complete"], ["declined", "declined"], ["ineligible", "ineligible"]], r.status).replace('<option value="">— blank —</option>', "")}</div>
        <div class="field"><label><b>Language</b></label>
          ${sel("lang", [["si", "Sinhala"], ["en", "English"], ["ta", "Tamil"]], r.lang).replace('<option value="">— blank —</option>', "")}</div>
        ${QUESTIONS.map((q) => `
          <div class="field"><label><b>${q.id}</b> · ${esc(q.q.en)}</label>${sel(q.id, optsFor(q), r[q.id])}</div>
          ${q.id === "A6" ? `<div class="field"><label><b>A6 other</b> · text</label><input name="A6_other" maxlength="120" value="${esc(r.A6_other || "")}"></div>` : ""}`).join("")}
      </div>
      <div class="dlg-foot">
        <button class="btn" value="cancel" formnovalidate>Cancel</button>
        <button class="btn primary" value="save" id="saveBtn">Save changes</button>
      </div>
    </form>`;
  $dlg.showModal();
  $dlg.onclose = async () => {
    if ($dlg.returnValue !== "save") return;
    const fd = new FormData(document.getElementById("editForm"));
    const changes = {}; const removed = [];
    for (const [k, raw] of fd.entries()) {
      if (k === "A6_other") {
        const t = String(raw).trim().slice(0, 120);
        if (t) { if (t !== r.A6_other) changes.A6_other = t; } else if (r.A6_other !== undefined) removed.push("A6_other");
        continue;
      }
      if (raw === "") { if (r[k] !== undefined) removed.push(k); continue; }
      const v = JSON.parse(raw);
      if (JSON.stringify(v) !== JSON.stringify(r[k])) changes[k] = v;
    }
    if (!Object.keys(changes).length && !removed.length) return toast("No changes");
    try {
      await saveRow(r.id, changes, removed);
      toast(`Saved (${Object.keys(changes).length + removed.length} field${Object.keys(changes).length + removed.length > 1 ? "s" : ""} changed)`);
      if (DEMO) renderApp();
    } catch (e) { console.error(e); toast("Save failed: " + (e.code || e.message)); }
  };
}

// ─────────────────────────────────────────────── columns
function openColumns() {
  const filled = (f) => rows.filter((r) => r[f] !== undefined && r[f] !== "").length;
  $colsDlg.innerHTML = `
    <form method="dialog">
      <div class="dlg-head">
        <div><h3>Columns</h3><div class="meta">Unticked columns are hidden in the table and left out of the Excel download.</div></div>
        <button class="btn sm" value="close">✕</button>
      </div>
      <div class="cols-list">
        <div class="cols-tools">
          <button type="button" class="btn sm" data-all="show">Show all</button>
          <button type="button" class="btn sm" data-all="hide">Hide all</button>
        </div>
        ${QUESTIONS.map((q) => `
          <div class="col-row">
            <label class="col-check">
              <input type="checkbox" data-col="${q.id}" ${hidden.has(q.id) ? "" : "checked"}>
              <span><b>${q.id}</b> ${esc(q.q.en)}</span>
            </label>
            <span class="col-n" title="Responses with a value">${filled(q.id)}</span>
            <button type="button" class="btn sm danger" data-clear="${q.id}" ${filled(q.id) ? "" : "disabled"}>Clear data</button>
          </div>`).join("")}
      </div>
      <div class="dlg-foot"><button class="btn primary" value="close">Done</button></div>
    </form>`;
  $colsDlg.querySelectorAll("[data-col]").forEach((cb) => cb.addEventListener("change", () => {
    cb.checked ? hidden.delete(cb.dataset.col) : hidden.add(cb.dataset.col);
    saveHidden();
  }));
  $colsDlg.querySelectorAll("[data-all]").forEach((b) => b.addEventListener("click", () => {
    hidden = b.dataset.all === "hide" ? new Set(FIELDS) : new Set();
    saveHidden();
    $colsDlg.querySelectorAll("[data-col]").forEach((cb) => (cb.checked = !hidden.has(cb.dataset.col)));
  }));
  $colsDlg.querySelectorAll("[data-clear]").forEach((b) => b.addEventListener("click", () => clearColumn(b.dataset.clear, b)));
  $colsDlg.onclose = () => renderApp();
  $colsDlg.showModal();
}

/** Permanently removes one question's answers from every response. */
async function clearColumn(id, btn) {
  const targets = rows.filter((r) => r[id] !== undefined || (id === "A6" && r.A6_other !== undefined));
  const typed = prompt(
    `Permanently delete ALL ${id} answers from ${targets.length} response(s)?\n\n` +
    `"${Q[id].q.en}"\n\nThis can't be undone. Download an Excel backup first.\n\nType ${id} to confirm:`);
  if (typed === null) return;
  if (typed.trim().toUpperCase() !== id) return toast("Not deleted — confirmation didn't match");
  btn.disabled = true;
  btn.textContent = "Clearing…";
  try {
    const keys = id === "A6" ? ["A6", "A6_other"] : [id];
    if (DEMO) {
      targets.forEach((r) => keys.forEach((k) => delete r[k]));
    } else {
      const { db, fs } = fb;
      for (let i = 0; i < targets.length; i += 400) {
        const batch = fs.writeBatch(db);
        targets.slice(i, i + 400).forEach((r) =>
          batch.update(fs.doc(db, COLLECTION, r.id), Object.fromEntries(keys.map((k) => [k, fs.deleteField()]))));
        await batch.commit();
      }
    }
    btn.textContent = "Cleared";
    btn.closest(".col-row").querySelector(".col-n").textContent = "0";
    toast(`Cleared ${id} from ${targets.length} response(s)`);
  } catch (e) {
    console.error(e);
    btn.disabled = false;
    btn.textContent = "Clear data";
    toast("Clear failed: " + (e.code || e.message));
  }
}

// ─────────────────────────────────────────────── Excel export
async function exportExcel() {
  const btn = document.getElementById("xlsxBtn");
  btn.disabled = true;
  try {
    const XLSX = await import(XLSX_URL);
    const list = filtered();
    const base = (r) => ({
      ID: r.id,
      Submitted: r._ts || "",
      Status: r.status,
      Language: LANG_NAME[r.lang] || r.lang,
      "Duration (s)": r.durationSec ?? "",
    });
    const coded = list.map((r) => {
      const o = base(r);
      visibleFields().forEach((f) => { o[f] = r[f] ?? ""; if (f === "A6") o.A6_other = r.A6_other ?? ""; });
      return o;
    });
    const labelled = list.map((r) => {
      const o = base(r);
      visibleFields().forEach((f) => { o[`${f} ${Q[f].q.en}`.slice(0, 80)] = label(f, r[f]); if (f === "A6") o["A6 other (specify)"] = r.A6_other ?? ""; });
      return o;
    });
    const codebook = [];
    QUESTIONS.filter((q) => !hidden.has(q.id)).forEach((q) => {
      const opts = q.type === "scale7"
        ? [-3, -2, -1, 0, 1, 2, 3].map((v) => ({ v, l: q.points[v + 3].en }))
        : q.options.map((o) => ({ v: o.v, l: o.label.en }));
      opts.forEach((o, i) => codebook.push({ Variable: i ? "" : q.id, Question: i ? "" : q.q.en, Code: o.v, Meaning: o.l }));
    });
    codebook.push({ Variable: "A6_other", Question: "Free text when A6 = other", Code: "", Meaning: "" });
    codebook.push({ Variable: "Status", Question: "complete = finished survey; declined = A1 No; ineligible = A2 1–2 days", Code: "", Meaning: "" });

    const wb = XLSX.utils.book_new();
    const add = (data, name, widths) => {
      const ws = XLSX.utils.json_to_sheet(data, { cellDates: true });
      ws["!cols"] = widths;
      XLSX.utils.book_append_sheet(wb, ws, name);
    };
    add(coded, "Data (codes)", [{ wch: 22 }, { wch: 18 }, { wch: 11 }, { wch: 9 }, { wch: 10 }]);
    add(labelled, "Data (labels)", [{ wch: 22 }, { wch: 18 }, { wch: 11 }, { wch: 9 }, { wch: 10 }]);
    add(codebook, "Codebook", [{ wch: 10 }, { wch: 60 }, { wch: 16 }, { wch: 40 }]);
    const stamp = dayKey(new Date());
    XLSX.writeFile(wb, `commuter-survey-${filter.status || "all"}-${stamp}.xlsx`);
    toast(`Downloaded ${list.length} response${list.length === 1 ? "" : "s"}`);
  } catch (e) {
    console.error(e);
    toast("Excel export failed: " + e.message);
  } finally {
    btn.disabled = false;
  }
}

// ─────────────────────────────────────────────── demo data
function demoRows(n = 137) {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = (arr, w) => {
    if (!w) return arr[Math.floor(rnd() * arr.length)];
    let x = rnd() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < arr.length; i++) { x -= w[i]; if (x <= 0) return arr[i]; }
    return arr[arr.length - 1];
  };
  const vals = (id) => Q[id].options.map((o) => o.v);
  const out = [];
  for (let i = 0; i < n; i++) {
    const ts = new Date(Date.now() - rnd() * 12 * 864e5);
    const status = pick(["complete", "declined", "ineligible"], [88, 4, 8]);
    const r = { id: "demo" + (1000 + i), status, lang: pick(["si", "en", "ta"], [62, 28, 10]), version: 2, durationSec: Math.round(120 + rnd() * 300), _ts: ts };
    r.A1 = status === "declined" ? "no" : "yes";
    if (status !== "declined") r.A2 = status === "ineligible" ? "1-2" : pick(["3-4", "5+"], [30, 70]);
    if (status === "complete") {
      r.A3 = pick(vals("A3"), [30, 12, 20, 10, 15, 6, 3, 1, 2, 1]);
      r.A4 = pick(vals("A4"), [30, 28, 24, 15, 3]);
      r.A5 = pick(vals("A5"), [45, 50, 5]);
      r.A6 = pick(vals("A6"), [55, 35, 8, 2]);
      if (r.A6 === "other") r.A6_other = "Relative's house";
      r.B1 = pick(vals("B1"), [10, 30, 30, 20, 10]);
      r.B2 = pick(vals("B2"), [55, 20, 10, 10, 5]);
      r.B3 = pick(vals("B3"), [30, 35, 25, 10]);
      r.B4 = pick(vals("B4")); r.B5 = pick(vals("B5"));
      r.B6 = r.B2 === "walk_bicycle" ? "na" : pick(["seat", "stand"], [45, 55]);
      r.B7 = pick(vals("B7"), [10, 20, 35, 25, 10]);
      const base = (r.B6 === "stand" ? -1 : 0.6) + (r.B2 === "bus" ? -0.6 : 0.3) - r.B3 * 0.3;
      ["C1", "C2", "C3"].forEach((c) => (r[c] = Math.max(-3, Math.min(3, Math.round(base + (rnd() - 0.5) * 3)))));
      r.C4 = pick(vals("C4"), [10, 25, 35, 20, 10]);
      r.D1 = pick(vals("D1"), [8, 20, 40, 25, 7]);
      r.D2 = pick(vals("D2"), [5, 15, 35, 30, 15]);
    }
    out.push(r);
  }
  return out.sort((a, b) => b._ts - a._ts);
}

// ─────────────────────────────────────────────── start
async function start() {
  if (DEMO) {
    user = { email: "demo@admin" };
    rows = demoRows();
    renderApp();
    return;
  }
  try {
    fb = await loadFirebase();
  } catch (e) {
    return renderError("Couldn't load Firebase: " + e.message);
  }
  fb.A.onAuthStateChanged(fb.auth, (u) => {
    stopListening();
    denied = false;
    user = u;
    if (!u) return renderSignIn();
    $root.innerHTML = `<div class="loading">Loading responses…</div>`;
    renderWho();
    listen();
  });
}
start();
