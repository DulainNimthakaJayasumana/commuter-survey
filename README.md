# USJ Commuter Stress Survey (Group 7)

Tally-style, one-question-per-page survey in Sinhala / English / Tamil. Plain HTML + JS (no build step), saves to Firebase Firestore, hosts on Vercel.

## 1. Firebase setup (≈5 min)
1. https://console.firebase.google.com → **Add project**.
2. **Build → Firestore Database → Create database** → production mode → region `asia-south1` (Mumbai).
3. **Rules** tab → paste the contents of `firestore.rules` → **Publish**.
4. **Project settings (⚙) → General → Your apps → Web (</>)** → register app → copy the `firebaseConfig` object.
5. Paste it into `firebase-config.js` (replace the `YOUR_...` values).

Until step 5 is done the site runs in **demo mode** (nothing saved, a red note shows on the thank-you page).

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
| A1 | `yes` / `no` · A2 `1-2` / `3-4` / `5+` · A3 faculty code · A4 1–5 (5 = 5th year or above) · A5 `male`/`female`/`prefer_not` · A6 `home`/`boarding`/`hostel`/`other` (+ `A6_other` text) |
| B1 (one-way) | 1 = <5 km, 2 = 5–14, 3 = 15–29, 4 = 30–49, 5 = 50+ |
| B2 | `bus`, `train`, `three_wheeler`, `private`, `walk_bicycle` |
| B3 | 0, 1, 2, 3 (=3 or more) |
| B4, B5 | `walk`, `bus`, `bicycle`, `three_wheeler`, `dropped`, `na` |
| B6 | `seat`, `stand`, `na` |
| B7 | 1 Never … 5 Always |
| C1–C3 | −3 (stressed / worried / hurried) … +3 (relaxed / confident / calm) |
| C4 | 1 Not at all … 5 Very much |
| D1 | 1 Very poor … 5 Very good (sleep) |
| D2 | 1 Very low … 5 Very high (workload) |
| startedAt, durationSec, submittedAt | timing |

Filter `status == "complete"` for analysis.

## Notes
- Progress is kept in the browser, so a refresh doesn't lose answers, and a finished phone shows the thank-you page again instead of a second form. To take another response on the same device (e.g. a shared tablet), open the site with `?new` at the end of the URL.
- All question text lives in `questions.js` — edit translations there.
