# AI prompts for ReadyLine

These prompts help you prepare content and get through setup with an AI assistant such as ChatGPT, Claude, or Gemini. Copy a prompt, fill in the brackets, and paste it in.

**Two rules for every prompt:**

1. **Never paste secret keys** (R2 keys, the Turnstile Secret Key) into an AI chat. Settings, error messages, and quiz questions are fine.
2. **Check what comes back,** especially answer keys. An AI can copy a wrong answer from your source document or invent one. You are the last check before a learner fails a question they answered correctly.

---

## Turn your quiz into ReadyLine settings

This one saves the most time. It converts a quiz document into the `SESSIONS` block in `Code.gs`.

```
I'm setting up ReadyLine, a training tool. I need my quiz turned into a JavaScript settings block.

Format each session exactly like this example. "answer" is the correct option counted from 0
(0 = first option, 1 = second, and so on). Keep the options in the same order in every language.

  {
    id: "session-1", version: "v1",
    title: { en: "Welcome to the team", es: "Bienvenido al equipo" },
    minutes: { en: 13, es: 17 },
    videos: { en: "session-1-en.mp4", es: "session-1-es.mp4" },
    questions: [
      { answer: 0,
        en: { q: "Where do you check in?", a: ["At the front desk", "In the parking lot"] },
        es: { q: "¿Dónde se registra?", a: ["En la recepción", "En el estacionamiento"] } }
    ]
  }

Languages: [English only / Spanish only / English and Spanish]
Sessions: [number]
Video lengths in minutes: [Session 1: __ English, __ Spanish; Session 2: ...]
Video file names: [or "use session-1-en.mp4 and so on"]

Here is my quiz, with the correct answer marked for each question:
[paste the quiz]

Rules:
- Keep my wording exactly. Don't fix, shorten, or improve questions or options.
- If a question has no clear correct answer, or my document marks two, stop and ask me.
- Escape any double quotes inside text with a backslash.
- After the block, list every question with its correct answer written out in words,
  so I can check the answer numbers by eye.
```

Paste the result between `const SESSIONS = [` and `];` in `Code.gs`, replacing the sample sessions. Then run **setup** in Apps Script. It checks the block and lists any mistakes.

---

## Fill in the quiz templates from your quiz document

If your quiz is in a Word file, a PDF, or an email, this puts it into the [quiz templates](QUIZ-TEMPLATE.md).

```
Put this quiz into CSV rows with these columns, in this order:
session_id,question_en,option_A_en,option_B_en,option_C_en,option_D_en,option_E_en,option_F_en,question_es,option_A_es,option_B_es,option_C_es,option_D_es,option_E_es,option_F_es,correct

- session_id for every row is: [session-1]
- Fill options in order from A and leave unused option columns empty.
- "correct" is the letter of the correct answer.
- [Leave the _es columns empty / Use the Spanish version I paste below, keeping options in the same order.]
- Keep my wording exactly. Put any cell that contains a comma inside double quotes.
- If a question has no clear correct answer, or two are marked, stop and ask me.
- After the rows, list each question with its correct answer in words.

Quiz:
[paste]
```

## Check your answer keys against the video

Run this for every session before launch. It catches answer keys that don't match what the video teaches.

```
I'm going to give you the text of a training presentation and a quiz with its answer key.
For each question, tell me:
1. Which slide or section covers it, quoted briefly.
2. Whether the marked answer matches what the presentation says.
3. Any question the presentation doesn't cover at all.

Flag anything that doesn't match. Don't change my questions; just report.

Presentation text:
[paste the slide text or the narration script]

Quiz and answer key:
[paste]
```

To get the slide text from PowerPoint: View > Outline, then select all and copy. Or File > Export > Create Handouts.

---

## Write a narration script from your slides

```
Write a voiceover script for a workplace training video, one section per slide.
The audience is [new hires / temporary workers / ...], watching on a phone.

Rules:
- Say only what's on the slides. Don't add facts, numbers, or rules that aren't there.
- Short sentences, plain words, a friendly and direct tone. About [20 to 40] seconds per slide.
- Spell out how to say acronyms the first time (for example "P-P-E, personal protective equipment").
- Label each section with its slide number.
- If a slide is unclear, flag it instead of guessing.

Slides:
[paste the slide text]
```

For a Spanish version, ask: "Translate this narration script into clear, everyday Spanish with the formal usted, keeping one section per slide. Keep it natural to say out loud, not word for word." Have a fluent speaker review it.

