console.log('background is running')
import { CONTENT_PORT_NAME, UPDATE_CONFIG_NAME } from '../constants/constants'
import mockjs from 'mockjs'

console.log(mockjs, globalThis)

mockjs.mock('/api/test', {
  name: '@cname',
  'age|18-60': 18,
})

let contentScriptPort: chrome.runtime.Port | null = null

// 点击插件icon 打开新的窗口
chrome.action.onClicked.addListener(() => {
  chrome.system.display.getInfo((infos) => {
    console.info(infos, 'info')
    const first = infos?.[0]
    const w = Math.max(800, first?.bounds?.width * 0.75)
    const h = Math.max(500, first?.bounds?.height * 0.75)
    chrome.windows.create({
      url: 'newtab.html',
      type: 'panel',
      width: parseInt(w.toString()),
      height: parseInt(h.toString()),
    })
  })
})

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }

  if (request.type === UPDATE_CONFIG_NAME) {
    console.log('update config')
    console.log(request)
  }
})

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === CONTENT_PORT_NAME) {
    contentScriptPort = port
  }
})

setTimeout(() => {
  console.log('port, message', contentScriptPort)
  contentScriptPort?.postMessage('aabbcc')
}, 5000)

// const p = chrome.runtime.connect({ name: 'aaaa' })
// p.onMessage.addListener(() => {
//   console.log('message log from service work')
// })
