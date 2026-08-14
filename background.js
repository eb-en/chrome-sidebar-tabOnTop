const NO_GROUP_ID = chrome.tabGroups.TAB_GROUP_ID_NONE;

chrome.tabs.onCreated.addListener((tab) => {
  // Ignore pinned tabs, tabs inside a group, or tabs without a valid ID
  if (!tab || tab.pinned || !tab.id || tab.groupId !== NO_GROUP_ID) {
    return;
  }

  // Query all tabs in the current window to find the lowest boundary
  // below which all pinned and grouped tabs sit at the top
  chrome.tabs.query({ windowId: tab.windowId }, (allTabs) => {
    if (chrome.runtime.lastError) {
      return;
    }

    // Tabs are returned in index order; find the last pinned/grouped tab index
    let lastSectionedIndex = -1;
    for (const t of allTabs) {
      if (t.pinned || t.groupId !== NO_GROUP_ID) {
        lastSectionedIndex = t.index;
      }
    }

    const targetIndex = lastSectionedIndex + 1;

    // Move tab to the top of the ungrouped/unpinned section
    if (tab.index !== targetIndex) {
      chrome.tabs.move(tab.id, { index: targetIndex }, () => {
        if (chrome.runtime.lastError) {
          // Ignore errors if tab was closed before move completed
        }
      });
    }
  });
});
