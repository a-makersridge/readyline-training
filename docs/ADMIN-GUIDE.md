# Running ReadyLine day to day

Your team works in the Google Sheet. Start with the Summary tab, and use Overrides to give someone another attempt.

## The tabs

| Tab | What it holds | Who writes it |
|---|---|---|
| **Summary** | One row per person: overall status, each session's result, attempts, best score, the date passed, and the date they finished everything | The script. The **Notes** column is yours. |
| **Results** | One row per quiz attempt, with every answer marked correct or wrong, and the video start and finish times. This is your proof of completion. | The script only |
| **Registrations** | One row per person: name, email, language, registration ID, and how many times their link has been sent | The script. You may edit **Links sent**. |
| **Overrides** | Extra attempts your team has granted, with who approved them and why | You |

## Looking up one person

In the Sheet, open the **ReadyLine** menu and choose **Look up a person**. Enter their email (capital letters and spaces don't matter). You'll see:

- Their name, language, and when they registered
- Their overall status, and each session's result, attempts, and pass date
- How many link emails have gone out, and whether they've hit the limit
- Their personal link, with a **Copy link** button

When someone says they never got the email, this is the fastest fix: copy their link and text or email it to them yourself. Send it only to them, because anyone with the link takes the training as them.

If the menu doesn't show, reload the Sheet. The first time you use it, Google may ask you to approve the script again.

## Reading the Summary tab

- **Overall** shows Not started, In progress (Session 2), Out of attempts (Session 2), or Complete.
- **Each session** shows Pass, Failed with 1 left, Out of attempts, Not started, or Not open yet (the session before it isn't passed).
- **Colors:** green is passed or complete, yellow is failed with an attempt left, red is out of attempts. Red rows are the people to call.
- It updates itself when someone registers, submits a quiz, or gets an override. If it ever looks off, use **ReadyLine > Refresh summary** in the Sheet's menu.
- Sort and filter it freely. Use the **Notes** column for your own notes; the script doesn't write there.

## Giving someone another attempt

1. Open **Overrides** and add a row.
2. **Email:** the email they registered with. Copy it from Summary. Capital letters and spaces don't matter, but a different address won't match.
3. **Session:** pick it from the dropdown.
4. **Extra attempts:** usually `1`.
5. **Note** and **Date:** who approved it and why.
6. Tell them to open their same link again. The session reopens right away, and they watch the video again before the quiz. Their Summary row updates as soon as you finish the row.

Don't delete rows from Results to reset someone. That erases the record that they took the training.

## Common situations

| Situation | What to do |
|---|---|
| Lost or never got the email | Usually it's in their Spam, Junk, or Promotions folder (see "When emails land in spam" below). Otherwise they tap **Already registered? Get your link again**, or you send it yourself from **ReadyLine > Look up a person**. |
| The resend stops working | Each email can be sent at most 5 times, the first send included. On their Registrations row, set **Links sent** back to `1`. |
| Out of attempts | Add a row in Overrides, then tell them to reopen their link. |
| Registered twice with different emails | Registrations highlights same-name rows in yellow. Each email is a separate person starting from Session 1. Check whether it was a mistake or a way to get extra attempts. |
| Switching phones or computers | The same link works anywhere. Passed sessions and attempts are saved in the Sheet. A video they were partway through starts over on the new device. |
| Video won't load | Have them refresh the page. Video links last 12 hours and renew on refresh. |
| Needs to retake training they already passed | Not built in. One option: they register again with a different email, and you note it in Summary's Notes column. |
| Need proof someone finished | Their Summary row shows Complete and the date. Results has every attempt with each answer and the video times. |
| Want a different passing score or more attempts for everyone | Change `PASS_PERCENT` or `MAX_ATTEMPTS` in Code.gs and redeploy. See "Change the passing score or the number of attempts" in the README. |
| The access code leaked | Change `ONBOARDING_CODE` in Code.gs and redeploy. Links people already have keep working. |

## When emails land in spam

If **Links sent** on their row is 1 or more, the script handed the email to Google. When it still doesn't show up, it's almost always in the person's Spam, Junk, or Promotions folder. Gmail is cautious about a first email from a new sender that contains a link.

- **Ask them to search their whole mailbox** for the training name or your email address, and to mark it "Not spam" if they find it there. The confirmation screen tells them the same.
- **Check your Gmail Sent folder.** Emails the script sends appear there. A bounce from "Mail Delivery Subsystem" in your inbox means the address doesn't exist, usually a typo.
- **Send the link yourself** from **ReadyLine > Look up a person**.

To land in inboxes more often:

- **Send from a Google Workspace account on your company's domain** (you@yourcompany.com), not a personal Gmail. Workspace domains are set up to prove the email really came from you.
- **Keep the sender name recognizable** (`SENDER_NAME` in Code.gs), and tell people in your paperwork who the email will come from.
- **Leave the email wording plain.** Links to other sites, attachments, and words like "free" or "urgent" make spam filters more suspicious.

## Troubleshooting

Start with the Apps Script **Executions** page (the clock icon in the left bar). It lists every error and every time an email cap was reached.

| What people see | Likely cause | Fix |
|---|---|---|
| "Something went wrong" on every action | The script was deployed as a New deployment (new address), or `SCRIPT_URL` in the page is wrong | Redeploy as a **New version** of the existing deployment, and check `SCRIPT_URL` |
| "Registration is busy right now" | The hourly or daily email cap was reached | Wait for the next hour, or raise the caps in Code.gs and redeploy |
| "That access code isn't right" for everyone | The code in your paperwork doesn't match `ONBOARDING_CODE` | Make them match |
| Nobody can register, and Executions shows "TURNSTILE_SECRET missing" | The Turnstile Secret Key isn't in Script Properties | Add it. Registration stays off without it, on purpose. |
| "We couldn't confirm you're not a bot" for everyone | The Turnstile widget doesn't list your page's exact address | Add the address in Turnstile |
| Videos won't play for anyone | R2 keys changed, a file was renamed, or the bucket name is wrong | Run **testVideoLinks** and fix whatever says FAILED |
| "This link isn't working" | The link was copied incompletely | Tap **Get my link again** on that screen |
| No email arrives | Spam folder, a typo in the address, or the 5-send limit | Check spam, then find the address in Registrations and check **Links sent** |
| A yellow "Demo mode" banner on your live page | `SCRIPT_URL` is empty in the uploaded index.html | Fill it in, rebuild the zip, and upload again |
| Your website's link shows a broken frame | The redirect is set to "cloaking" or "masking" | Use a plain 301 redirect or a button |

## Exporting proof for a client or an audit

The Sheet is your record. To hand someone a copy:

**One person**
1. On the **Results** tab, click **Data > Create a filter**.
2. Click the filter icon on the **Email** column and choose that person's email.
3. Select the rows that are showing, including the header row.
4. **File > Download > PDF**. Under Export, choose **Selected cells**. Set the layout to **Landscape** and **Fit to width**, then **Export**.
5. Remove the filter when you're done (Data > Remove filter).

Their **Summary** row (Complete, and the date) makes a good one-line cover page. Export it the same way.

**A date range or a whole client group**
1. Filter **Results** by the **Submitted** column (Filter by condition > Date is after) or by **Email**.
2. **File > Download** and choose **Microsoft Excel (.xlsx)** or **Comma-separated values (.csv)** for the current tab, or **PDF** with Selected cells.

**Ongoing access** for a client contact: share the Sheet with them as **Viewer**, or better, make a copy that holds only their people's rows and share that. Don't share the original Sheet with edit access; editors can see the script and its keys.

The Results tab shows, for each attempt: the date and time, name, email, language, session, version, attempt number, score, pass or fail, when the video was started and finished, and every answer marked correct or wrong.

## Keeping records

The Sheet keeps names, emails, and results until someone deletes them. Decide how long you need training records (your industry or clients may require a minimum) and clear older rows on a schedule.
