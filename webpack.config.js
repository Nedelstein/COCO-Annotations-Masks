const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
// const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/app.js",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack Output"
    }),
    new CopyPlugin([
      { from: "src/image_masks/*", to: "image_masks/", flatten: true }
    ]),
    new CopyPlugin([{ from: "src/shaders/*", to: "shaders/", flatten: true }])
    // new CleanWebpackPlugin()
  ],
  devServer: {
    contentBase: "./dist",
    open: true
  }
};
