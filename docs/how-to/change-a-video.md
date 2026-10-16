# Change a finished video

You can change a video at any time after it's made: new words, a new voice take, a different length, another format, or updated branding. You describe the change to Claude, and Claude picks up the project where it left off.

## Before you begin

- Open Claude Code in the same product folder you used to make the video. Claude finds the existing project and reads its notes. For details, see [Continue or save a project](continue-or-save-a-project.md).
- Know which change needs a new recording. Changing the spoken words means recording that cut again. Most other changes don't.

| Change | New voice recording needed? |
|---|---|
| Change what the voice says | Yes, for each cut whose words change |
| Use a new take of the same words | Yes, that's the change |
| Give a scene more time | No |
| Change on-screen text, pictures, or colors | No |
| Add a vertical or square copy of an existing cut | No |
| Turn captions on or off | No |
| Add a new cut with new words | Yes, for the new cut |

## Change the words

Use this when the message, a claim, or the call to action changes.

1. Tell Claude what to change, for example:

   ```text
   In the 30-second cut, say "Book a demo today" instead of "Get started."
   ```

2. Review and approve the updated script and storyboard. For details, see [Review and approve the storyboard](review-the-storyboard.md).
3. Record a new take of each changed cut. For details, see [Create the voiceover](create-the-voiceover.md).
4. Review and approve the new videos.

**Result:** The cut uses the new words, in time with the new recording.

## Use a new voice take

Use this when you want a different read of the same script, or a different voice.

1. Tell Claude, for example, "I want a new voice take for the hero cut."
2. Ask Claude for the script and voice settings for that cut, if you don't still have them.
3. Generate the take and send Claude the file. For details, see [Generate the takes by hand](create-the-voiceover.md#generate-the-takes-by-hand).

**Result:** Claude re-times the video to the new take and renders it again.

> [!TIP]
> When you like a take, ask Claude to record its seed number in the project. Using the same seed later helps a regenerated take sound like the original.

## Make a cut shorter, longer, or punchier

1. Tell Claude what you want, for example, "Make the 30-second cut punchier" or "Make the hero video about 60 seconds."
2. Claude rewrites the script to fit. As a guide, a 15-second cut has about 28–35 words, and a 30-second cut about 60–75 words.
3. Approve the new storyboard, and then record a new take.

**Result:** The cut fits the new length.

## Give a scene more time

Use this when a scene's animation is cut off before it finishes, or a beat feels rushed.

1. Tell Claude which scene feels rushed, for example, "The dashboard scene ends before the chart finishes."
2. Claude adds a short silence to the voice at that point. The recording stays the same.

**Result:** The scene stays on screen until its animation finishes. You don't need a new take.

## Add a vertical or square version

1. Tell Claude which cut you want in another shape, for example, "Make a vertical version of the 15-second cut."
2. Claude adds the new cut. It reuses the original cut's recording.

**Result:** You get a vertical (1080 × 1920 pixels) or square (1080 × 1080 pixels) video with the same voice.

## Turn captions on or off

1. Tell Claude which cut and whether you want captions on or off.

**Result:** Claude renders the cut again. Captions appear word by word, burned into the video.

If your product name shows up spelled wrong in the captions, see [The product name is spelled wrong in the captions](../troubleshooting.md#the-product-name-is-spelled-wrong-in-the-captions).

## Change the brand

Use this to change colors, the logo, the font, the website address, or the call to action.

1. Tell Claude what to change. Give colors as six-digit hex codes, such as `#1b2430`. For a new logo, tell Claude where the file is.
2. Review the updated videos.

**Result:** Every cut uses the new branding. You don't need a new take unless the voice says the changed text, such as a new website address.

## Related topics

- [Add screenshots, footage, or music](add-screenshots-footage-music.md)
- [Troubleshooting](../troubleshooting.md)
