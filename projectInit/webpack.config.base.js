const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  VueLoaderPlugin = require("vue-loader/lib/plugin");
module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/js/[name].bundle.js",
    chunkFilename: "assets/js/[id].js",
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: __dirname + "/node_modules",
        include: __dirname + "src",
        options: {
          presets: ["env"],
        },
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[hash][ext][query]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8192,
          },
        },
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "htmlWebpackPlugin",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      filename: "index.html",
      template: path.resolve(__dirname, "public/index.html"),
      excludeChunks: ["node_modules"],
      files: {
        js: ["js/index.js"],
        chunks: {
          main: {
            entry: "dist/bundle.js",
          },
        },
      },
    }),
    new VueLoaderPlugin(),
  ],
};
