# Frequently asked questions

## Cost and ownership

**Is it free?**
Yes. ReadyLine is free and open source under the MIT License. It runs on the free plans of Google and Cloudflare. A small team's training stays within those free plans. Cloudflare asks for a payment method to turn on R2 (video storage), and charges only past 10 GB of stored video a month.

**Is there a catch?**
You set it up and run it yourself, in your own accounts. There's no company in the middle and no subscription. If you'd rather have someone set it up, Makersridge offers that ([makersridge.com](https://makersridge.com)).

**Who owns the data?**
You do. Records live in your Google Sheet, and videos live in your Cloudflare account. Nothing is sent to Makersridge.

**Can I change the code, or use it for my clients?**
Yes. The MIT License lets you use, change, and share it, including for clients and commercial work. Keep the license notice in the code.

## Size and limits

**How many people can it handle?**
The limit that matters is email. Each new learner gets one email: about 1,500 a day from a Google Workspace account, or about 100 from personal Gmail. ReadyLine also caps itself at 60 registration emails an hour and 300 a day by default (you can change these). The Sheet stays responsive into the thousands of learners a year.

**How long can videos be?**
There's no set limit. Long videos are harder to finish on a phone, so most teams keep each session under 20 minutes. R2 storage is free up to 10 GB.

**How many sessions and questions can I have?**
As many as you need. One session works too.

## Learners

**Do learners need an account or an app?**
No. They need an email address, a phone or computer with a web browser, and your access code.

**What if they lose their link, or the email never arrives?**
First, have them check Spam, Junk, and Promotions; that's where a missing email usually is. They can also tap **Already registered? Get your link again** on the training page, or your team can copy their link from **ReadyLine > Look up a person** in the Sheet and send it to them.

**Can they switch phones or come back another day?**
Yes. The same link works anywhere. Passed sessions are saved in your Sheet. A video they were partway through starts over on a new device.

**Can they skip the video or speed it up?**
No. There are no player controls. Skipping ahead and speed changes are blocked, and the video pauses if they leave the page.

**Can they download or share the videos?**
The page has no download option, and video links expire after 12 hours. Nothing on the web can stop someone from recording their screen.

**How do we make the videos?**
Any tool that exports MP4 works. Ours were made in Canva, using its AI voiceover to narrate each slide in English and Spanish. Clipchamp offers free AI voices, and PowerPoint can record your own voice. See [MAKING-VIDEOS.md](MAKING-VIDEOS.md).

**What languages does it support?**
English and Spanish, one or both. Every screen and the email follow the learner's choice. Adding another language means translating the page text in index.html and the email in Code.gs.

**Is it accessible?**
The page uses a typeface designed for readability, large tap targets, a high-contrast design, and screen-reader labels. Captions are supported (see [CAPTIONS.md](CAPTIONS.md)). Test it with your own audience, and add captions to every video.

## Your team

**Can staff give someone another try?**
Yes, on the Overrides tab. See the [admin guide](ADMIN-GUIDE.md).

**Can we change the passing score or the number of attempts?**
Yes, with one setting each. See "Change the passing score or the number of attempts" in the [README](../README.md).

**Can someone retake training they already passed?**
Not built in yet. For now, they can register again with a different email.

**How do we show a client or an auditor that someone completed training?**
Export their rows from the Sheet as a PDF or Excel file. See "Exporting proof" in the [admin guide](ADMIN-GUIDE.md).

**Does it give a certificate?**
Not yet. The Summary row shows Complete with the date, and the Results tab holds the full record.

## Compliance

**Does it make our training OSHA compliant?**
No. ReadyLine records that someone watched your videos and passed your quizzes. Whether your training meets a regulation depends on its content and your industry's rules. Ask a safety or legal professional.

**Is it secure?**
It was tested against bots, link guessing, form abuse, tampered quiz answers, and spreadsheet formula injection. See [SECURITY.md](SECURITY.md) for details and good habits.

## Websites

**Can I put it on my website?**
Link to it with a button, a plain 301 redirect, or your own subdomain. It refuses to load inside another site's frame, as protection against fake copies. See [SHARING.md](SHARING.md).

**Does it slow down my website?**
No. It doesn't run on your website at all. The page is on Cloudflare, the videos on R2, and the rest in Google.

**Will it show up in Google search?**
No. The page tells search engines not to list it, and AI crawlers are blocked. People reach it through your link.
