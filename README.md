# New Tab at Top

A minimal Chrome extension that opens new tabs at the **top** of the tab list, right below your tab groups and pinned tabs — just like Arc Browser.

No UI, no settings, no popups. Install it, turn it on, and forget about it.

## Features

- **New tabs open at the top** of the tab strip, right after any pinned tabs and tab groups.
- **Tab groups stay at the top** — all your grouped tabs remain pinned at the top of the list, exactly where you left them.
- **Respects Chrome's native features** — pinned tabs, tab groups, context menus, and all other default Chrome behaviors work exactly as they always do.
- **Zero UI** — nothing to configure. Once enabled, it just works.

## How it works

The extension uses a Manifest V3 background service worker that listens for the `chrome.tabs.onCreated` event. When a new tab is created:

1. If the new tab is pinned or was created directly inside a tab group, it is left untouched.
2. Otherwise, the extension finds the last tab index that is pinned or grouped.
3. The new tab is moved to the position directly below all pinned and grouped tabs (the top of the ungrouped section).

## Installation

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select this project folder (`Tab Reorder`).
5. Done — the extension is now active.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension manifest (Manifest V3). Declares permissions and the background service worker. |
| `background.js` | Background service worker. Listens for new tabs and reorders them to the top. |
| `icons/` | Extension icons (`16px`, `48px`, `128px`). |

## Permissions

The extension requests two permissions:

- **`tabs`** — required to read tab properties (pin state, group membership) and move tabs.
- **`tabGroups`** — required to detect whether a tab belongs to a tab group.

## License

MIT
