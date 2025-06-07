console.log('background is running')

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
})

chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create({
    width: 500,
    height: 300,
    url: 'newtab.html',
    type: 'panel',
  })
})
