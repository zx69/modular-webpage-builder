const { defineConfig } = require('@vue/cli-service');
// const nodeSassJsonImporter = require('node-sass-json-importer');
console.log(process.env.PUBLIC_PATH);
module.exports = defineConfig({
  publicPath: process.env.PUBLIC_PATH ?? '/',
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
