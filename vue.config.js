const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    // Импортируем .md как сырые строки (webpack 5 asset/source).
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .type('asset/source')
  }
})
