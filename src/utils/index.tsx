export function getUniqueId() {
  const s1 = Math.random().toString(36).substring(2)
  const now = Date.now()
  return `${now}${s1}`
}

export function setupXMLRequestProxy(w) {
  const OriginXML = window.XMLHttpRequest

  class CustomHttp extends OriginXML {
    status: number = 0
    statusText: string = 'UNSENT'
    readyState: number = 0
    responseText: string = ''

    aaa = 123

    constructor() {
      super()

      console.log(this)

      // this.addEventListener('readystatechange', () => {

      // });
    }
  }

  // globalThis.XMLHttpRequest = CustomHttp
  // Object.defineProperty(window, 'XMLHttpRequest', {
  //   value: CustomHttp,
  // })
  window.XMLHttpRequest = CustomHttp
}
