# Writing your quiz with the templates

The `templates` folder has two spreadsheets that hold everything about your sessions and quizzes. Fill them in, and they turn into the `SESSIONS` settings in Code.gs. This avoids most setup mistakes, because you never edit code by hand.

| File | One row per | What goes in it |
|---|---|---|
| `templates/sessions.csv` | Session | The id, version, title, video length, video file, and caption file for each language |
| `templates/questions.csv` | Question | Which session it belongs to, the question and options in each language, and the correct letter |

Both files come filled in with the three sample sessions, so you can see the format. Replace the rows with your own.

## 1. Open them in a spreadsheet

- **Google Sheets:** File > Import > Upload, choose the file, then "Replace spreadsheet."
- **Excel:** open the file directly. Accents and Spanish characters display correctly.

## 2. Fill in sessions.csv

| Column | What to put |
|---|---|
| `session_id` | A short name with no spaces: `session-1`, `forklift-basics`. Lowercase letters, numbers, and hyphens. |
| `version` | `v1` to start. Raise it when you replace the video or change the quiz. |
| `title_en`, `title_es` | The session's name in each language |
| `minutes_en`, `minutes_es` | The video's length in minutes, rounded up |
| `video_en`, `video_es` | The video file name in your R2 bucket |
| `captions_en`, `captions_es` | Optional. The caption file name in your R2 bucket ([CAPTIONS.md](CAPTIONS.md)). Leave blank if you don't have one. |

**One language only?** Leave every `_es` column blank (or every `_en` column). The converter notices and tells you how to set `LANGUAGES`.

## 3. Fill in questions.csv

| Column | What to put |
|---|---|
| `session_id` | Which session the question belongs to. Must match a row in sessions.csv. |
| `question_en` | The question |
| `option_A_en` to `option_F_en` | The answer choices, filled in order from A. Use as many as you need, from two to six. Leave the rest blank. |
| `question_es`, `option_A_es` to `option_F_es` | The same question and choices in Spanish, **in the same order** |
| `correct` | The letter of the correct answer: A, B, C, D, E, or F |

Questions appear in the order of the rows. For a true/false question, put "True" in A and "False" in B.

**Check every correct letter against the video.** If your quiz came with an answer key from someone else, check it too. A wrong letter here means a learner who answers correctly fails.

## 4. Turn the templates into settings

Save or download each file as **CSV (UTF-8)**. In Google Sheets: File > Download > Comma-separated values. In Excel: Save As > CSV UTF-8.

**Option A, no code:** paste both files into any AI assistant with this prompt:

```
I'm setting up ReadyLine by Makersridge, a free training tool. Turn these two CSV files into the
SESSIONS block for Code.gs, in exactly this format:

  {
    id: "session-1", version: "v1",
    title: { en: "...", es: "..." },
    minutes: { en: 13, es: 17 },
    videos: { en: "session-1-en.mp4", es: "session-1-es.mp4" },
    captions: { en: "session-1-en.vtt", es: "session-1-es.vtt" },
    questions: [
      { answer: 0,
        en: { q: "...", a: ["...", "..."] },
        es: { q: "...", a: ["...", "..."] } }
    ]
  }

"answer" is the correct letter turned into a number: A = 0, B = 1, C = 2, D = 3, E = 4, F = 5.
Leave out "captions" when the caption columns are blank, and leave out a language when its columns are blank.
Keep my wording exactly. After the block, list each question with its correct answer in words,
so I can check it by eye.

sessions.csv:
[paste]

questions.csv:
[paste]
```

**Option B, with Node.js installed:** from the repository folder, run

```
node tools/quiz-to-settings.js templates/sessions.csv templates/questions.csv
```

It checks both files, lists any problems by line number, and writes `sessions-block.js`. Add `--write` to put the result straight into `apps-script/Code.gs`. Either way, it prints every question with its correct answer in words for a final check.

## 5. Put it in Code.gs

Replace everything from `const SESSIONS = [` through the matching `];` with the new block. In Apps Script, save, run **setup** (it checks the block again), run **testVideoLinks**, and redeploy (Deploy > Manage deployments > pencil > New version > Deploy).
