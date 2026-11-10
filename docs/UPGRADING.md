# Upgrading to a new version

New versions of ReadyLine are listed in [CHANGELOG.md](../CHANGELOG.md), with notes on anything you need to do. Upgrading keeps your Sheet, your records, your videos, and your settings. It takes about 15 minutes.

**Which version am I on?** In Apps Script, run **setup**. The log starts with "Setup finished. ReadyLine 1.0.0" (or whichever version you have). The first lines of `site/index.html` also name the version.

## Before you start

- Read the CHANGELOG entries between your version and the new one. Some upgrades add a setting or a step.
- Make a copy of your Sheet (File > Make a copy) as a backup. Your records stay in the original; the copy is only insurance.
- Pick a quiet time. People in the middle of a quiz during the switch may need to submit again.

## 1. Upgrade the script

1. Download the new version of the repository.
2. In Apps Script, select **everything from the top of Code.gs down to the line `END OF YOUR SETTINGS`**, and copy it into a text file. That's your settings, sessions, and quiz.
3. Open the new `apps-script/Code.gs`. Copy **everything after** its `END OF YOUR SETTINGS` line.
4. In Apps Script, delete everything after your `END OF YOUR SETTINGS` line and paste in the new code.
5. Compare your settings with the new version's settings. If the new version added a setting (the CHANGELOG says so), copy that line into your settings.
6. Save, run **setup**, run **testVideoLinks**, and redeploy: Deploy > Manage deployments > pencil > **New version** > Deploy.

Your Script Properties (the R2 and Turnstile keys) stay where they are. You don't need to enter them again.

## 2. Upgrade the page

1. Open your current `site/index.html` and copy the **YOUR SETTINGS** block near the top.
2. Open the new `site/index.html` and replace its YOUR SETTINGS block with yours. Add any new settings the CHANGELOG mentions.
3. Make the zip (`index.html`, `_headers`, `robots.txt`) and upload it in Cloudflare Pages: your project > Create deployment > Production.

Upgrade the script first, then the page, in the same sitting. A new page talking to an old script can show "Something went wrong."

## 3. Check it

Open the training page on your phone, open a test link, and check that the video plays and the quiz loads. Look at the Summary tab to confirm your records are still there.

## Using git instead

If you track your copy with git, keep your settings in a branch, merge new releases from this repository, and resolve conflicts in the two YOUR SETTINGS blocks by keeping your values and adding any new lines.

## Stay informed

On the GitHub page, click **Watch > Custom > Releases** to get an email when a new version comes out.
