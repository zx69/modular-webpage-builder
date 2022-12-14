const { defineConfig } = require('@vue/cli-service');
// const nodeSassJsonImporter = require('node-sass-json-importer');

module.exports = defineConfig({
  publicPath: process.env.PUBLIC_PATH ?? '/',
  transpileDependencies: true,
  chainWebpack: (config) => {
    // if (process.env.NODE_ENV === 'production') {
    //   config
    //     .plugin('webpack-bundle-analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    // }
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          // importer: nodeSassJsonImporter(),
        },
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
          @import "@/styles/_extends.scss";
        `,
      },
    },
  },
});
