const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");
module.exports = {
  publicPath: "./",
  outputDir: "sharepoint-app",
  indexPath: "default.aspx",
  configureWebpack: {
    plugins: [new VuetifyLoaderPlugin()],
    optimization: {
      splitChunks: {
        automaticNameDelimiter: "-"
      }
    },
    devtool: "source-map"
  }
};
