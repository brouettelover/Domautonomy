const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true
})

const fs = require('fs')

module.exports = {
  // ...
  devServer: {
    allowedHosts: 'all',
    port: 443,
    http2: true,
    https: {
      key: fs.readFileSync('./certs/privkey.pem'),
      cert: fs.readFileSync('./certs/fullchain.pem')
    }
  }
}