## Turn your script into a caption file

```
Turn this narration script into a WebVTT (.vtt) caption file.
The slide timings are: Slide 1 from 0:00 to 0:25, Slide 2 from 0:25 to 0:58, [and so on].
Split each slide's narration into caption lines of no more than about 80 characters,
spread evenly across that slide's time. Don't change any words.

[paste the script]
```

Watch the video with the captions afterward and adjust any timings that drift. See [CAPTIONS.md](CAPTIONS.md).

## Write quiz questions from your slides

```
Write [number] multiple-choice quiz questions for a workplace training session.
The audience is [new hires / temporary workers / ...], reading on a phone, some with limited English.

Rules:
- Every question must be answered directly by the slides below. Nothing from outside knowledge.
- One clearly correct answer and 3 plausible wrong answers per question.
- Plain words, short sentences, no trick questions, no "all of the above" unless it's truly correct.
- Mark the correct answer and quote the slide that supports it.

Slides:
[paste the slide text]
```

---

## Translate your training into Spanish

```
Translate these quiz questions and answer options from English to Spanish for workers in [country/region].
Use clear, everyday Spanish and the formal "usted."

Rules:
- Keep the options in exactly the same order. The answer key depends on the order.
- Keep product names, codes, and acronyms the way they appear in the training (for example PPE, SDS, LOTO),
  and add the Spanish term in parentheses the first time if one is common.
- Return it in the same structure I gave you.

[paste the questions, or the SESSIONS block]
```

Have a fluent Spanish speaker review the result, and make sure the Spanish video uses the same terms.

---

## Fix a setup error

```
I'm setting up ReadyLine, an open-source training tool that uses Google Apps Script, Google Sheets,
Cloudflare R2, Cloudflare Turnstile, and Cloudflare Pages.

I'm on this step: [step number and name from docs/SETUP.md]
What I did: [describe]
What happened: [paste the exact error, or describe what you see]
Apps Script Executions log (if any): [paste]

Help me find the cause. Ask me for anything you need, but never ask for my secret keys.
```

---

## Clean up automatic captions

```
Here is a WebVTT caption file made automatically from my training video. Fix spelling, punctuation,
capitalization, and the terms below, without changing any timings or cue numbers.
Return the whole file. Terms to get right: [company name, product names, safety terms, people's names]

[paste the .vtt file]
```

Then read it once yourself. See [CAPTIONS.md](CAPTIONS.md) for making caption files.

## Choose brand colors that are easy to read

```
My brand colors are [hex codes or a description]. I'm setting two colors for a training page:
- BRAND_COLOR: the color of buttons and selected answers, with white text on top. It may also fill
  the page header. It must be dark enough for white text to pass WCAG AA contrast (4.5:1).
- ACCENT_COLOR: used for progress bars and success marks on a white background.

Suggest a BRAND_COLOR and ACCENT_COLOR from my palette, with the contrast ratio of white text on the
brand color. If my main color is too light, suggest a darker shade of it.
```

---

## Write the wording for your onboarding paperwork

```
Write a short block for our new-hire paperwork telling people how to complete our online training.
Training name: [ ]
Address: [ ]
Access code: [ ]
Number of sessions and total time: [ ]
Who to contact: [ ]
Write it in [English / Spanish / both], at a 6th-grade reading level, in under 70 words.
```

---

## Change the passing score or attempts

```
I'm setting up ReadyLine by Makersridge, a free open-source training tool that uses Google Sheets and Apps Script, Cloudflare R2, Cloudflare Turnstile, and Cloudflare Pages. I'm not a developer.

I want to change my quiz rules. In the YOUR SETTINGS block of Code.gs:
- PASS_PERCENT is currently [ ]. I want people to need [ ]% to pass.
- MAX_ATTEMPTS is currently [ ]. I want people to get [ ] attempts per session.
Show me exactly which lines to change, then walk me through saving and redeploying with
Manage deployments > New version. Explain what happens to people who already took the quiz.
```

## Add or change a session later

```
Here is my current ReadyLine SESSIONS block: [paste]
I want to [add a session about ___ / remove session 2 / replace the questions in session 3 with these: ___].
Give me the full updated block in the same format. Keep the existing ids for sessions that stay,
and raise the version (for example v1 to v2) on any session whose video or questions change.
```

After a change: paste it into Code.gs, run **setup**, and redeploy (Deploy > Manage deployments > pencil > New version > Deploy). If you added a session, upload its videos to R2 and run **testVideoLinks**.
