# Continue or save a project

A video project lives inside your product's folder, so you can stop at any stage and come back later. This page explains how to pick up where you left off, where your files are, and how to save the project.

## Continue a project

Use this when you stopped partway through, or when you come back later to change a finished video.

1. Open Claude Code in the same product folder you used before.
2. Ask Claude to continue, for example:

   ```text
   Let's continue the promo video.
   ```

Claude finds the project, reads the status checklist in `brief.md`, and continues from the next unfinished stage. If you ask for a specific change instead, Claude goes straight to the stage that change needs.

**Result:** Claude tells you which stage it's on and what it needs from you.

## Find your files

The project folder is `marketing/promo-video` inside your product's folder, unless you chose another place in the interview.

| What | Where in the project folder |
|---|---|
| Finished videos | `out`, for example `out/acme-hero.mp4` |
| Draft videos | `out`, with `.draft` in the name, for example `out/acme-hero.draft.mp4` |
| Storyboard images and check reports | `.qa`, one folder for each cut |
| Your imported voice takes | `public/voiceover` |
| Your answers and project status | `brief.md` |
| What Claude learned about your product | `research.md` |

The `.qa` folder name starts with a period, so some file browsers hide it. On a Mac, press **Command+Shift+Period** in Finder to show hidden folders.

## Save the project

When the videos are approved, Claude offers to save the project in your product's version history (a *commit*) on a separate branch. Claude never saves or shares your project without asking.

1. When Claude offers, reply that you want to save the project, or that you don't.
2. If you work with a team, share the branch with them the way your team usually does, or ask Claude for help.

Saving keeps the script, scenes, settings, and your voice takes, so anyone with the project can render the same videos again. The finished videos and check reports in `out` and `.qa` aren't saved, because Claude can recreate them. Keep a copy of any video you publish.

## Related topics

- [Change a finished video](change-a-video.md)
- [Where are my videos saved?](../faq.md#where-are-my-videos-saved)
