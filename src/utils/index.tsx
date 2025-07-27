import {
  CACHE_CONFIG_KEY,
  ConfigModel,
  GLOBAL_SWITCH_KEY,
  ColumnKeyEnum,
} from '../constants/constants'

export {
  DATA_TO_SETUP,
  type ConfigModel,
  CACHE_CONFIG_KEY,
  GLOBAL_SWITCH_KEY,
} from '../constants/constants'

// import mockjs from 'mockjs'
// require('mockjs')
// console.log(mockjs)

export interface IData {
  global_switch: boolean
  mc_dataset: ConfigModel[]
}

const initState: IData = {
  global_switch: false,
  mc_dataset: [],
}

let store: IData = initState

export function getUniqueId() {
  const s1 = Math.random().toString(36).substring(2)
  const now = Date.now()
  return `${now}${s1}`
}

function urlMatch(url: string, matchStr: string) {
  return url.includes(matchStr)
}

export function setupXMLRequestProxy(d?: IData) {
  console.info('start proxy')
  if (d) {
    store = d
  } else {
    d = initState
  }

  const OriginXML = window.XMLHttpRequest

  class CustomHttp extends OriginXML {
    status: number = 0
    statusText: string = 'UNSENT'
    readyState: number = 0
    responseText: string = ''

    constructor() {
      super()

      // console.log(this.onreadystatechange)

      this.addEventListener('readystatechange', () => {
        // 1. 检测是否需要拦截
        const { [GLOBAL_SWITCH_KEY]: globalSwitch, [CACHE_CONFIG_KEY]: configs } = store
        if (!globalSwitch || !configs?.length) {
          return
        }

        const config = configs.find((c) => urlMatch(this.responseURL, c[ColumnKeyEnum.PATH]))

        // 存在匹配路径，并且是打开状态
        if (config && config[ColumnKeyEnum.OPEN]) {
          console.log('需要拦截')
          // this.responseText = config[ColumnKeyEnum.MODE] === ColumnKeyEnum.MODEL ?
          // if (config[ColumnKeyEnum.MODE] === ColumnKeyEnum.MODEL) {
          //   this.responseText = mock.mock(JSON.stringify(config[ColumnKeyEnum.MODEL]))
          //   console.log(this.responseText)
          // }
          this.status = 200
          this.statusText = 'DONE'
          this.readyState = 4
        }
        console.log('proxy change')
      })
    }
  }

  globalThis.XMLHttpRequest = CustomHttp
}
