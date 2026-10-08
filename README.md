# Knob – Light Mode for YouTube Music

A minimal browser extension that adds a clean, custom **light theme** to YouTube Music.

YouTube Music’s native *Appearance* setting only offers *Dark*. **Knob** introduces a dedicated tactile control to switch between **On**, **System**, and **Off**.

No account needed, no tracking, no network requests, and zero analytics.

Works on **Microsoft Edge**, **Firefox**, and **Google Chrome**.

---

## Preview

| Dark Mode (Off) | Light Mode (On) |
| :---: | :---: |
| [Dark Mode]<img width="1920" height="1200" alt="image_75" src="https://github.com/user-attachments/assets/33c4bc1f-4513-481f-a8f2-1cc7374594c9" /> | [Light Mode]<img width="1920" height="1200" alt="image_76" src="https://github.com/user-attachments/assets/aca8ee1e-af63-429a-9d6b-13b6a3a91c39" />

---

## Installation

### Microsoft Edge
Install directly from the **Edge Add-ons Store** *(link coming soon upon publication)*.

---

### Firefox
Install directly from the **Firefox Add-ons Marketplace** *(link coming soon upon publication)*.

---

### Google Chrome (Manual / Developer Mode)

Chrome users can install manually from a downloadable `.zip` or cloned repository:

1. Download the latest `knob-<version>.zip` from the [Releases page](https://github.com/isamyadeep/knob/releases), or clone this repository.
2. Unzip the archive into a permanent directory on your computer (e.g., `~/knob-extension`).
3. Open `chrome://extensions` in the address bar.
4. Enable **Developer mode** using the toggle switch in the top-right corner.
5. Click **Load unpacked**.
6. Select the folder containing `manifest.json`.
7. Pin **Knob** to your toolbar, navigate to [music.youtube.com](https://music.youtube.com), and click the knob icon to switch modes.

---

## Usage

Click the extension icon in your toolbar to interact with the 3-position rotary knob:

| Mode | Behavior |
|---|---|
| **On** | Forces light mode continuously, regardless of system theme settings. |
| **System** | Dynamically follows your system preferences — native dark mode when your OS is dark, and light mode when your OS is light. |
| **Off** | Disables the extension completely. YouTube Music returns to its default behavior (Dark mode). |

* Click the dial to advance sequentially (**On → System → Off → On**).
* Use arrow keys on keyboard focus to navigate directly between modes.
* Changes apply instantly across active YouTube Music tabs without requiring a page reload.

---

## How It Works

YouTube Music relies internally on `dark` / `light` boolean attributes on the `<html>` element. **Knob** toggles these native attributes while applying subtle CSS palette adjustments to replace harsh near-black/white contrast with soft neutral grays.

Key mechanisms ensuring stability:
- **Pre-render CSS Injection:** Declared in the manifest to eliminate dark mode flashing on page load.
- **Mutation Guard:** A `MutationObserver` continuously watches the `<html>` element to re-assert your preferred theme if YouTube Music attempts to overwrite it dynamically.
- **Fail-Soft Self-Check:** Automatically measures rendered background luminance and applies safe fallback styles if YouTube alters internal component selectors.

---

## When it breaks

YouTube Music changes its internal markup and styles frequently. When that happens, some surfaces — a menu, the queue panel, or a settings dialog — can revert to dark while the rest of the page stays light. 

If you notice an unstyled surface, please [open an issue](../../issues/new) describing where on the page it occurs. I built this extension because another light mode extension I had been using stopped working for a few days, so I will try to fix layout breaks as quickly as possible.

---

## Project Structure

```text
├── manifest.json         # WebExtension Manifest (MV3)
├── content/theme.js      # Theme script (Attribute switcher, observer, self-check)
├── content/theme.css     # Palette, light mode overrides, and fallback rules
├── popup/popup.html      # Extension popup markup
├── popup/popup.css       # Rotary knob styling and animations
├── popup/popup.js        # Knob interaction logic and storage syncing
└── icons/                # Icons used for the extension
```

---

## Privacy Policy

**Knob – Light Mode for YouTube Music** is designed with strict privacy principles:

* **Zero Data Collection:** The extension does not collect, track, or share any personal user details, browsing activity, or listening history.
* **Offline Execution:** All functionality runs locally inside your browser. No remote scripts, external API calls, background telemetry, or analytics trackers are used.
* **Local Storage:** Your active theme preference (`light`, `system`, or `off`) is stored locally using standard browser storage APIs (`chrome.storage.sync` / `browser.storage.sync`) strictly to synchronize settings across your sessions.

---

## License

### GNU General Public License v3.0 (GPL-3.0)

This program is free software: you are free to redistribute and modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement.

Refer to the full text of the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html) for detailed terms.

---

*Crafted with assistance from [Claude Code](https://claude.ai).*

Inspired by **Dieter Rams'** design principles and the 3-way knob created by [1042 Studio](https://www.1042.studio/) at [drams.framer.website](https://drams.framer.website/).

*Disclaimer: Not affiliated with, endorsed by, or connected to Google LLC or YouTube.*
