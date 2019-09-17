// vue.config.js
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  devServer: {
    open: true,
      proxy: {
        '/api': {
          target: 'http://47.96.172.33:8080', //对应自己的接口  //测试环境http://47.96.172.33:8080
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/api': ''  //重写接口去掉/api
          }
        }
      } 
  },
  //配置全局样式变量
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/common/scss/common.scss";`
      },
      less: {
        javascriptEnabled: true
      }
    }
  },
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('base', resolve('src/base'))
      .set('static', resolve('src/static'))
  }
}
