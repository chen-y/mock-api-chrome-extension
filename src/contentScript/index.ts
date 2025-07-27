// import { initialProxy } from './setup';
console.info('contentScript is run')
import {
  CONTENT_PORT_NAME,
  CACHE_CONFIG_KEY,
  GLOBAL_SWITCH_KEY,
  DATA_TO_SETUP,
} from '../constants/constants'
import mockjs from 'mockjs'

console.log(mockjs)

// mockjs.mock('/api/test', {
//   code: 0,
//   data: {
//     id: '@id',
//   },
// })

function setup() {
  const script = document.createElement('script')
  script.setAttribute('type', 'module')
  script.setAttribute('src', chrome.runtime.getURL('src/setup.js'))
  document.documentElement.insertBefore(script, document.head)
}

setup()

console.log(chrome)

// window.postMessage(chrome.storage.sync.get([CACHE_CONFIG_KEY, GLOBAL_SWITCH_KEY]))

const port = chrome.runtime.connect({ name: CONTENT_PORT_NAME })
port.onMessage.addListener((message) => {
  console.log(message, 'content js')
})

setTimeout(() => {
  // window.postMessage('aaaa')
  chrome.storage.sync.get([CACHE_CONFIG_KEY, GLOBAL_SWITCH_KEY]).then((values) => {
    window.postMessage({
      type: DATA_TO_SETUP,
      data: values,
    })
  })
}, 30)
