import {
  CACHE_CONFIG_KEY,
  ConfigModel,
  GLOBAL_SWITCH_KEY,
  ColumnKeyEnum,
  MethodEnum,
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

type XHROpen = XMLHttpRequest['open']

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

function isMatch(config: ConfigModel, url: string, method: string) {
  const { [ColumnKeyEnum.METHOD]: configMethod, [ColumnKeyEnum.PATH]: configPath } = config || {}
  if (configMethod) {
    return method === configMethod && urlMatch(url, configPath)
  }
  return urlMatch(url, configPath)
}

export function setupXMLRequestProxy(d?: IData) {
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

    method: string = ''

    constructor() {
      super()

      // console.log(this.onreadystatechange)

      this.addEventListener('readystatechange', () => {
        console.log(this.getResponseHeader('method'), 'this')

        // 1. 检测是否需要拦截
        const { [GLOBAL_SWITCH_KEY]: globalSwitch, [CACHE_CONFIG_KEY]: configs } = store

        if (!globalSwitch || !configs?.length) {
          return
        }

        const config = configs.find((c) => isMatch(c, this.responseURL, 'GET'))

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
          this.responseText =
            config[ColumnKeyEnum.MODE] === ColumnKeyEnum.MODEL
              ? config[ColumnKeyEnum.MODEL]
              : config[ColumnKeyEnum.RESPONSE]
        }
        console.log('proxy change')
      })
    }

    // 重写open方法以保存请求方法
    // ts-nocheck
    open = (
      method: string,
      url: string | URL,
      async: boolean,
      username?: string | null,
      password?: string | null,
    ) => {
      this.method = method
      super.open(method, url, async, username, password)
    }
  }

  // ts-nocheck
  globalThis.XMLHttpRequest = CustomHttp
}

export function setFetchProxy() {
  const OriginFetch = window.fetch

  window.fetch = function (input, init) {
    console.log(input)
    let url = ''
    let method = (init?.method || 'GET').toString()
    if (typeof input === 'string') {
      url = input
    } else if (input instanceof Request) {
      url = input.url
    } else if (input instanceof URL) {
      url = input.href
    }

    return new Promise((resolve) => {
      resolve(new Response('{}'))
    })
  }
}
