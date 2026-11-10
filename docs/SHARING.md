# Getting the training to your people

Learners need two things: the training address and your access code. Everything after that arrives by email.

## Where to put the link

- **Onboarding paperwork** and offer letters
- **A text message** after someone accepts a job or shift
- **A QR code** on a flyer, a badge card, or a break-room poster
- **Your website**, as a button or a plain redirect (see below)

## The wording

**English**

> **Complete your training**
> Go to: [your training address]
> Access code: [your code]
> You'll get a personal link by email. You can stop between sessions and come back with the same link.

**Spanish**

> **Complete su capacitación**
> Vaya a: [su dirección de capacitación]
> Código de acceso: [su código]
> Recibirá un enlace personal por correo electrónico. Puede detenerse entre sesiones y regresar con el mismo enlace.

Add how long it takes (the total of your video lengths plus a few minutes per quiz) and who to contact with questions.

## Making a QR code

Most hourly workers will arrive on a phone, and a QR code saves them from typing the address.

- **Google Chrome (free, built in).** Open your training page, click the share icon or the three-dot menu, choose **Cast, save, and share > Create QR code**, and download it.
- **Microsoft Edge.** Right-click the page and choose **Create QR code for this page**.
- **Any QR generator.** Many free sites make them. Choose one that makes a **static** QR code (the address is stored in the image), so it keeps working without an account or subscription.

Before you print:

- Point the code at the plain training address, not a personal link from your own email.
- Test it with two different phones.
- Print it at least 1 inch (2.5 cm) wide, with a white margin around it.
- Write the address under the code too, for anyone whose camera won't scan it.
- Leave the access code off public posters if strangers can see them. Put it in the paperwork, or tell people in person.

## Linking from your website

- **A button or link** on any page, pointing to your training address. This works with any website builder.
- **A redirect**, for example `yourcompany.com/training`. Use a plain **301 redirect**. Don't use "cloaking," "masking," or "frame" redirects: the training page refuses to load inside another site, as protection against fake copies, so those show a broken page.
- **Your own domain**, like `training.yourcompany.com`, set up in Cloudflare Pages under your project's **Custom domains**. See step 7 in [SETUP.md](SETUP.md).

The personal links in people's emails always point to the training address itself, so they keep working however people first arrive.
