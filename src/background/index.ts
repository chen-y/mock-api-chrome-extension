console.log('background is running')

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
})

chrome.action.onClicked.addListener((tab) => {
  console.info(tab)
  // chrome.action.setBadgeBackgroundColor({
  //   details: {
  //     color: 'red'
  //   }
  // })
  // chrome.tabs.create({})
  // window.open("newtab.html", "_blank")
  // chrome.tabs.create({
  //   url: 'newtab.html',
  //   pinned: true,
  // })
  chrome.windows.create({
    width: 500,
    height: 300,
    url: 'newtab.html',
    type: 'panel'
  })
});