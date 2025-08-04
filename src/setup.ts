import {
  setupXMLRequestProxy,
  setFetchProxy,
  DATA_TO_SETUP,
  ConfigModel,
  IData,
  // CACHE_CONFIG_KEY,
  // GLOBAL_SWITCH_KEY,
} from './utils'
// import { DATA_TO_SETUP } from './constants/constants'
// import mockjs from 'mockjs'

// console.log(mockjs)

function initialProxy(d?: IData) {
  // console.log('initial')

  setupXMLRequestProxy(d)
  setFetchProxy()
}

initialProxy()

window.addEventListener('message', (event) => {
  // console.log(event.data, 'setup js')
  const { data } = event

  if (data?.type === DATA_TO_SETUP) {
    const iData = data?.data as IData
    // console.log('idata', iData)
    initialProxy(iData)
  }
})

export default () => {}
