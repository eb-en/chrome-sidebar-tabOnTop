const NO_GROUP_ID = chrome.tabGroups.TAB_GROUP_ID_NONE;
const SPLIT_VIEW_ID_NONE = chrome.tabs.SPLIT_VIEW_ID_NONE;
const DELAY_MS = 150;

chrome.tabs.onCreated.addListener((tab) => {
  // Ignore pinned tabs, tabs inside a group, or tabs without a valid ID
  if (!tab || tab.pinned || !tab.id || tab.groupId !== NO_GROUP_ID) {
    return;
  }

  // Ignore tabs that are part of a Chrome Split View
  if (tab.splitViewId != null && tab.splitViewId !== SPLIT_VIEW_ID_NONE) {
    return;
  }

  // Defer the move so Chrome can finish assigning split-view state before we act
  setTimeout(() => {
    chrome.tabs.get(tab.id, (currentTab) => {
      if (chrome.runtime.lastError || !currentTab) {
        return; // Tab was closed
      }

      // Re-check state: tab may have been pinned, grouped, or split since creation
      if (currentTab.pinned || currentTab.groupId !== NO_GROUP_ID) {
        return;
      }
      if (currentTab.splitViewId != null && currentTab.splitViewId !== SPLIT_VIEW_ID_NONE) {
        return;
      }

      // Query all tabs in the current window to find the pinned tabs boundary
      chrome.tabs.query({ windowId: currentTab.windowId }, (allTabs) => {
        if (chrome.runtime.lastError || !allTabs) {
          return;
        }

        // Find the last pinned tab index (pinned tabs sit at the very top, indices 0..N)
        let lastPinnedIndex = -1;
        for (const t of allTabs) {
          if (t.pinned) {
            lastPinnedIndex = t.index;
          } else {
            break;
          }
        }

        const targetIndex = lastPinnedIndex + 1;

        // Move tab to index 0 (or immediately after pinned tabs)
        if (currentTab.index !== targetIndex) {
          chrome.tabs.move(currentTab.id, { index: targetIndex }, () => {
            if (chrome.runtime.lastError) {
              // Ignore errors if tab was closed before move completed
            }
          });
        }
      });
    });
  }, DELAY_MS);
});