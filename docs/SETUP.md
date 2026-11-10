# Setting up ReadyLine

This guide takes you from nothing to a live training page. Plan on one to two hours the first time. Each step ends with a check, so you know it worked before you move on.

If you get stuck, every step has an **AI helper** prompt. Paste it into ChatGPT, Claude, Gemini, or another assistant, fill in the brackets, and it will walk you through that step. For bigger jobs, like turning a quiz document into settings, see [AI-PROMPTS.md](AI-PROMPTS.md).

## What you'll set up

| | Where | What it's for |
|---|---|---|
| 1 | Your computer | Videos exported as MP4 files |
| 2 | Cloudflare R2 | Stores the videos privately |
| 3 | Cloudflare Turnstile | Keeps bots out of registration |
| 4 | Google Sheets and Apps Script | Registers people, grades quizzes, keeps records, sends emails |
| 5 | Apps Script deployment | Gives the script a web address the page can talk to |
| 6 | site/index.html | Connects the page to your script and adds your name and colors |
| 7 | Cloudflare Pages | Hosts the page |
| 8 | Your phone | A full test run |

## Before you start

- **A Google account** to own the records and send the emails. Use a Google Workspace (company) account if you have one. It can send about 1,500 emails a day, while a personal Gmail account sends about 100, and email from your company's domain is less likely to land in spam.
- **A Cloudflare account.** It's free at cloudflare.com. You don't need to move your website or domain to Cloudflare.
- **Your videos**, one per session per language.
- **Your quiz questions and answers.** The [quiz templates](QUIZ-TEMPLATE.md) are the easiest way to write them down. Check every answer against the video before you start. People who answer correctly shouldn't fail because of a typo in the key.
- **Caption files** for your videos, if you have them (optional, see [CAPTIONS.md](CAPTIONS.md)).
- **HandBrake** (free, [handbrake.fr](https://handbrake.fr)) to make your videos start fast.
- **This repository**, downloaded from GitHub (Code > Download ZIP) and unzipped.

Keep a private note open as you go. You'll collect a few values (an Account ID, two keys, a site key, a web address) and paste them in later steps. Store secret keys in a password manager, not in email or chat.

---

## 1. Prepare your videos

Don't have videos yet? [MAKING-VIDEOS.md](MAKING-VIDEOS.md) walks through turning slides into narrated videos with Canva, Clipchamp, or PowerPoint, including AI voiceover in English and Spanish.

**From PowerPoint:** File > Export > Create a Video. Choose 1080p (or 720p for smaller files) and "Use Recorded Timings and Narrations" if you recorded audio. PowerPoint saves an MP4.

**From Google Slides or Keynote:** Keynote exports video directly (File > Export To > Movie). Google Slides can't export video, so record your screen while presenting, or download as PowerPoint and export from there.

**Make them start fast.** Run each video through HandBrake (free, handbrake.fr) with the "Fast 1080p30" preset and **Web Optimized** checked. This moves the file's index to the front, so the video starts playing before it has fully downloaded. If you're comfortable with a terminal, this does the same thing without re-encoding:

```
ffmpeg -i input.mp4 -c copy -movflags +faststart session-1-en.mp4
```

**Name them by session and language:** `session-1-en.mp4`, `session-1-es.mp4`, `session-2-en.mp4`, and so on. You can use other names, as long as they match the `videos` entries in your settings later.

**Write down each video's length in minutes.** The page tells learners how long the video is before they start.

**Captions (optional).** If you have caption files for your videos, name them to match (`session-1-en.vtt`) and upload them with the videos in step 2. [CAPTIONS.md](CAPTIONS.md) explains how to make them.

**Check:** each file plays on your computer, and the names match the pattern above.

**AI helper.** Paste this into any AI assistant:

```
I'm setting up ReadyLine by Makersridge, a free open-source training tool that uses Google Sheets and Apps Script, Cloudflare R2, Cloudflare Turnstile, and Cloudflare Pages. I'm not a developer.

I have a [PowerPoint / Keynote / Google Slides] presentation with [recorded narration / no narration] on [Windows / Mac].
Walk me through exporting it as an MP4 video, then making it web-optimized in HandBrake so it starts playing fast.
I need one video per session per language, named session-1-en.mp4, session-1-es.mp4, and so on.
Keep each step short and tell me how to find each video's length in minutes.
```

---

## 2. Store the videos in Cloudflare R2

1. Sign in to Cloudflare and open **R2 Object Storage** from the left menu. Cloudflare may ask for a payment method to turn on R2. Small video libraries stay within the free tier (10 GB of storage).
2. Click **Create bucket**. Name it `readyline-videos` (or your own name). Leave public access **off**.
3. Open the bucket and upload all your videos, and your caption files if you have them.
4. Go back to the R2 overview page and copy your **Account ID**. Save it in your note.
5. Click **Manage API tokens** (or **API Tokens**), then **Create API token**:
   - Permissions: **Object Read only**
   - Specify bucket: only your training bucket
   - Create the token.
6. Copy the **Access Key ID** and the **Secret Access Key**. Cloudflare shows the secret only once. Save both in your password manager.

**Check:** the bucket lists all your videos, and you have an Account ID, an Access Key ID, and a Secret Access Key.

**AI helper.** Paste this into any AI assistant:

```
I'm setting up ReadyLine by Makersridge, a free open-source training tool that uses Google Sheets and Apps Script, Cloudflare R2, Cloudflare Turnstile, and Cloudflare Pages. I'm not a developer.

Walk me through creating a private Cloudflare R2 bucket named [bucket name], uploading my videos,
and creating an R2 API token with Object Read only permission limited to that bucket.
Tell me exactly which values to copy (Account ID, Access Key ID, Secret Access Key) and where each one goes.
Don't ask me to paste the secret key here.
```

---

## 3. Create the bot check (Cloudflare Turnstile)

1. In Cloudflare, open **Turnstile** (under Application security, or search for it).
2. Click **Add widget**.
   - Name: your training name
   - Hostnames: the address you plan to use in step 7, which is your project name plus `.pages.dev` (for example `acme-training.pages.dev`). Add your own domain too if you'll use one later.
   - Widget mode: **Managed**
3. Create it, then copy the **Site Key** and the **Secret Key**.
   - The Site Key is public. It goes in the page.
   - The Secret Key is private. It goes in Google (step 4) and nowhere else.

**Check:** you have a Site Key and a Secret Key.

**AI helper.** Paste this into any AI assistant:

```
I'm setting up ReadyLine by Makersridge, a free open-source training tool that uses Google Sheets and Apps Script, Cloudflare R2, Cloudflare Turnstile, and Cloudflare Pages. I'm not a developer.

Walk me through creating a Cloudflare Turnstile widget in Managed mode for a site at [your-project].pages.dev.
Explain the difference between the Site Key and the Secret Key and where each one goes:
the Site Key in site/index.html, the Secret Key in Apps Script Script Properties.
```

---

## 4. Create the Google Sheet and script

1. Sign in to the Google account that should own the records.
2. Create a new Google Sheet. Name it something like **Training Results**.
3. In the Sheet, open **Extensions > Apps Script**. Rename the project at the top (for example **ReadyLine**).
4. Delete the sample code in the editor. Open `apps-script/Code.gs` from this repository in a text editor, copy all of it, and paste it in.
5. Edit **YOUR SETTINGS** at the top. [CUSTOMIZE.md](CUSTOMIZE.md) explains each one.
   - `TRAINING_NAME`, `SENDER_NAME`, `SUPPORT_CONTACTS`
   - `ONBOARDING_CODE`: the code people type to register. Use three random words, like `maple-river-anchor`.
   - `PASS_PERCENT` and `MAX_ATTEMPTS`: the score needed to pass (default 100) and quiz attempts per session (default 2)
   - `LANGUAGES`: `["en"]`, `["es"]`, or `["en", "es"]`
   - `R2_ACCOUNT_ID` and `R2_BUCKET` from step 2
   - `SESSIONS`: your sessions, video file names, questions, and answers. The [quiz templates](QUIZ-TEMPLATE.md) build this block for you.
   - Leave `TRAINING_URL` as it is for now. You'll fill it in at step 7.
6. Click **Save** (the disk icon).
7. Add your secret keys. Click the gear icon (**Project Settings**), scroll to **Script Properties**, click **Add script property**, and add three:

   | Property | Value |
   |---|---|
   | `R2_ACCESS_KEY_ID` | your R2 Access Key ID |
   | `R2_SECRET_ACCESS_KEY` | your R2 Secret Access Key |
   | `TURNSTILE_SECRET` | your Turnstile Secret Key |

   Registration stays off until `TURNSTILE_SECRET` is set, on purpose, so the form can't run without the bot check.
8. Back in the editor, choose **setup** from the function dropdown at the top (not doPost) and click **Run**. Google asks for permission. Approve it, including "send email as you" and "connect to an external service." If Google shows "Google hasn't verified this app," click **Advanced**, then **Go to (your project)**. That warning appears for personal scripts like this one. It's your own code, running in your own account.
9. Read the log at the bottom.
   - "Setup finished" means it worked. The Sheet now has Summary, Registrations, Results, and Overrides tabs, and a **ReadyLine** menu.
   - Warnings about placeholders are reminders for later steps.
   - "Fix these in YOUR SETTINGS" lists mistakes in your sessions (a missing video name, an answer number out of range). Fix them, save, and run setup again.
10. Choose **testVideoLinks** and click **Run**. The log should show one OK line per video. If any line says FAILED, check the bucket name, the file names, the Account ID, and the two R2 keys.

**Check:** setup finishes, the four tabs exist, and testVideoLinks shows OK for every video.

**AI helper.** Paste this into any AI assistant:

```
I'm setting up ReadyLine by Makersridge, a free open-source training tool that uses Google Sheets and Apps Script, Cloudflare R2, Cloudflare Turnstile, and Cloudflare Pages. I'm not a developer.

Walk me through creating a Google Sheet, opening Extensions > Apps Script, and pasting in Code.gs.
Then help me fill in YOUR SETTINGS at the top: training name, sender name, access code, languages,
support contacts, passing score (PASS_PERCENT), quiz attempts (MAX_ATTEMPTS), and my R2 Account ID and bucket.
Then show me how to add three Script Properties (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, TURNSTILE_SECRET)
and run the functions setup and testVideoLinks. Tell me what a successful log looks like.

If something fails, here's the log: [paste the log, never your keys]
```

---

## 5. Publish the script as a web app

1. In Apps Script, click **Deploy > New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone**. Learners don't need Google accounts. The address can only register people, look up personal links, issue video links to registered learners, and save quiz results. It can't read or list your Sheet.
5. Click **Deploy**, approve if asked, and copy the **Web app URL**. It ends in `/exec`. Save it in your note.

**Every change to Code.gs after this needs a redeploy:** Deploy > **Manage deployments** > pencil icon > Version: **New version** > Deploy. Choosing **New deployment** instead creates a new address, and your page will stop connecting.

**Check:** you have a URL ending in `/exec`.

**AI helper.** Paste this into any AI assistant:

```
I'm setting up ReadyLine by Makersridge, a free open-source training tool that uses Google Sheets and Apps Script, Cloudflare R2, Cloudflare Turnstile, and Cloudflare Pages. I'm not a developer.

Walk me through deploying my Google Apps Script as a web app with Execute as Me and access for Anyone,
and copying the web app URL that ends in /exec.
Then explain how to update it later with Manage deployments > New version so the URL never changes.
```

---

## 6. Connect the page

1. Open `site/index.html` in a text editor (Notepad, TextEdit in plain-text mode, or VS Code).
2. Near the top, find **YOUR SETTINGS** and fill in:
   - `SCRIPT_URL`: the web app URL from step 5
   - `TURNSTILE_SITE_KEY`: the Site Key from step 3
   - `TRAINING_NAME` and `LANGUAGES`: the same as in Code.gs
   - `ORGANIZATION`: your organization's name
   - `CONTACTS`: who people contact for help
   - `BRAND_COLOR`, `ACCENT_COLOR`, and `HEADER_STYLE`: optional. The default is a plain white page. See [CUSTOMIZE.md](CUSTOMIZE.md) to use your colors.
3. Save the file.
4. Make the upload zip. It must contain exactly three files from the `site` folder: `index.html`, `_headers`, and `robots.txt`. Don't include `demo.js`.
   - **Mac:** open the `site` folder, select those three files, right-click, Compress 3 Items. (`_headers` may be hidden; press Cmd+Shift+. to show hidden files.)
   - **Windows:** select the three files, right-click, Send to > Compressed (zipped) folder.
   - **Terminal:** `node tools/make-site-zip.js` builds `readyline-site.zip` and checks your settings first.

**Check:** you have a zip with those three files, and `SCRIPT_URL` is no longer empty.

**AI helper.** Paste this into any AI assistant:

```
I'm setting up ReadyLine by Makersridge, a free open-source training tool that uses Google Sheets and Apps Script, Cloudflare R2, Cloudflare Turnstile, and Cloudflare Pages. I'm not a developer.

I need to fill in the settings block at the top of site/index.html without breaking it. Here's the block:
[paste the YOUR SETTINGS block]

My values: script URL [ ], Turnstile site key [ ], training name [ ], languages [ ], organization [ ],
contact [name and email], colors [leave the defaults / my brand colors are ___].
Give me the block back with my values filled in and nothing else changed.
Then tell me how to zip index.html, _headers, and robots.txt on [Windows / Mac].
```

---

## 7. Put the page on Cloudflare Pages

1. In Cloudflare, open **Workers & Pages**, click **Create**, choose **Pages**, then **Upload assets** (direct upload).
2. Name the project. The name becomes the address, for example `acme-training.pages.dev`. Pick something short.
3. Drag in your zip (still zipped) and click **Deploy site**.
4. Copy the address Cloudflare gives you.
5. Go back to Apps Script, set `TRAINING_URL` to that address (keep the slash at the end), save, and redeploy: Deploy > Manage deployments > pencil > **New version** > Deploy.
6. If Cloudflare gave you a different address than you planned (it adds letters when a name is taken), go back to Turnstile, open your widget, and put in the exact address. Until it matches, the bot check fails and nobody can register.

**To update the page later:** Workers & Pages > your project > **Create deployment** > upload the new zip > Production. The address stays the same.

**Using your own domain:** whoever manages your domain can add it under the project's **Custom domains** tab. Then update `TRAINING_URL` in Code.gs, redeploy, and add the domain to your Turnstile widget. To send people from a page on your existing website, use a plain 301 redirect or a button linking to the training address. Don't use a "cloaking" or "masking" redirect: the page refuses to load inside another site, as a security measure.

**Check:** the address opens your training page with your name at the top and no yellow demo banner.

**AI helper.** Paste this into any AI assistant:

```
I'm setting up ReadyLine by Makersridge, a free open-source training tool that uses Google Sheets and Apps Script, Cloudflare R2, Cloudflare Turnstile, and Cloudflare Pages. I'm not a developer.

Walk me through uploading my zip to a new Cloudflare Pages project with direct upload,
then setting TRAINING_URL in Code.gs to the new address and redeploying the script as a new version,
and making sure my Turnstile widget lists the exact address.
Also explain how to upload a new version of the page later without changing the address.
```

---

## 8. Test it end to end

1. On your phone, open the training address. Register with your own email and the access code.
2. Open the email and tap the link. Check that the sender name and training name are right. If it went to spam, see "When emails land in spam" in the [admin guide](ADMIN-GUIDE.md).
3. Play the first video. Try to skip ahead (you shouldn't be able to). Finish it, take the quiz, and fail it on purpose once. Watch again and pass.
4. Continue through every session.
5. Open the Sheet. Summary should show one row for you, marked Complete. Results should show every attempt. Try **ReadyLine > Look up a person** with your email.
6. On the training page, tap **Already registered? Get your link again** and confirm the same link arrives.
7. Delete your test rows from Summary, Registrations, and Results before launch.

**Check:** you finished every session, and the Sheet recorded it all.

**AI helper.** Paste this into any AI assistant:

```
I'm setting up ReadyLine by Makersridge, a free open-source training tool that uses Google Sheets and Apps Script, Cloudflare R2, Cloudflare Turnstile, and Cloudflare Pages. I'm not a developer.

Give me a test checklist for my training on a phone: register, open the email link, try to skip the video,
fail a quiz on purpose, pass on the next try, finish every session, check the Summary and Results tabs,
and test "Get your link again." If something goes wrong, here's what I see: [describe or paste the error]
and what Apps Script Executions shows: [paste].
```

---

## Launch checklist

- [ ] Every answer key checked against its video
- [ ] `ONBOARDING_CODE` changed from the sample, and hard to guess
- [ ] `SUPPORT_CONTACTS` in Code.gs and `CONTACTS` in index.html list real people
- [ ] `TRAINING_URL` matches your Pages address, and the script was redeployed after setting it
- [ ] Turnstile lists your exact page address
- [ ] Test rows deleted from the Sheet
- [ ] 2-step verification turned on for your Google and Cloudflare accounts
- [ ] Your onboarding paperwork lists the training address and the access code

**Wording for your onboarding paperwork** (Spanish wording and QR codes are in [SHARING.md](SHARING.md)):

> **Complete your training**
> Go to: [your training address]
> Access code: [your code]
> You'll get a personal link by email. You can stop between sessions and come back with the same link.

## Next

- Getting the link to your people, including QR codes: [SHARING.md](SHARING.md)
- Running it day to day: [ADMIN-GUIDE.md](ADMIN-GUIDE.md)
- Updating to a new version: [UPGRADING.md](UPGRADING.md)
- Changing sessions, colors, and languages: [CUSTOMIZE.md](CUSTOMIZE.md)
- How it's protected: [SECURITY.md](SECURITY.md)
