const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true
})

const fs = require('fs')

module.exports = {
  // ...
  devServer: {
    proxy: {
      "/api": {
        target: 'http://localhost:3100',
        changeOrigin: true,
        ws: true
        }    
      },
    allowedHosts: 'all',
    port: 443,
    http2: true,
    https: {
      key: fs.readFileSync('./certs/private.key'),
      cert: fs.readFileSync('./certs/domain.cert')
    }
  }
}
