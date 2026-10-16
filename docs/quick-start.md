# Quick start: make your first video

This quick start takes you from a request to a finished promo video with the default settings. It uses the manual voiceover route, where you generate the voice yourself at elevenlabs.io, because it works for everyone.

## Before you begin

- [Set up the skill](getting-started.md).
- Sign in to [elevenlabs.io](https://elevenlabs.io) in your browser.
- Have your logo files ready, if you have them.

## Step 1: Ask for a video

1. Open Claude Code in your product's folder.
2. Type a request, for example:

   ```text
   Make a promo video for this product.
   ```

   You can also type `/promo-video`.

Claude reads your code and website first, and then starts the interview.

## Step 2: Answer the interview

Claude asks up to four questions at a time, with its recommended answer listed first.

1. Answer each question. If you're unsure, choose the recommended option.
2. When Claude asks for logo files, tell Claude where they are on your computer, for example `~/Downloads/logo.svg`.

Claude then researches the product and builds the first draft. This takes a while, and you don't need to do anything.

## Step 3: Approve the storyboard

Claude shows you the script for each cut, a storyboard image, and draft videos with a robotic voice or no sound.

1. Read the script and look at the storyboard.
2. Reply with any changes, or reply that you approve.

For what to look for, see [Review and approve the storyboard](how-to/review-the-storyboard.md).

## Step 4: Generate the voiceover

For each cut, Claude gives you the script text and the voice settings to use.

1. In elevenlabs.io, open the text-to-speech page.
2. Select the **Eleven v4** model and the voice that Claude names.
3. Set the voice settings to the values Claude gives you.
4. Paste the whole script for one cut into the text box, in one piece.
5. Generate three or four versions, and download the one you like best as an MP3 file.
6. Tell Claude where the file is, for example:

   ```text
   The take for the hero cut is in ~/Downloads/hero-take.mp3
   ```

7. Repeat steps 4–6 for each cut.

For more detail, see [Create the voiceover](how-to/create-the-voiceover.md).

## Step 5: Approve the final videos

Claude times each video to your recording, renders it in full quality, and checks it. Then it sends you the videos with a short summary.

1. Watch each video with the sound on.
2. Reply with any changes, or reply that you approve.

## What success looks like

When you approve, you have:

- an MP4 file for each cut, saved in the `out` folder of the video project, for example `marketing/promo-video/out/acme-hero.mp4`;
- a storyboard image for each cut;
- an updated `brief.md` file that records what was made.

Claude then offers to save the project. For details, see [Continue or save a project](how-to/continue-or-save-a-project.md).

## Next steps

- [Change a finished video](how-to/change-a-video.md), for example to shorten it or use a new voice.
- [Add screenshots, footage, or music](how-to/add-screenshots-footage-music.md).
- If something goes wrong, see [Troubleshooting](troubleshooting.md).
