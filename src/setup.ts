import { setupXMLRequestProxy } from './utils'

const prefix = '[setup]: '
console.info(prefix, 'start')
console.info(prefix, 'end')

function initialProxy() {
  console.log('initial')

  setupXMLRequestProxy()
  // @ts-ignore
  window.XMLHttpRequest = 123
}

initialProxy()

export default () => {}

console.log(prefix, 'end')
