import { setupXMLRequestProxy } from './utils'

function initialProxy() {
  // console.log('initial')

  setupXMLRequestProxy()
}

initialProxy()

// window.addEventListener('message', (event) => {
//   console.log(event, 'setup js')
// })

export default () => {}
