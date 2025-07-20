import fs from 'fs'

// ---cut-start---
/** @returns {import('rollup').Plugin} */
// ---cut-end---
export function manifestPlugin(manifest) {
  // console.info(manifest.web_accessible_resources)
  const names = ['src/setup.js']
  const injectScript = {
    matches: ['<all_urls>'],
    resources: names,
    use_dynamic_url: false,
  }
  let config
  return [
    {
      name: 'add-setup-plugin',
      apply: 'build',
      buildStart(a, b, c) {
        const refId = this.emitFile({
          type: 'chunk',
          id: 'src/setup.ts',
          fileName: 'src/setup.js',
        })
      },
    },
    {
      name: 'abc:plugin',
      // apply: 'serve',
      enforce: 'pre',
      // transform(a, b, c) {
      //   console.info(a, b, c)
      // },
      configureServer(server) {
        // console.log(server)
        return () => {
          server.middlewares.use((req, res, next) => {
            // console.log('server')
            const path = server.config.build.outDir + '/manifest.json'
            const m = fs.readFileSync(path)
            const mJson = JSON.parse(m.toString())
            // console.log(mJson.web_accessible_resources)
            const hasInject = mJson.web_accessible_resources.find(
              (item) => item.resources.join('') === names.join(''),
            )
            if (!hasInject) {
              mJson.web_accessible_resources.push(injectScript)
              fs.writeFile(path, JSON.stringify(mJson, null, 2), () => {
                console.log('setup inject successful')
              })
            }
            next()
          })
        }
      },
    },
    {
      name: 'modify-manifest-plugin',
      async writeBundle(options, bundles, isWrite) {
        // this hook just for build stage
        for (let key of Object.keys(bundles)) {
          console.info('key ===', key)
          if (key === 'manifest.json') {
            // console.info(bundles[key])
            const manifestJson = JSON.parse(bundles[key].source?.toString())
            // console.log(manifestJson, 'json')
            manifestJson.web_accessible_resources.push(injectScript)
            fs.writeFileSync(options.dir + '/manifest.json', JSON.stringify(manifestJson, null, 2))
          }
        }
      },
    },
  ]
}
