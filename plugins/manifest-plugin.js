// import {} from 'typescript'
import { build } from 'vite'
import fs from 'fs'
import { transpileModule } from 'typescript'

// ---cut-start---
/** @returns {import('rollup').Plugin} */
// ---cut-end---
export function manifestPlugin(manifest) {
  // console.info(manifest.web_accessible_resources)
  const names = ['src/setup.js']
  return {
    name: 'modify-manifest-plugin',

    buildStart(a, b, c) {
      const refId = this.emitFile({
        type: 'chunk',
        id: 'src/setup.ts',
        fileName: 'src/setup.js',
      })
    },
    async writeBundle(options, bundles, isWrite) {
      for (let key of Object.keys(bundles)) {
        // console.info('key ===', key)
        if (key === 'manifest.json') {
          // console.info(bundles[key])
          const manifestJson = JSON.parse(bundles[key].source?.toString())
          // console.log(manifestJson, 'json')
          manifestJson.web_accessible_resources.push({
            matches: ['<all_urls>'],
            resources: names,
            use_dynamic_url: false,
          })
          fs.writeFileSync(options.dir + '/manifest.json', JSON.stringify(manifestJson, null, 2))
        }
      }
    },
  }
}
