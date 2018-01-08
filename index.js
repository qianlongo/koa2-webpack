const webpack = require('webpack')
const koaCompose = require('koa-compose')
const path = require('path')
const koa2Connect = require('koa2-connect')
let devMiddleware = require('webpack-dev-middleware')
let hotMiddleware = require('webpack-hot-middleware')

module.exports = (webpackConfig) => {
  let compiler = webpack(webpackConfig)
  let { output: { publicPath } } = webpackConfig
  let bundle = {}

  devMiddleware = devMiddleware(compiler, {
    path: '/__webpack_hmr',
    noInfo: true,
    stats: {
      colors: true
    },
    publicPath
  })
  hotMiddleware = hotMiddleware(compiler)

  Object.keys(webpackConfig.entry).forEach(function (key) {
    bundle[`${key}js`] = path.join(publicPath, key + '.js')
  })

  const handler = async (ctx, next) => {
    ctx.state.scope.bundle = bundle
    await next()
  }

  return koaCompose([koa2Connect(devMiddleware), koa2Connect(hotMiddleware), handler])
}
