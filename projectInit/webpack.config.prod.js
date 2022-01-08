const { merge } = require("webpack-merge"),
  webpackConfigBase = require("./webpack.config.base.js"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  CssMinimizerPlugin = require("css-minimizer-webpack-plugin"),
  TerserPlugin = require("terser-webpack-plugin");
module.exports = merge(webpackConfigBase, {
  mode:'production',
  performance: { // 配置如何展示性能提示
    hints: "warning",
    maxAssetSize: 300000, // 整数 字节
    maxEntrypointSize: 500000 // 整数 字节
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
      }, extractComments: false, // 在构建时去除注释
    }), new CssMinimizerPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", {
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
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist"],
    }),
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].css",
      ignoreOrder: false
    })
  ]
});
