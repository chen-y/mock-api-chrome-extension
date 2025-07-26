// import { initialProxy } from './setup';
console.info('contentScript is run')
import { CONTENT_PORT_NAME } from '../constants/constants'

function setup() {
  const script = document.createElement('script')
  script.setAttribute('type', 'module')
  script.setAttribute('src', chrome.runtime.getURL('src/setup.js'))
  document.documentElement.insertBefore(script, document.head)
}

setup()

const port = chrome.runtime.connect({ name: CONTENT_PORT_NAME })
port.onMessage.addListener((message) => {
  console.log(message, 'content js')
})

// setTimeout(() => {
//   window.postMessage('aaaa')
// }, 5000)
