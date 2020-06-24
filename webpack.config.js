const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, options) => {
  return {
    entry: "./src/develop/App.tsx",
    output: {
      path: path.join(__dirname, "/dist"),
      filename: options.mode == 'production' ? '[name].min.js' : '[name].min.js',
      publicPath: options.mode == 'production' ? "http://192.168.16.54:8080/" : "http://192.168.12.37:8080/"
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: "initial",
            name: "vendor",
            priority: 1,
            enforce: true
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.js|.ts|.tsx$/,
          exclude: [/node_modules/],
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env"
                ],
                [
                  "@babel/preset-react"
                ],
                [
                  "@babel/preset-typescript"
                ]
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose": true }]],
            }
          }
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/img/'
            }
          }]
        },

      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
    devServer: {
      historyApiFallback: false,
      compress: false,
    }
  }
};
