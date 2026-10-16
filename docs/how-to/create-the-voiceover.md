# Create the voiceover

After you approve the storyboard, each cut needs a voice recording, called a *take*. ElevenLabs generates the takes. There are two ways to do it:

| Route | How it works | When it's available |
|---|---|---|
| Through a connector | Claude generates the takes for you, using an ElevenLabs tool connected to Claude. | Only when your Claude session has an ElevenLabs connector. |
| By hand | You paste the script into elevenlabs.io, generate the takes, and send Claude the files. | Always. |

Claude checks for a connector during the interview. If it finds one, it asks which route you want. If not, you use the by-hand route.

You never need to give Claude an ElevenLabs API key.

## Before you begin

- You've approved the storyboard. For details, see [Review and approve the storyboard](review-the-storyboard.md).
- You can sign in to [elevenlabs.io](https://elevenlabs.io).

## Choose a voice

If you don't have a voice yet, Claude suggests one to look for, based on the tone you described. A warm, confident narrator is the default. In ElevenLabs, a Professional Voice Clone performs best with the Eleven v4 model.

To give Claude a voice you already use, find its voice ID in ElevenLabs: go to **Voices**, select **⋯** next to the voice, and then select **Copy voice ID**. Paste the ID into your reply to Claude.

## Generate the takes by hand

Repeat these steps for each cut that has its own recording. A vertical copy of a cut uses the same recording as the original, so it doesn't need its own take.

1. Copy the script that Claude gives you for the cut. It appears in a box, ready to paste.
2. In elevenlabs.io, open the text-to-speech page.
3. Select the **Eleven v4** model. Don't use a turbo model, because it ignores most voice directions.
4. Select the voice.
5. Set **Stability** and **Similarity** to the values Claude gives you. If Claude gives you a seed number, enter it too.
6. Paste the whole script for the cut into the text box. Generate it in one piece, not paragraph by paragraph, so the voice stays consistent.
7. Generate three or four takes. Each take sounds a little different.
8. Listen to each take. Avoid any take that reads a direction aloud, such as saying "warm, assured," or that mispronounces your product name.
9. Download your favorite take as an MP3 file. If you can't choose, download several and let Claude pick the one that best matches the script.
10. Tell Claude which cut the file is for and where it is, for example:

    ```text
    The take for the 30-second cut is in ~/Downloads/cut30-take2.mp3
    ```

## Generate the takes through a connector

1. Tell Claude which voice to use, or ask Claude to find one that matches your description.
2. Claude generates three or four takes for each cut and picks the best match, or plays them for you to choose.
3. If Claude can't save the audio as a file, it asks you to download the take you chose and tell it where the file is.

If the connector fails, Claude tells you and switches to the by-hand route.

## What happens next

For each take, Claude:

1. Copies the file into the project and adjusts its volume to a standard level for web and social video. Your original file isn't changed.
2. Listens to the take and matches each word to the script, so the pictures move in time with the voice.
3. Reports how well the take matches the script. Above 90% is normal. Below 80% usually means the take doesn't match the current script.

If a take doesn't match well, Claude tells you what to regenerate. For details, see [The voice take doesn't match the script](../troubleshooting.md#the-voice-take-doesnt-match-the-script).

## Next steps

- [Review and approve the final videos](review-the-final-videos.md)
- To record a new take later, see [Use a new voice take](change-a-video.md#use-a-new-voice-take).
