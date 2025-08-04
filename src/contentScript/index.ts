// import { initialProxy } from './setup';
console.info('contentScript is run')
import {
  CONTENT_PORT_NAME,
  CACHE_CONFIG_KEY,
  GLOBAL_SWITCH_KEY,
  DATA_TO_SETUP,
  UPDATE_CONFIG_NAME,
} from '../constants/constants'
// import mockjs from 'mockjs'

function setup() {
  const script = document.createElement('script')
  script.setAttribute('type', 'module')
  script.setAttribute('src', chrome.runtime.getURL('src/setup.js'))
  document.documentElement.insertBefore(script, document.head)
}

setup()

function updateConfig() {
  chrome.storage.sync.get([CACHE_CONFIG_KEY, GLOBAL_SWITCH_KEY]).then((values) => {
    window.postMessage({
      type: DATA_TO_SETUP,
      data: values,
    })
  })
}

const port = chrome.runtime.connect({ name: CONTENT_PORT_NAME })
port.onMessage.addListener((message) => {
  if (message?.type === UPDATE_CONFIG_NAME) {
    updateConfig()
  }
  console.log(message, 'content js')
})

setTimeout(() => {
  // window.postMessage('aaaa')
  updateConfig()
}, 30)
