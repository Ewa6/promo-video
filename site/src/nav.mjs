// Site navigation and settings. Page paths are relative to ../docs.
// To add a page: put the .md file in docs/ and list it in one of the sections below.

export const SITE = {
  name: 'Promo video skill',
  repo: 'https://github.com/Ewa6/promo-video',
  editBase: 'https://github.com/Ewa6/promo-video/blob/main/docs/',
  author: 'Ewa Jabłońska',
  portfolio: 'https://www.technical-writing.net',
  // Docs files that are deliberately not published.
  exclude: ['documentation-plan.md'],
};

export const NAV = [
  {
    title: 'Start here',
    pages: ['overview.md', 'prerequisites.md', 'getting-started.md', 'quick-start.md'],
  },
  {
    title: 'Make and change videos',
    pages: [
      'how-it-works.md',
      'how-to/prepare-for-your-video.md',
      'how-to/review-the-storyboard.md',
      'how-to/create-the-voiceover.md',
      'how-to/review-the-final-videos.md',
      'how-to/change-a-video.md',
      'how-to/add-screenshots-footage-music.md',
      'how-to/continue-or-save-a-project.md',
    ],
  },
  {
    title: 'Get help',
    pages: ['troubleshooting.md', 'faq.md', 'glossary.md'],
  },
];

// The stages from "How a promo video gets made", shown on the home page.
// `you: true` marks the two approval points.
export const PIPELINE = [
  { label: 'Interview' },
  { label: 'Research' },
  { label: 'Set up' },
  { label: 'Storyboard', you: true, link: 'how-to/review-the-storyboard.html' },
  { label: 'Voiceover', link: 'how-to/create-the-voiceover.html' },
  { label: 'Final videos', you: true, link: 'how-to/review-the-final-videos.html' },
  { label: 'Wrap up' },
];
