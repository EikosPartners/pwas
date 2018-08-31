const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [
      // Other plugins...
      new InjectManifest({
        swSrc: "./src/service-worker.js"
      })
    ]
  }
};
