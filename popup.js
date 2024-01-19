const tabs = await chrome.tabs.query({  // retrieve tabs from specific urls
    url: [
      "https://developer.chrome.com/docs/webstore/*",
      "https://developer.chrome.com/docs/extensions/*",
    ],
  });

const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));  // sorts tabs 

const template = document.getElementById("li_template");
const elements = new Set();
for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);

  const title = tab.title.split("-")[0].trim();
  const pathname = new URL(tab.url).pathname.slice("/docs".length);

  element.querySelector(".title").textContent = title;
  element.querySelector(".pathname").textContent = pathname;
  element.querySelector("a").addEventListener("click", async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true }); // focuses on the tab clicked
  });

  elements.add(element);
}
document.querySelector("ul").append(...elements);

const group_tabs = document.getElementById("group")
group_tabs.addEventListener("click", async () => {  // creates button to group tab and move them to current window
  const tabIds = tabs.map(({ id }) => id);  // returns arr of all tabs ids 
  if (tabIds.length) {  // if tabsId not empty
    const group = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(group, { title: "DOCS" });
  }
});

const ungroup_tabs = document.getElementById("ungroup")
// ungroup all
ungroup_tabs.addEventListener("click", async () => {  // creates button to group tab and move them to current window
    const tabIds = tabs.map(({ id }) => id);
    if (tabIds.length) {
        await chrome.tabs.ungroup(tabIds)
    }
  });

// TODO: ungroup just specified tab