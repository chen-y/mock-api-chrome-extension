console.log('background is running')

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
})

// console.info(chrome.runtime.getURL('src/contentScript/setup.ts'))
// chrome.userScripts.register({
//   js: [{
//     file: chrome.runtime.getURL('src/contentScript/setup.ts'),
//   }],
//   matches: ['<all_urls>'],
//   runAt: 'document_start',
//   world: 'MAIN',
// })

// chrome.userScripts.register([{
//   id: 'test',
//   matches: ['*://*/*'],
//   js: [
//     { code: 'alert(111);window.xxx = 1111;'  },
//     { file: chrome.runtime.getURL('src/contentScript/setup.ts')}
//   ],
//   world: chrome.userScripts.ExecutionWorld.MAIN
// }]);

// chrome.tabs.getCurrent().then((tab) => {
//   console.info(tab, 'tttt')
//   chrome.scripting.executeScript({
//     target: { tabId: tab?.id! },
//     func: function () {
//       document.body.style.backgroundColor = 'red'
//     },
//   })
// })
