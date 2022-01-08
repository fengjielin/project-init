### webpack项目初始配置

```shell
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev webpack-merge 
npm install --save-dev html-webpack-plugin (生成html文件,并自动引入script标签)
npm install --save-dev babel-loader babel-core babel-preset-env
npm install --save-dev @babel/core@^7.4.5
npm install --save-dev style-loader css-loader less-loader
npm install --save-dev postcss-loader postcss (PostCSS提供了一个解析器,它能够将 CSS 解析成抽象语法树(AST))
npm install --save-dev postcss-preset-env (postcss-preset-env包含autoprefixer,提供添加厂商前缀的功能)
npm install --save-dev url-loader (webpack 5不需要安装, 存在asset资源模块)
npm install --save-dev vue-loader vue-template-compiler
npm install --save-dev extract-text-webpack-plugin (不支持webpack5)
npm install --save-dev mini-css-extract-plugin (代替extract-text-webpack-plugin, 分离 css)
npm install --save-dev css-minimizer-webpack-plugin (使用cssnano优化和压缩 CSS)
npm install --save-dev clean-webpack-plugin (每次打包前清理上一次打包的文件)
npm install --save-dev terser-webpack-plugin (替换uglifyjs-webpack-plugin, 压缩 JavaScript)

npx autoprefixer --info 以检查选择了哪些浏览器以及哪些属性将被添加前缀
```

vue-template-compiler作用： 该模块可用于将 Vue 2.0 模板预编译为渲染函数（template => ast => render），以避免运行时编译开销和 CSP 限制。大都数场景下，与 vue-loader一起使用，只有在编写具有非常特定需求的构建工具时，才需要单独使用它。在 vue 工程中，安装依赖时，需要 vue 和 vue-template-compiler 版本必须保持一致，否则会报错。

使用 webpack 打包.vue文件报错 You may need an additional loader to handle the result of these loaders

```js
// vue-loader 15.x 以上版本，需要在webpack.config.js中对其进行配置才可正常使用
const VueLoaderPlugin = require('vue-loader/lib/plugin');
plugins: [        
  new VueLoaderPlugin()
]
```

index.html中的id="app"那个元素，只是一个占位符而已。会被组件中id="app"的App.vue组件中的视图所替换。

extract-text-webpack-plugin 作用：该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
mini-css-extract-plugin 作用：本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。 注意：不要同时使用 style-loader 与 mini-css-extract-plugin


> 推荐 production 环境的构建将 CSS 从你的 bundle 中分离出来，这样可以使用 CSS/JS 文件的并行加载。 这可以通过使用 mini-css-extract-plugin 来实现，因为它可以创建单独的 CSS 文件。 对于 development 模式（包括 webpack-dev-server），你可以使用 style-loader，因为它可以使用多个 标签将 CSS 插入到 DOM 中，并且反应会更快。

devtool: 'source-map' 有利于开发调试和线上排错，有了它浏览器就可以从转换后的代码直接定位到转换前的代码

### 加入Vue 项目初始配置

```shell
npm install --save vue
npm install --save vue-router
npm install --save vuex 
npm install --save axios
```

