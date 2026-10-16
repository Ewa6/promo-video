# Frequently asked questions

Quick answers to common questions about the promo video skill. For step-by-step instructions, see the [how-to guides](README.md#make-and-change-videos). For errors, see [Troubleshooting](troubleshooting.md).

## Before you start

### Do I need to know how to code?

No. Claude runs every technical step. You answer questions, review drafts, and generate the voice in ElevenLabs. You might need help installing a few free tools the first time. For details, see [Before you begin](prerequisites.md).

### Do I need the product's code?

The skill is designed to work from the product's code, together with its website and brand. Claude uses the code to recreate real screens and use the product's real wording and colors. If you don't have access to the code, ask Claude before you start whether it can work from your website and files instead.

### What does it cost?

The skill itself is free. You might pay for:

- **ElevenLabs**, depending on your plan and how many takes you generate;
- **a Remotion Company License**, if your company has more than three employees and uses the videos commercially;
- **music or footage licences**, if you add your own.

### Does it work on Windows?

Windows support isn't confirmed. The skill's setup uses tools that are standard on macOS and Linux. On any computer other than a Mac, the robotic preview voice isn't available, so drafts are silent and their timing is estimated.

### Can I make a video in a language other than English?

Only English is supported reliably. The tool that matches the voice to the script recognizes English only, so the pictures and captions might not line up with a voice in another language.

## Voice

### Do I need to give Claude my ElevenLabs API key?

No. Claude never asks for an API key. You either generate the takes yourself at elevenlabs.io, or Claude uses an ElevenLabs connector that's already connected to your Claude session.

### Can I use my own voice recording instead of ElevenLabs?

The skill is designed for ElevenLabs. The project can time any MP3, WAV, or M4A recording, as long as it reads the current script word for word. Tell Claude if you want to try your own recording.

### Do I have to record every cut separately?

Each cut with its own words needs its own recording. A vertical or square copy of a cut reuses the original cut's recording.

### What happens if I change the script after I record the voice?

The recording no longer matches the script, so you need a new take for that cut. Changes to pictures, on-screen text, colors, and scene timing don't need a new take. For details, see [Change a finished video](how-to/change-a-video.md).

## Videos

### Where are my videos saved?

In the `out` folder of the video project. The project is in `marketing/promo-video` inside your product's folder, unless you chose another place. For a full list of files, see [Find your files](how-to/continue-or-save-a-project.md#find-your-files).

### What's the difference between the hero video and the other cuts?

The hero is the main, longer video, about 60–90 seconds, with sound on and no captions. The shorter cuts tell a compressed version of the same story and have captions, because people often watch them on social media with the sound off. For the default set, see [What you get](overview.md#what-you-get).

### Can I choose which cuts I get?

Yes. Tell Claude in the interview which lengths and shapes you need and where they'll run. You can also add a cut later.

### Can I watch the video before it's finished?

Yes. Claude sends you a draft video with the storyboard. You can also ask Claude to open Remotion Studio, a preview app in your browser where you can play the video and move through it frame by frame.

### Does the video show my real customer data?

No. Product screens are recreated with realistic but invented data, and dashboards are labeled "Illustrative data." Screenshots and screen recordings must come from a demo version of your app.

### Can I edit the finished video in another app?

Yes. The videos are standard MP4 files, so you can open them in any video editor. Changes you make there aren't part of the project, so they're lost if Claude renders the video again.

### Why does Claude stop and ask me to approve?

So you can catch problems while they're cheap to fix. The storyboard approval comes before you pay for a voice, and the final approval comes before you publish. For details, see [Two approval points](how-it-works.md#two-approval-points).
