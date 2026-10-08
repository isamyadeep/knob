# Privacy Policy

**Knob – Light Mode for YouTube Music** — last updated 8 October 2026.

## Summary

This extension does not collect, transmit, sell, or share any personal data. It makes zero network requests of any kind.

## What the extension stores

The extension stores exactly one piece of data: **your selected theme mode** (`light`, `system`, or `off`).

There are no user identifiers, browsing habits, listening activity, analytics, or telemetry of any kind.

## Where it's stored

Your preference is saved using the WebExtension storage API (`chrome.storage.sync` / `browser.storage.sync`). This means:

- It is stored locally within your browser profile.
- If you are signed in to your browser account (Chrome, Firefox, or Edge), your browser vendor may synchronize this setting across your logged-in devices as part of standard profile sync.

The extension also mirrors this single setting value to local storage under `__knob`. This ensures pre-paint theme execution to eliminate dark mode flashing when opening YouTube Music.

## What the extension does not do

- It does not collect personal information.
- It does not read, access, or log browsing history.
- It does not make remote server requests or send data anywhere.
- It contains no advertisements, tracking scripts, or third-party code.
- It executes no external code; all assets ship statically within the extension package.

## Permissions, and why each is needed

| Permission | Purpose |
|---|---|
| `storage` | Saves your selected mode (`On`, `System`, or `Off`). |
| Access to `music.youtube.com` | Required to apply the light theme to YouTube Music pages. |

The extension requests no other permissions and accesses no page content beyond theme attributes and styling.

## Contact

For questions, issues, or feedback, please open an issue on the project's GitHub repository.

---

*Disclaimer: Not affiliated with, endorsed by, or connected to Google LLC or YouTube.*
