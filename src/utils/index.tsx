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

function isSameMethod(method: string, configMethod: string) {
  return method?.toLowerCase() === configMethod?.toLowerCase()
}

function isMatch(config: ConfigModel, url: string, method: string) {
  const { [ColumnKeyEnum.METHOD]: configMethod, [ColumnKeyEnum.PATH]: configPath } = config || {}
  if (configMethod) {
    return isSameMethod(method, configMethod) && urlMatch(url, configPath)
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

    _method: string = ''

    constructor() {
      super()

      // console.log(this.onreadystatechange)

      this.addEventListener('readystatechange', () => {
        // 1. 检测是否需要拦截
        const { [GLOBAL_SWITCH_KEY]: globalSwitch, [CACHE_CONFIG_KEY]: configs } = store

        if (!globalSwitch || !configs?.length) {
          return
        }

        const config = configs.find((c) => isMatch(c, this.responseURL, this._method))
        console.log(chrome)

        // 存在匹配路径，并且是打开状态
        if (config && config[ColumnKeyEnum.OPEN]) {
          console.log('需要拦截')
          this.status = 200
          this.statusText = 'DONE'
          this.readyState = 4
          this.responseText =
            config[ColumnKeyEnum.MODE] === ColumnKeyEnum.MODEL
              ? config[ColumnKeyEnum.MODEL]
              : config[ColumnKeyEnum.RESPONSE]
        }
      })
    }

    open = (
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null,
    ): void => {
      this._method = method
      super.open(method, url, async ?? true, username, password)
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
    let _method = (init?.method || 'GET').toString()
    if (typeof input === 'string') {
      url = input
    } else if (input instanceof Request) {
      url = input.url
    } else if (input instanceof URL) {
      url = input.href
    }

    return OriginFetch(input, init).then((res) => {
      return new Promise((resolve) => {
        const { [GLOBAL_SWITCH_KEY]: globalSwitch, [CACHE_CONFIG_KEY]: configs } = store

        if (!globalSwitch || !configs?.length) {
          resolve(res)
          return
        }

        const config = configs.find((c) => isMatch(c, url, _method))
        // console.log(config)

        if (config && config[ColumnKeyEnum.OPEN]) {
          const result =
            config[ColumnKeyEnum.MODE] === ColumnKeyEnum.MODEL
              ? config[ColumnKeyEnum.MODEL]
              : config[ColumnKeyEnum.RESPONSE]
          resolve(new Response(result))
        } else {
          resolve(res)
        }
      })
    })
  }
}
