const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {execFileSync} = require("node:child_process");

// This is build identification only. No files are written and no price source is modified.
// Restart webpack serve after Git Pull to show the new commit version in What's New.
const currentGitRevision = () => {
  try {
    return execFileSync("git",["rev-parse","--short=12","HEAD"],{
      cwd:path.resolve(__dirname,".."),encoding:"utf8",timeout:2500,
      stdio:["ignore","pipe","ignore"]
    }).trim();
  } catch (_) {return "UNAVAILABLE";}
};

module.exports = {
  entry: "./src/index.jsx",
  plugins: [
    new MiniCssExtractPlugin({filename: "bundle.css", chunkFilename: "[id].css"}),
    new webpack.DefinePlugin({
      __PJ0553_BUILD_REVISION__:JSON.stringify(currentGitRevision())
    })
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"]},
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      }
    ]
  },
  devServer: {
    setupMiddlewares: (middlewares) => {
      middlewares.unshift({name: "local-private-source-0550", middleware: require("./scripts/source-drive-0550.cjs").createMiddleware()});
      return middlewares;
    },
    static: {
      directory: path.join(__dirname, "public")
    },
    historyApiFallback: true,
    port: 3050
  }
};
