# Changelog

## 1.0.0 (November 2026)

First public release of ReadyLine by Makersridge.

**For learners**
- Registration with an access code and a Cloudflare Turnstile bot check
- A personal link by email, and "Get your link again" with just an email
- Videos that can't be skipped, stored privately in Cloudflare R2, with optional captions
- Quizzes graded in Google, with a passing score, attempt limits, and a full rewatch before the next try
- Any number of sessions, opened in order
- English, Spanish, or both
- A plain white design with optional brand colors and a brand header, plus dark mode

**For your team**
- Google Sheet records: Summary (one row per person), Results (every attempt), Registrations, Overrides
- ReadyLine menu in the Sheet: Look up a person (status, results, and their personal link to copy) and Refresh summary
- Quiz spreadsheet templates and tools/quiz-to-settings.js
- Demo mode with sample sessions, videos, and captions, live at https://a-makersridge.github.io/readyline-training/site/
  - The sign-up form comes filled in with a sample name, email (test@gmail.com), and code. Any email works, and nothing is saved or emailed
  - A "Skip the video" button so visitors can flip through every screen. It appears only in demo mode.

**Docs**
- Setup guide with an AI prompt at every step, and a starter prompt for any AI assistant
- Guides for making videos, captions, the quiz templates, sharing and QR codes, day-to-day admin, customizing, upgrading, security, and an FAQ
