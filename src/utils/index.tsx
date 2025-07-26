// import {} from '../constants/constants'
export function getUniqueId() {
  const s1 = Math.random().toString(36).substring(2)
  const now = Date.now()
  return `${now}${s1}`
}

function urlMatch(url: string, matchStr: string) {
  return url.includes(matchStr)
}

export function setupXMLRequestProxy() {
  console.info('start proxy')

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
        if (urlMatch(this.responseURL, '/api/test')) {
          console.log('需要拦截')
          this.responseText = 'abc'
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
