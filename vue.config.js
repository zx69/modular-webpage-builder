const { defineConfig } = require('@vue/cli-service');
// const nodeSassJsonImporter = require('node-sass-json-importer');

module.exports = defineConfig({
  publicPath: process.env.PUBLIC_PATH ?? process.env.NODE_ENV === 'development' ? '/public' : '/',
  transpileDependencies: true,
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
