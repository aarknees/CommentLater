# CommentLater

A Chrome extension to fix your attention span that hides YouTube comments until you've finished the video.

Instead of the comments, you see a banner: **"hey hey go back to watching the video first"**, along with how much (%) of the video you've watched so far.

<!-- Add a screenshot of the banner here: drag the image into this file while editing on GitHub -->
![CommentLater banner](screenshot.png)

## How it works

1. On any YouTube watch page, the comment section is hidden and replaced with the banner.
2. While the video plays, the extension records every second you genuinely watch.
3. Skipping ahead doesn't count. Any jump of more than 3 seconds is ignored, so dragging to the end won't unlock anything.
4. Once you've watched 95% of the video, the comments appear.

Other details:

- Rewatching a part doesn't count twice.
- Ads are ignored, so they don't count toward your progress.
- Livestreams unlock immediately, since they have no end.
- Progress resets for each new video.

## Install

CommentLater isn't on the Chrome Web Store so it needs to be manually loaded in:

1. Click **Code > Download ZIP** on this page and unzip it.
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the unzipped folder.
5. Open any YouTube video.

## Settings

Open `content.js` ,edit the values at the top:

| Setting | Default | What it does |
|---|---|---|
| `REQUIRED_FRACTION` | `0.95` | Share of the video you must watch to unlock comments |
| `MAX_STEP` | `3` | Largest jump (in seconds) that still counts as normal playback |

To change the banner colors, edit `styles.css`. Reload the extension on `chrome://extensions` after any change.

## Project structure

```
CommentLater/
├── manifest.json   # extension settings (Manifest V3)
├── content.js      # tracks watched time, shows/hides comments
├── styles.css      # hides comments, styles the banner
└── icons/          # 16, 48 and 128 px icons
```

## limitations

- YouTube sometimes renames its page elements. If the comments stop hiding, the selector `ytd-comments#comments` in `styles.css` and `content.js` may need updating.
- Playing a video in a background tab can make progress tracking less precise.
- This is a self-control tool, not a lock. Turning off the extension removes it.

## Built with

JavaScript, CSS, and a Chrome extension manifest (no frameworks or dependencies).

## Credits

Icon artwork: taken from Internet Archive (creative common) Edmund Dulac’s Fairy-Book: Fairy Tales of the Allied Nations
New York: G. H. Doran Company [1916]

## License

MIT. See [LICENSE](LICENSE).
