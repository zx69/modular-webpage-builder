# modular-webpage-builder

[![vue](https://img.shields.io/badge/vue-3.2.13-brightgreen.svg)](https://github.com/vuejs/core) [![typescript](https://img.shields.io/badge/typescript-4.5.5-blue.svg)](https://github.com/microsoft/TypeScript) [![element-plus](https://img.shields.io/badge/element--plus-2.2.12-yellow.svg)](https://github.com/element-plus/element-plus)

`modular-webpage-builder`是一个模块化+低代码的页面生成器,基于`vue`+`typescript`+`element-plus`实现。

- 本项目使用`vue-cli`初始化，主要基于 [vue3](https://github.com/vuejs/core)技术栈 + [Typescript](https://github.com/microsoft/TypeScript) + [element-plus](https://github.com/element-plus/element-plus) 实现。

    - 本项目初始开发时，vue3-setup语法糖还没出来，所以本项目没有采用，只用了基础的`composition-api`。

    - 其中`element-plus`使用的不多，根据自身需要可自行替换为其他UI框架。

- 演示Demo为Github Pages页面，数据是临时自己mock的。


## Documentation 文档
系列目录
- [一个模块化+低代码的页面生成器的开发记录(原理篇)](https://juejin.cn/post/7154961270569959454)
- [一个模块化+低代码的页面生成器的开发记录(要点+BUG篇)](https://juejin.cn/post/7154963876528783368)

## Live Demo 在线地址
- 在线预览：[demo](https://zx69.github.io/modular-webpage-builder/index.html)
- 在线模块生成器（演示用）：[module-editor](https://zx69.github.io/modular-webpage-builder/#/moduleEditor)

## Screenshots 截图

![homepage](https://github.com/zx69/front-end-articles/blob/main/modular-webpage-builder/images/builder-main-preview.png)

## Display Gif 演示
![display](https://github.com/zx69/front-end-articles/blob/main/modular-webpage-builder/images/display-video-2.gif)

## Project setup 启动项目
```
git clone git@github.com:zx69/modular-webpage-builder.git
cd ./modular-webpage-builder
yarn install
yarn start
```

## Browsers support 浏览器支持

现代浏览器(不含Internet Explorer).

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| Edge | last 2 versions| last 2 versions| last 2 versions

## License

[MIT License](https://github.com/Armour/vue-typescript-admin-template/blob/master/LICENSE)
