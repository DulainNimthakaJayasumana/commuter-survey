import { LANGS, UI, QUESTIONS } from "./questions.js";
import { saveResponse, preload, isSurveyOpen } from "./db.js";

if ("scrollRestoration" in history) history.scrollRestoration = "manual"; // always open a page at the top

const $app = document.getElementById("app");
const $progress = document.getElementById("progress");
const $nav = document.getElementById("nav");
const $prev = document.getElementById("prevBtn");
const $next = document.getElementById("nextBtn");
const $langBtn = document.getElementById("langBtn");

// Screens: intro → language → brief → one page per question → end
const PAGES = ["intro", "lang", "brief", ...QUESTIONS.map((q) => q.id)];
const QMAP = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const STORE_KEY = "usj-commuter-survey-v1";

if (new URLSearchParams(location.search).has("new")) {
  try { localStorage.removeItem(STORE_KEY); } catch {}
  history.replaceState(null, "", location.pathname);
}
let state = load() || { page: 0, lang: null, answers: {}, startedAt: null, finished: null };
// Guard against a saved position that no longer exists (e.g. after the questionnaire changes).
if (!(state.page >= 0 && state.page < PAGES.length)) state.page = 0;
if (state.page > 1 && !state.lang) state.page = 1;
let busy = false;
let closed = false;
let advanceTimer = null;

function load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch { return null; }
}
function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {}
}
const t = () => UI[state.lang || "en"];
const L = (obj) => (obj ? obj[state.lang] ?? obj.en : "");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------------------------------------------------------------- render
function render(dir = "fwd") {
  clearTimeout(advanceTimer);
  document.documentElement.lang = state.lang || "en";
  const anim = dir === "back" ? "enter-back" : "enter";

  if (state.finished) return renderEnd(state.finished, anim);
  if (closed) return renderClosed(anim);

  const key = PAGES[state.page];
  const qIndex = state.page - 3;
  $progress.style.width = qIndex < 0 ? "0%" : `${Math.round((qIndex / QUESTIONS.length) * 100)}%`;
  $langBtn.hidden = !state.lang || state.page < 2;
  if (state.lang) $langBtn.textContent = `🌐 ${LANGS.find((l) => l.code === state.lang).label}`;
  $nav.hidden = state.page < 2;
  $prev.disabled = state.page <= 0;

  if (key === "intro") renderIntro(anim);
  else if (key === "lang") renderLang(anim);
  else if (key === "brief") renderBrief(anim);
  else renderQuestion(QMAP[key], qIndex, anim);

  // Focus the card (not an option) so Enter means "continue", never "pick the first answer".
  const card = $app.querySelector(".card");
  if (card) { card.tabIndex = -1; card.style.outline = "none"; card.focus({ preventScroll: true }); }
  const other = document.getElementById("otherInput");
  if (other) { other.focus({ preventScroll: true }); other.setSelectionRange(other.value.length, other.value.length); }
  window.scrollTo({ top: 0 });
}

// Short description of the study, shown on the first page in one language at a time.
const BLURB = {
  en: "Two trips of the same length can feel very different. We are studying whether everyday travel hassles — delays, crowding, standing, changing vehicles — are linked to how stressed students feel when they arrive at university.",
  si: "එකම දුරක් වුවද ගමන් දෙකක් එකිනෙකට බෙහෙවින් වෙනස් ලෙස දැනිය හැක. ප්‍රමාද වීම්, තදබදය, සිටගෙන යාම, වාහන මාරු කිරීම වැනි දෛනික ගමන් අපහසුතා, සිසුන් විශ්වවිද්‍යාලයට පැමිණෙන විට දැනෙන ආතතියට සම්බන්ධ දැයි අපි අධ්‍යයනය කරමු.",
  ta: "ஒரே தூரமுள்ள இரண்டு பயணங்கள் மிகவும் வேறுபட்டதாக உணரப்படலாம். தாமதங்கள், நெரிசல், நின்றுகொண்டு பயணித்தல், வாகனம் மாறுதல் போன்ற தினசரி பயணச் சிரமங்கள், மாணவர்கள் பல்கலைக்கழகத்தை அடையும்போது உணரும் மன அழுத்தத்துடன் தொடர்புடையதா என்பதை நாம் ஆய்வு செய்கிறோம்.",
};
let introLang = "en";

