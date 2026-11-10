# Captions

Captions help workers who are deaf or hard of hearing, anyone watching on a phone with the sound off, and people following training in their second language. ReadyLine shows captions on the video when you add a caption file, with a **Captions** button learners can use to turn them off. They're on by default, and the page remembers each learner's choice.

## What you need

One caption file per video, in **WebVTT** format (the file name ends in `.vtt`). It's a plain text file that looks like this:

```
WEBVTT

1
00:00:00.000 --> 00:00:04.000
Welcome to the team.

2
00:00:04.000 --> 00:00:10.000
Check in at the front desk at the start of every shift.
```

The sample videos in this repository come with sample caption files, so you can see them working in demo mode.

## Making caption files

Pick whichever fits how your videos were made.

- **YouTube Studio (free).** Upload the video as **Unlisted**. Under Subtitles, YouTube creates captions on its own within a few hours. Edit them for accuracy, then use the three-dot menu to download them as `.vtt`. Delete the YouTube video afterward if you don't want it there.
- **Transcription apps.** Many apps that turn audio into text, including free ones built on the open-source Whisper model, can export `.vtt` files. Search for "Whisper subtitles" for your computer.
- **Video editors.** Clipchamp, CapCut, Descript, and similar editors can generate captions and export them. Choose WebVTT (`.vtt`) when you export. If your tool only exports SubRip (`.srt`), see "Converting an SRT file" below.
- **Write them yourself.** For a short video, typing the file by hand in a text editor works fine. Save it with UTF-8 encoding.

**Check the words.** Automatic captions get names, numbers, and safety terms wrong. Read the whole file before you upload it, especially for safety training.

## Adding them

1. Name each file to match its video: `session-1-en.vtt` next to `session-1-en.mp4`.
2. Upload them to the same R2 bucket as your videos.
3. In Code.gs, add a `captions` line to each session, under `videos`:

   ```js
   videos: { en: "session-1-en.mp4", es: "session-1-es.mp4" },
   captions: { en: "session-1-en.vtt", es: "session-1-es.vtt" },
   ```

   Or fill in the `captions_en` and `captions_es` columns in the [quiz templates](QUIZ-TEMPLATE.md).
4. Save, run **setup**, run **testVideoLinks** (the caption files are checked too), and redeploy.

A session with no `captions` line plays as usual without them. If a caption file is missing or broken, the video still plays and the problem is logged in Apps Script's Executions page.

## Converting an SRT file

SRT and WebVTT are nearly the same. To convert by hand:

1. Add the line `WEBVTT` and a blank line at the very top.
2. Change the commas in the times to periods: `00:00:04,000` becomes `00:00:04.000`.
3. Save the file with a `.vtt` ending.

Or paste it into an AI assistant: "Convert this SRT caption file to WebVTT. Don't change any words or timings."

## The other option: captions burned into the video

You can also put captions into the picture itself before upload. HandBrake does this on its Subtitles tab with the "Burn In" option. Burned-in captions can't be turned off, and they need a re-export to fix a typo, so a `.vtt` file is usually easier to manage.
