# USJ Commuter Stress Survey (Group 7)

Tally-style, one-question-per-page survey in Sinhala / English / Tamil. Plain HTML + JS (no build step), saves to Firebase Firestore, hosts on Vercel.

## 1. Firebase setup (≈10 min)
1. **Firestore:** Build → Firestore Database → Create database → **Start in production mode** → Next.
   Production mode keeps data until you delete it (there's no 30-day expiry like test mode).
2. **Rules:** Firestore → **Rules** tab → paste all of `firestore.rules` → **Publish**.
   The admin list is in `isAdmin()` — add each group member's Google email there and publish again.
3. **Admin sign-in:** Build → Authentication → Get started → Sign-in method → **Google** → Enable → Save.
4. **Allowed domains:** Authentication → Settings → Authorized domains → **Add domain** → your Vercel domain
   (e.g. `usj-commuter-survey.vercel.app`). `localhost` is there already.
5. **Web config:** Project settings (⚙) → General → Your apps → Web (`</>`) → register → copy `firebaseConfig`
   into `firebase-config.js`.

## Admin page — `/admin`
Sign in with Google (only emails in `isAdmin()` get in). It shows:
- **Open / Closed switch** — turning it off blocks new responses (enforced by the rules) and shows a "survey closed" page.
- **Dashboard** — totals vs. the 250 target, responses per day, transport, distance, vehicle changes, stress, faculty, seat,
  and average journey feeling (C1–C3) by transport mode. Updates live.
- **Responses table** — filter by status / language, search, **Edit** any answer, **Delete** a response.
- **Download Excel** — exports the current filter as `.xlsx` with three sheets: *Data (codes)* for Minitab,
  *Data (labels)* readable answers, and *Codebook*.

Tip: download the Excel file regularly as your own backup.

## 2. Run locally
```bash
npx serve .
```
(Must be served over http — opening `index.html` directly won't load ES modules.)

## 3. Deploy to Vercel
- Push this folder to GitHub → vercel.com → **Add New Project** → import → Framework preset **Other** → Deploy.
- Or: `npx vercel` inside this folder.

## Data saved (collection `responses`)
| field | values |
|---|---|
| status | `complete`, `declined` (A1 = No), `ineligible` (A2 = 1–2 days) |
| lang | `si`, `en`, `ta` |
| A1 | `yes` / `no` · A2 `1-2` / `3-4` / `5+` · A3 faculty code · A4 1–5 (5 = 5th year or above) · A5 `male`/`female` · A6 `home`/`boarding`/`hostel`/`other` (+ `A6_other` text) |
| B1 (one-way) | 1 = <5 km, 2 = 5–14, 3 = 15–29, 4 = 30–49, 5 = 50+ |
| B2 | `bus`, `train`, `three_wheeler`, `private`, `walk_bicycle` |
| B3 | 0, 1, 2, 3 (=3 or more). Walkers/cyclists (B2 = `walk_bicycle`) are not asked B3–B6; they are saved as B3 = 0, B4 = B5 = B6 = `na` |
| B4, B5 | `walk`, `bus`, `three_wheeler`, `dropped`, `na` (= none: direct access / direct drop-off; also saved for walkers/cyclists who skip B4–B6) |
| B6 | `seat`, `stand`, `na` |
| B7 (days per week arriving 15+ min late) | 0 = 0 days (never), 1 = 1 day, 2 = 2–3 days, 3 = 4+ days |
| B8 | one-way travel time: 1 = <30 min, 2 = 30–59, 3 = 1–1½ h, 4 = 1½–2 h, 5 = >2 h |
| B9 | waiting for the vehicle: 0 = don't wait, 1 = <5 min, 2 = 5–15, 3 = 15–30, 4 = >30 (walkers/cyclists skipped → 0) |
| B10 | leaves home: 1 = before 6:00, 2 = 6:00–6:59, 3 = 7:00–7:59, 4 = 8:00 or later |
| B11 | share of daily budget/allowance spent on travel: 0 = nothing (0%), 1 = <10%, 2 = 10–25%, 3 = 26–50%, 4 = >50% (walkers/cyclists skipped → 0) |
| B12 | feels unsafe on the journey: 1 Never … 4 Often |
| D3 | crowding of the bus/train today: 1 = not crowded … 5 = extremely crowded. Only asked when B2 is bus or train; blank for everyone else |
| D4 | weather / discomfort made it harder: 1 Not at all … 4 Very much |
| C1–C3 | −3 (stressed / worried / hurried) … +3 (relaxed / confident / calm) |
| C4 | 1 Not at all … 5 Very much |
| D1 | 1 Very poor … 5 Very good (sleep) |
| D2 | 1 Very low … 5 Very high (workload) |
| startedAt, durationSec, submittedAt | timing |

Filter `status == "complete"` for analysis.

## Notes
- Progress is kept in the browser, so a refresh doesn't lose answers, and a finished phone shows the thank-you page again instead of a second form. To take another response on the same device (e.g. a shared tablet), open the site with `?new` at the end of the URL.
- All question text lives in `questions.js` — edit translations there.