function renderIntro(anim) {
  $app.innerHTML = `
  <section class="card intro ${anim}">
    <span class="tag">Research survey · Group 7</span>
    <h1>Beyond Travel Time</h1>
    <p class="sub">Commuter friction, micro-mobility and stress among USJ undergraduates<br>
      <span style="font-size:14px;color:var(--ink-mute)">Department of Statistics · Faculty of Applied Sciences · University of Sri Jayewardenepura</span></p>
    <div class="blurb-tabs" role="tablist" aria-label="Read in">
      ${[["en", "English"], ["si", "සිංහල"], ["ta", "தமிழ்"]].map(([c, n]) =>
        `<button role="tab" class="${introLang === c ? "on" : ""}" aria-selected="${introLang === c}" data-blurb="${c}" lang="${c}">${n}</button>`).join("")}
    </div>
    <p class="blurb" lang="${introLang}">${BLURB[introLang]}</p>
    <div class="chips">
      <span class="chip">⏱ ~2 min</span>
      <span class="chip">🔒 Anonymous · නිර්නාමික · அநாமதேய</span>
      <span class="chip">🙋 Voluntary · ස්වේච්ඡා · விருப்பத்தின் பேரில்</span>
    </div>
    <div class="actions">
      <button class="btn" data-act="next">Start · ආරම්භ · தொடங்கு <span aria-hidden="true">→</span></button>
      <span class="hint kbd">press <b>Enter ↵</b></span>
    </div>
  </section>`;
}

function renderLang(anim) {
  $app.innerHTML = `
  <section class="card ${anim}">
    <div class="eyebrow">Language · භාෂාව · மொழி</div>
    <h2 class="q">Choose your language<br><span style="font-weight:500;color:var(--ink-soft)">ඔබේ භාෂාව තෝරන්න · உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்</span></h2>
    <div class="langs">
      ${LANGS.map((l, i) => `
        <button class="lang-card ${state.lang === l.code ? "selected" : ""}" data-lang="${l.code}" lang="${l.code}">
          <span><span class="big">${l.label}</span></span>
          <span class="small">${LETTERS[i]} · ${l.sub}</span>
        </button>`).join("")}
    </div>
    <div class="actions"><button class="btn ghost back" data-act="back">← Back · ආපසු · பின்</button></div>
  </section>`;
}

function renderBrief(anim) {
  const u = t();
  $app.innerHTML = `
  <section class="card ${anim}">
    <h1>${u.briefTitle}</h1>
    <ul class="brief">${u.brief.map((b) => `<li><span>${b}</span></li>`).join("")}</ul>
    <div class="actions">
      <button class="btn" data-act="next">${u.start} <span aria-hidden="true">→</span></button>
      <button class="btn ghost back" data-act="back">← ${u.back}</button>
      <span class="hint kbd">${u.pressEnter}</span>
    </div>
  </section>`;
}

function renderQuestion(q, idx, anim) {
  const u = t();
  const ans = state.answers[q.id];
  const isLast = idx === QUESTIONS.length - 1;
  const head = `
    <div class="eyebrow"><span class="qnum">${q.id}</span><span class="dot"></span><span>${u.sections[q.section]}</span></div>
    ${q.pre ? `<p class="pre">${esc(L(q.pre))}</p>` : ""}
    <h2 class="q">${esc(L(q.q))}</h2>
    ${q.help ? `<p class="help">${esc(L(q.help))}</p>` : ""}
    ${q.examples ? `<ul class="examples">${q.examples.map((x) => `<li>${L(x)}</li>`).join("")}</ul>` : ""}`;

  let body = "";
  if (q.type === "single") {
    const twoCol = q.options.length >= 8 ? "two-col" : "";
    body = `<div class="options ${twoCol}" role="radiogroup" aria-label="${esc(L(q.q))}">
      ${q.options.map((o, i) => `
        <button class="opt ${ans === o.v ? "selected" : ""}" role="radio" aria-checked="${ans === o.v}" data-i="${i}">
          <span class="key">${LETTERS[i]}</span><span class="lbl">${esc(L(o.label))}</span>
          <svg class="tick" width="18" height="18" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>`).join("")}
    </div>
    ${q.options.some((o) => o.other && o.v === ans) ? `
      <input class="other-input" id="otherInput" type="text" maxlength="120" autocomplete="off"
        placeholder="${esc(u.otherPlaceholder)}" value="${esc(state.answers[q.id + "_other"] || "")}">` : ""}`;
  } else if (q.type === "scale7") {
    body = `<div class="scale-wrap">
      <div class="scale" role="radiogroup">
        ${[-3, -2, -1, 0, 1, 2, 3].map((v, i) => `
          <button class="${ans === v ? "selected" : ""}" role="radio" aria-checked="${ans === v}" data-v="${v}">
            <span class="num">${v > 0 ? "+" + v : v === 0 ? "0" : "−" + Math.abs(v)}</span>
            <span class="plbl">${esc(L(q.points[i]))}</span>
          </button>`).join("")}
      </div>
    </div>`;
  }

  $app.innerHTML = `
  <section class="card ${anim}">
    ${head}
    ${body}
    <div class="actions">
      ${isLast
        ? `<button class="btn" data-act="submit">${u.submit} <span aria-hidden="true">✓</span></button>`
        : `<button class="btn" data-act="next">${u.ok} <span aria-hidden="true">✓</span></button>
           <span class="hint kbd">${u.pressEnter}</span>`}
      <button class="btn ghost back" data-act="back">← ${u.back}</button>
    </div>
    <div class="err" id="err"></div>
  </section>`;
}

