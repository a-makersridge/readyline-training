# Making your training videos

ReadyLine plays any MP4 video, so you can make yours with whatever tool you already know. This guide covers the tools that work well for training videos with a voiceover, and the settings that make them play smoothly on a phone.

## How we made ours

The training ReadyLine was first built for started as a set of PowerPoint presentations. The videos were rebuilt in **Canva**, using a paid Canva account's AI voiceover to narrate each slide in English and in Spanish, and exported from Canva as MP4 files. Each video was then made web-optimized so it starts playing right away (step 4 below). One video per session per language, about 13 to 22 minutes each.

That's one way to do it. Pick the tool that fits your budget and what you already have.

## Choosing a tool

| Tool | Voiceover | Cost | Good for |
|---|---|---|---|
| **[Canva](https://www.canva.com)** | AI voices you generate from a typed script, placed on the timeline under each slide. Paid plans add more voices and higher usage limits ([overview](https://videodubber.ai/blogs/canva-ai-voice-generator/)). | Free plan available; paid plans for more voices | Polished slides and narration in one place, without recording your own voice. What we used. |
| **[Microsoft Clipchamp](https://clipchamp.com/en/features/ai-voice-over-generator/)** | Free AI voiceover, 400 voices in 80 languages, Spanish included | Free plan available | A free option with AI narration. Built into Windows 11, also on the web. |
| **[PowerPoint](https://support.microsoft.com/office/save-a-presentation-as-a-movie-file-or-mp4-4e1ebcc1-f46b-47b6-922a-bac76c4a5691)** | Record your own voice slide by slide (Slide Show > Record) | Included with Microsoft 365 | You already have the deck and want a real person's voice |
| **Keynote** | Record your own voice (Play > Record Slideshow) | Free on Mac | Mac users with a Keynote deck |
| **Google Slides** | None, and it can't export video | Free | Download as PowerPoint (File > Download > .pptx) and finish in one of the tools above |

AI voice features and plan limits change often. Check the current details in the tool before you start, including whether its voices and music are licensed for your business use.

## 1. Start from your slides

- **Make text big.** Most learners watch on a phone. Aim for no more than about 25 words per slide, in a large, plain font.
- **One idea per slide.** It's easier to narrate and easier to remember.
- **Put every quiz answer on screen.** If a question asks about it, the video should show it and say it. This is the single best way to avoid quiz complaints.
- **Keep sessions short.** Under 15 to 20 minutes each. Split long training into more sessions; ReadyLine opens them in order.
- **Importing a PowerPoint into Canva:** in Canva, use **Create a design > Import file** (or drag the .pptx onto the home page). Check fonts and layouts after import, since some formatting shifts.

## 2. Write the narration script

Write what the voice will say for each slide, word for word. A script makes the AI voice sound natural, keeps narration and slides in sync, and becomes your caption file later.

- Write the way you speak: short sentences, plain words.
- Say numbers and acronyms the way you want them heard ("P-P-E" or "personal protective equipment").
- Read it out loud once. Anything you stumble over, the AI voice will too.

The AI prompt "Write a narration script from your slides" in [AI-PROMPTS.md](AI-PROMPTS.md) drafts one for you.

## 3. Add the voiceover and export

**Canva**
1. Open your presentation (or a video design) in the Canva editor.
2. Add an AI voice from the editor (look under Elements > Audio, or the AI Voice app), paste the script for one slide, choose a voice and language, preview, and generate.
3. Place each clip under its slide on the timeline, and set each slide's length to match its narration.
4. For Spanish, make a copy of the design, swap in the Spanish script and a Spanish voice, and adjust the timings. Spanish narration usually runs longer.
5. **Share > Download > MP4 Video**, at 1080p.

**Clipchamp**
1. Import your slides as images (export them from PowerPoint or Canva as PNG), or record them.
2. Add **Text to speech** from the Record & create panel, paste your script, and pick a voice and language.
3. Line up each voice clip with its slide, then **Export** at 1080p.

**PowerPoint**
1. **Slide Show > Record**, and narrate each slide. PowerPoint saves the timing for each slide as you go.
2. **File > Export > Create a Video** (Windows) or **File > Export > MP4** (Mac). Choose 1080p and **Use Recorded Timings and Narrations**.

## 4. Make it web-optimized

Run each finished MP4 through **[HandBrake](https://handbrake.fr)** (free): choose the **Fast 1080p30** preset, check **Web Optimized**, and start. This lets the video begin playing before it has fully downloaded, which matters on a phone signal. If you use a terminal, this does the same thing without re-encoding:

```
ffmpeg -i input.mp4 -c copy -movflags +faststart session-1-en.mp4
```

## 5. Name, caption, and upload

- **Name** each file by session and language: `session-1-en.mp4`, `session-1-es.mp4`.
- **Note the length** in minutes for the `minutes` setting.
- **Captions:** your narration script is most of a caption file already. See [CAPTIONS.md](CAPTIONS.md).
- **Upload** to your R2 bucket (step 2 of [SETUP.md](SETUP.md)).

## Before you call it done

- Watch the whole video on a phone, with the sound on and then with it off.
- Check that every quiz answer appears on screen and in the narration.
- Have a fluent speaker check the Spanish version's voice and wording.
- Keep your source files (the Canva design, the .pptx, and the scripts). When the training changes, you'll edit and re-export instead of starting over. After replacing a video, raise its session's `version` in Code.gs.
