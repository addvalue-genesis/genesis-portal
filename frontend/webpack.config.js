const path = require("path");
const webpack = require("webpack");
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

module.exports = (env = {}) => ({
  entry: env.project === "0553" ? "./src/index0553.jsx" : "./src/index.jsx",
  plugins: [
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
    static: {
      directory: path.join(__dirname, "public")
    },
    historyApiFallback: true,
    port: 3000
  }
});
