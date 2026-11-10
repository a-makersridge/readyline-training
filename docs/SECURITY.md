# Security and privacy

ReadyLine collects only names, emails, and quiz results. It was tested against bots, link guessing, abuse of the registration form, tampered quiz submissions, and spreadsheet formula injection. The tests are in the `tests` folder, and you can run them yourself.

## How it's protected

- **Bots.** Registration and resend both require a Cloudflare Turnstile check, which the script confirms with Cloudflare. Without a valid check, the access code isn't even tested, so a script can't guess it.
- **Email abuse.** By default, at most 60 emails an hour, 300 a day, and 5 per address. The email never includes anything a person typed, so the form can't be used to send messages from your account.
- **Personal links.** Each link contains a random 36-character ID. Each link is limited to 60 requests per 10 minutes.
- **No account probing.** The resend screen gives the same answer whether or not an email is registered.
- **Attempts and session order.** Enforced by the script, not the browser, so they can't be reset or skipped from the page.
- **Answer keys.** Stay in Google. The page receives questions and options, sends answers back, and gets a score.
- **Videos.** Stored in a private R2 bucket. Only registered learners get a video link, and it expires after 12 hours. The page blocks right-click, dragging, and common save and inspect shortcuts. Screen recording can't be prevented without paid DRM.
- **The spreadsheet.** Text starting with `=`, `+`, `-`, or `@` is stored as plain text, so nobody can plant a formula. The script is limited to the one Sheet it lives in (`@OnlyCurrentDoc`) and uses send-only email permission.
- **Requests.** Oversized, malformed, or unknown requests are rejected before any work is done. Writes use a short lock, so two submissions at once can't corrupt a row.
- **The page.** A Content Security Policy allows loading only from Google, Cloudflare, and Google Fonts. The page refuses to load inside another site. It's marked do-not-index, do-not-cache, and do-not-preview, and AI crawlers are blocked.

## Why "Anyone" access on the script is safe

Learners don't have Google accounts, so the web app must accept requests from anyone. Its address can do four things: register a person, look up a personal link, issue a video link to a registered learner, and save a quiz result. It can't read, list, or export your Sheet.

## Habits that keep it safe

- Turn on 2-step verification for the Google account that owns the Sheet and for your Cloudflare login.
- Keep Apps Script editors to one or two people. Editors can see the keys in Script Properties. Share the Sheet itself as **view only** with anyone who just needs to see results.
- Don't use **File > Share > Publish to web** on the Sheet.
- Change the access code every few months, or right away if it shows up somewhere public.
- Keep secret keys in a password manager. Never paste them into the page, an email, or an AI chat.
- Decide how long to keep records, and delete older rows on that schedule.

## What is stored

In your Google Sheet: first and last name, email, language, a registration ID, how many times the link was sent, and for each quiz attempt the score, each answer, and the video start and finish times.

In the learner's browser: their video progress for each session, so they can pick up where they left off.

Nothing else is collected, and nothing is sent to Makersridge. ReadyLine runs entirely in your own Google and Cloudflare accounts.

## Reporting a security problem

If you find a vulnerability, please report it privately through GitHub's **Security > Report a vulnerability** on this repository, rather than in a public issue.
