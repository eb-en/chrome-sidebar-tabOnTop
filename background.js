const NO_GROUP_ID = chrome.tabGroups.TAB_GROUP_ID_NONE;

chrome.tabs.onCreated.addListener((tab) => {
  // Ignore pinned tabs, tabs inside a group, or tabs without a valid ID
  if (!tab || tab.pinned || !tab.id || tab.groupId !== NO_GROUP_ID) {
    return;
  }

  // Query all tabs in the current window to find the pinned tabs boundary
  chrome.tabs.query({ windowId: tab.windowId }, (allTabs) => {
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
    if (tab.index !== targetIndex) {
      chrome.tabs.move(tab.id, { index: targetIndex }, () => {
        if (chrome.runtime.lastError) {
          // Ignore errors if tab was closed before move completed
        }
      });
    }
  });
});
