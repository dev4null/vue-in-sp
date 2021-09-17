const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
module.exports = {
  publicPath: './',
  outputDir: 'sharepoint-app',
  indexPath: 'default.aspx',
  css: {
    extract: false
  },
  configureWebpack: {
    plugins: [new VuetifyLoaderPlugin()],
    optimization: {
      splitChunks: false
    },
    devtool: 'source-map'
  },
  filenameHashing: false
}