function renderEnd(kind, anim) {
  const u = t();
  $progress.style.width = kind === "done" ? "100%" : "0%";
  $nav.hidden = true;
  $langBtn.hidden = true;
  const title = { done: u.doneTitle, declined: u.declinedTitle, ineligible: u.ineligibleTitle }[kind];
  const sub = { done: u.doneSub, declined: u.declinedSub, ineligible: u.ineligibleSub }[kind];
  $app.innerHTML = `
  <section class="card end ${anim}">
    <div class="icon"><svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    <h1>${title}</h1>
    <p>${sub}</p>
  </section>`;
}

function renderClosed(anim) {
  $progress.style.width = "0%";
  $nav.hidden = true;
  $langBtn.hidden = true;
  $app.innerHTML = `
  <section class="card end ${anim}">
    <div class="icon"><svg width="28" height="28" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></div>
    <h1>This survey is now closed</h1>
    <p lang="si" style="margin-bottom:6px">මෙම සමීක්ෂණය දැන් අවසන් කර ඇත.</p>
    <p lang="ta" style="margin-bottom:14px">இந்த ஆய்வு தற்போது முடிவடைந்துவிட்டது.</p>
    <p>Thank you for your interest · ස්තූතියි · நன்றி</p>
  </section>`;
}

// ---------------------------------------------------------------- flow
function go(delta) {
  const next = state.page + delta;
  if (next < 0 || next >= PAGES.length) return;
  state.page = next;
  persist();
  render(delta < 0 ? "back" : "fwd");
}

function showErr(msg) {
  const el = document.getElementById("err");
  if (el) el.textContent = msg;
}

// Returns an error message if the question isn't answered yet.
function missingMsg(q) {
  const v = state.answers[q.id];
  if (v === undefined) return t().required;
  if (q.options?.some((o) => o.other && o.v === v) && !(state.answers[q.id + "_other"] || "").trim()) return t().otherRequired;
  return null;
}

function tryNext() {
  const key = PAGES[state.page];
  if (key === "lang" && !state.lang) return;
  const q = QMAP[key];
  const err = q && missingMsg(q);
  if (err) return showErr(err);
  if (q && state.page === PAGES.length - 1) return submit();
  go(1);
}

function choose(q, value, stop) {
  const prev = state.answers[q.id];
  state.answers[q.id] = value;
  persist();
  const opt = q.options?.find((o) => o.v === value);
  if (opt?.other || q.options?.find((o) => o.v === prev)?.other) {
    // Show / hide the "please specify" box.
    clearTimeout(advanceTimer);
    renderQuestion(q, state.page - 3, "");
    const card = $app.querySelector(".card"); card.tabIndex = -1;
    if (opt?.other) document.getElementById("otherInput")?.focus();
    else advanceTimer = setTimeout(() => go(1), 380);
    return;
  }
  // Update selection in place (no re-render) so the click feels instant.
  $app.querySelectorAll("[aria-checked]").forEach((b) => {
    const match = q.type === "scale7" ? Number(b.dataset.v) === value : q.options[b.dataset.i].v === value;
    b.classList.toggle("selected", match);
    b.setAttribute("aria-checked", match);
    if (match) b.classList.add("flash");
  });
  showErr("");
  clearTimeout(advanceTimer);
  if (stop) {
    advanceTimer = setTimeout(() => finish(stop), 380);
    return;
  }
  const isLast = state.page === PAGES.length - 1;
  if (!isLast) advanceTimer = setTimeout(() => go(1), 380);
}

