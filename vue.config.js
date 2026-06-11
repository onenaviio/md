const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // Сайт обслуживается из корня кастомного домена https://docs.simpleworkapps.ru/,
  // поэтому publicPath — '/' (а не '/md/').
  publicPath: '/',
  chainWebpack: (config) => {
    // Заголовок вкладки браузера (по умолчанию Vue CLI берёт name из package.json).
    config.plugin('html').tap((args) => {
      args[0].title = 'Docs'
      return args
    })

    // Импортируем .md как сырые строки (webpack 5 asset/source).
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .type('asset/source')
  }
})
