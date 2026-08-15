# AGENTS.md - AI Agent & Developer Workspace Guide

## Overview

**New Tab at Top** (Repository: `Tab Reorder`) is a lightweight Chrome Extension (Manifest V3) that mimics Arc Browser's top tab behavior. When a user opens a new unpinned, ungrouped tab, the extension automatically places it at the very top of the tab strip (index 0, immediately after any pinned tabs).

- **Manifest Version**: V3
- **Current Version**: 1.0.0
- **UI Footprint**: Zero UI (no popups, options pages, or side panels)
- **Primary Mechanism**: Background Service Worker listening to tab lifecycle events

---

## Current Project Status

- **Status**: Stable / Feature Complete (v1.0.0)
- **Branch**: `master` (Clean working tree)
- **Key Capabilities**:
  - Intercepts `chrome.tabs.onCreated` events.
  - Safely ignores pinned tabs and tabs created directly inside tab groups.
  - Automatically moves new tabs to index 0 (or immediately after pinned tabs).
  - Handles tab lifecycle edge cases (e.g., tabs closed during execution using `chrome.runtime.lastError`).

---

## Technical Deep-Dive: `background.js`

The entire extension runtime logic is encapsulated within [background.js](file:///Users/eb_e__n/Projects/Chrome%20Extensions/Tab%20Reorder/background.js).

### Execution Flow

```javascript
const NO_GROUP_ID = chrome.tabGroups.TAB_GROUP_ID_NONE;

chrome.tabs.onCreated.addListener((tab) => {
  if (!tab || tab.pinned || !tab.id || tab.groupId !== NO_GROUP_ID) {
    return;
  }

  chrome.tabs.query({ windowId: tab.windowId }, (allTabs) => {
    if (chrome.runtime.lastError || !allTabs) return;

    let lastPinnedIndex = -1;
    for (const t of allTabs) {
      if (t.pinned) lastPinnedIndex = t.index;
      else break;
    }

    const targetIndex = lastPinnedIndex + 1;

    if (tab.index !== targetIndex) {
      chrome.tabs.move(tab.id, { index: targetIndex }, () => {
        if (chrome.runtime.lastError) {}
      });
    }
  });
});
```

---

## File Structure Map

| File Path | Description |
| :--- | :--- |
| [manifest.json](file:///Users/eb_e__n/Projects/Chrome%20Extensions/Tab%20Reorder/manifest.json) | Declares Manifest V3 configuration, background service worker (`background.js`), icons, and permissions (`tabs`, `tabGroups`). |
| [background.js](file:///Users/eb_e__n/Projects/Chrome%20Extensions/Tab%20Reorder/background.js) | Service worker script containing tab lifecycle listener and reordering logic. |
| [README.md](file:///Users/eb_e__n/Projects/Chrome%20Extensions/Tab%20Reorder/README.md) | User documentation detailing installation, functionality, and permissions. |
| [LICENSE](file:///Users/eb_e__n/Projects/Chrome%20Extensions/Tab%20Reorder/LICENSE) | MIT License file. |
| [icons/](file:///Users/eb_e__n/Projects/Chrome%20Extensions/Tab%20Reorder/icons) | Extension icons (`icon16.png`, `icon48.png`, `icon128.png`). |

---

## Guidelines for AI Agents & Developers

1. **Service Worker Lifetime**:
   - MV3 background workers are ephemeral. Always query Chrome APIs (`chrome.tabs.query`) for real-time window state.

2. **Permissions**:
   - The extension relies on `tabs` and `tabGroups` in [manifest.json](file:///Users/eb_e__n/Projects/Chrome%20Extensions/Tab%20Reorder/manifest.json).

3. **Manual Verification Procedure**:
   - Open `chrome://extensions` in Google Chrome.
   - Click **Reload** on **New Tab at Top**.
   - Press `Cmd+T` (`Ctrl+T`) to open a new tab.
   - Verify the tab appears at index 0 (immediately after pinned tabs, above tab groups and unpinned tabs).
