# Before you begin

This page lists everything you need before you make your first promo video. Check each item. If something is missing, [Set up the skill](getting-started.md) explains how to add the tools.

## Required

### Claude Code

The promo video skill is a *Claude Code skill*: a set of instructions and tools that Claude Code loads when you ask for a video. You need Claude Code installed and signed in on the computer where you'll make the video.

**How to check:** Open Claude Code and send a message. If Claude answers, you're ready.

### The product's code on your computer

Claude researches the product from its code, so the product's code folder (its *repository*) needs to be on your computer. You open Claude Code in that folder. Claude saves the video project inside it, in a folder named `marketing/promo-video` unless you choose another place.

**How to check:** You can open the product's folder in Claude Code, and Claude can describe what the product does.

### An ElevenLabs account

ElevenLabs is the AI voice service that produces the voiceover. You need an account that can use the Eleven v4 model. You don't need to share an API key with Claude, and Claude never asks for one.

**How to check:** Sign in at [elevenlabs.io](https://elevenlabs.io) and confirm that you can generate speech.

### Tools that turn the project into video

Claude runs these tools for you, but they must be installed on your computer:

| Tool | Why it's needed | How to check |
|---|---|---|
| Node.js, version 22.18 or later, with npm | Runs the video project | In a terminal, run `node -v`. The result must be `v22.18.0` or later. |
| git | Installs the skill and builds the speech-timing tool | Run `git --version`. |
| make | Builds the speech-timing tool the first time | Run `make --version`. On a Mac, installing the Xcode Command Line Tools adds it. |

A *terminal* is the app where you type commands, such as Terminal on a Mac. If you prefer, ask Claude to run these checks for you.

### An internet connection

The first time Claude prepares a project, it downloads the video tools and a speech-recognition model. After that, most work happens on your computer.

## Optional

| Item | What it adds | If you don't have it |
|---|---|---|
| ffmpeg | A faster, system-wide audio and video tool | Claude uses the copy that comes with the video tools. |
| A Mac | A robotic preview voice, so you can hear the draft before you pay for a real voice | Drafts are silent and their timing is estimated. |
| An ElevenLabs connector in Claude | Claude generates the voice recordings for you | You generate them yourself at elevenlabs.io and send Claude the files. |
| A demo version of your app that runs on your computer | Real screenshots of your product | Claude recreates the screens from the code instead. |
| Your own footage or music | Real clips or a music bed under the voice | The video uses animation only, with no music. |

## Things to have ready

Collect these before the interview. Claude asks only for what it can't find in your code or website. For a full checklist, see [Prepare for your first video](how-to/prepare-for-your-video.md).

- Logo files, in color and in white, preferably SVG or PNG with a transparent background.
- Your call to action, such as a website address or "Book a demo."
- Any numbers or claims you want in the video, each with its source.
- Example videos you like, if you have any.

## Permissions and licences

- **Remotion licence:** Remotion is free for individuals and companies with up to three employees. Larger companies need a [Remotion Company License](https://www.remotion.pro/license) for commercial use.
- **ElevenLabs rights:** What you can do with the generated voice depends on your ElevenLabs plan.
- **Music and footage:** You must hold a licence for any music or footage you add.

## Next steps

- [Set up the skill](getting-started.md)
- If you've already set up the skill, go to [Quick start: make your first video](quick-start.md).
