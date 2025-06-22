
export function manifestPlugin(manifest) {
  console.info(manifest.web_accessible_resources)
  return {
    name: 'manifest-plugin',
    apply: 'build',
    // enforce: 'post',

  }
}
