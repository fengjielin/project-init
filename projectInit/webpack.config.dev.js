const { merge } = require("webpack-merge"),
  webpackConfigBase = require("./webpack.config.base.js");
module.exports = merge(webpackConfigBase, {
  mode: "development",
  devtool: 'source-map',
  // performance: { // 配置如何展示性能提示
  //   hints: 'warning', // 'warning': 'error' | 'warning' boolean: false
  //   maxAssetSize: 300000, // 整数 字节
  //   maxEntrypointSize: 500000 // 整数 字节
  // },
  devServer: {
    host: "localhost",
    port: 3000,
    hot: true, // 启用 webpack 的模块热替换特性()
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                ['postcss-preset-env', {}]
              ]
            }
          }
        }],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      }
    ]
  }
});
