const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // Сайт публикуется в подпапку https://onenaviio.github.io/md/,
  // поэтому пути к ресурсам и base для vue-router должны указывать на /md/.
  publicPath: process.env.NODE_ENV === 'production' ? '/md/' : '/',
  chainWebpack: (config) => {
    // Импортируем .md как сырые строки (webpack 5 asset/source).
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .type('asset/source')
  }
})