function buildRecord(status) {
  const rec = {
    status,
    lang: state.lang,
    version: 3,
    startedAt: state.startedAt,
    durationSec: state.startedAt ? Math.round((Date.now() - Date.parse(state.startedAt)) / 1000) : null,
  };
  for (const q of QUESTIONS) if (state.answers[q.id] !== undefined) rec[q.id] = state.answers[q.id];
  for (const q of QUESTIONS) {
    if (q.options?.some((o) => o.other && o.v === rec[q.id])) rec[q.id + "_other"] = (state.answers[q.id + "_other"] || "").trim().slice(0, 120);
  }
  return rec;
}

async function finish(status) {
  // Screened-out responses are saved too (only A1/A2), so response rates can be reported.
  saveResponse(buildRecord(status)).catch((e) => console.warn("Could not log screen-out", e));
  state.finished = status;
  persist();
  render();
}

async function submit() {
  if (busy) return;
  const missing = QUESTIONS.find((q) => missingMsg(q));
  if (missing) {
    state.page = PAGES.indexOf(missing.id);
    render("back");
    return showErr(missingMsg(missing));
  }
  busy = true;
  const btn = $app.querySelector('[data-act="submit"]');
  if (btn) { btn.disabled = true; btn.textContent = t().submitting; }
  try {
    await saveResponse(buildRecord("complete"));
    state.finished = "done";
    persist();
    render();
  } catch (e) {
    console.error(e);
    showErr(t().error);
    if (btn) { btn.disabled = false; btn.innerHTML = `${t().submit} <span aria-hidden="true">✓</span>`; }
  } finally {
    busy = false;
  }
}

// ---------------------------------------------------------------- events
$app.addEventListener("click", (e) => {
  const el = e.target.closest("button");
  if (!el) return;
  const key = PAGES[state.page];

  if (el.dataset.act === "next") return tryNext();
  if (el.dataset.act === "back") return go(-1);
  if (el.dataset.blurb) { introLang = el.dataset.blurb; return renderIntro(""); }
  if (el.dataset.act === "submit") return submit();

  if (el.dataset.lang) {
    state.lang = el.dataset.lang;
    if (!state.startedAt) state.startedAt = new Date().toISOString();
    const back = state.returnTo;
    state.returnTo = null;
    persist();
    $app.querySelectorAll(".lang-card").forEach((c) => c.classList.toggle("selected", c === el));
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(() => (back ? (state.page = back, persist(), render()) : go(1)), 320);
    return;
  }

  const q = QMAP[key];
  if (!q) return;
  if (q.type === "single" && el.dataset.i !== undefined) {
    const opt = q.options[Number(el.dataset.i)];
    choose(q, opt.v, opt.stop);
  } else if (q.type === "scale7" && el.dataset.v !== undefined) {
    choose(q, Number(el.dataset.v));
  }
});

$app.addEventListener("input", (e) => {
  if (e.target.id !== "otherInput") return;
  state.answers[PAGES[state.page] + "_other"] = e.target.value;
  persist();
  showErr("");
});

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || state.finished || closed) return;
  if (e.target.id === "otherInput") {
    if (e.key === "Enter") { e.preventDefault(); tryNext(); }
    return;
  }
  const key = PAGES[state.page];
  const q = QMAP[key];

  if (e.key === "Enter") {
    // Enter on a Tab-focused, not-yet-chosen option picks it; otherwise Enter continues.
    const f = document.activeElement;
    if (f?.matches(".opt, .lang-card, .scale button") && !f.classList.contains("selected")) return;
    if (f?.matches(".btn")) return;
    e.preventDefault();
    return tryNext();
  }

  const letter = e.key.length === 1 ? e.key.toUpperCase() : "";
  const i = LETTERS.indexOf(letter);
  if (key === "lang" && i >= 0 && i < LANGS.length) {
    $app.querySelector(`[data-lang="${LANGS[i].code}"]`)?.click();
  } else if (q?.type === "single" && i >= 0 && i < q.options.length) {
    $app.querySelector(`.opt[data-i="${i}"]`)?.click();
  } else if (q?.type === "scale7" && /^[1-7]$/.test(e.key)) {
    $app.querySelector(`.scale button[data-v="${Number(e.key) - 4}"]`)?.click();
  }
});

$prev.addEventListener("click", () => go(-1));
$next.addEventListener("click", tryNext);
$langBtn.addEventListener("click", () => { state.returnTo = state.page; state.page = 1; persist(); render("back"); });

preload();
render();
isSurveyOpen().then((open) => {
  if (!open && !state.finished) { closed = true; render(); }
});
