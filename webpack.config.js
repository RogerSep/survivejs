var path = require("path");
var HtmlwebpackPlugin = require("html-webpack-plugin");
var webpack = require("webpack");
var merge = require("webpack-merge");
var pkg = require("./package.json");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Clean = require('clean-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, "app"),
  build: path.resolve(__dirname, "build"),
  test: path.join(__dirname, "test")
};

process.env.BABEL_ENV = TARGET;

var common = {
  entry: PATHS.app,
  output: {
    path: PATHS.build,
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ["babel"],
        include: PATHS.app
      }
    ]
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: "Kanban app"
    })
  ]
};

if (TARGET === "build" || TARGET === "stats") {
  module.exports = merge(common, {
    entry: {
      app: PATHS.app,
      vendor: Object.keys(pkg.dependencies)
    },
    output: {
      path: PATHS.build,
      filename: "[name].[chunkhash].js"
    },
    devtool: "source-map",
    module: {
      loaders: [{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css"),
        include: PATHS.app
      }]
    },
    plugins: [
      new Clean(["build"]),
      new ExtractTextPlugin("styles.[chunkhash].css"),
      new webpack.optimize.CommonsChunkPlugin(
        "vendor",
        "[name].[chunkhash].js"
      ),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}

if (TARGET === "start" || !TARGET) {
  module.exports = merge(common, {
    devtool: "eval-source-map",
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // display only errors to reduce the amount of output
      stats: "errors-only",

      // parse host and port from env so this is easy
      // to customize
      host: process.env.HOST,
      port: process.env.PORT
    },
    module: {
      loaders: [{
        test: /\.css$/,
        loaders: ["style", "css"],
        include: PATHS.app
      }]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

if (TARGET === "test" || TARGET === "tdd") {
  module.exports = merge(common, {
    entry: {},
    output: {},
    devtool: "inline-source-map",
    resolve: {
      alias: {
        app: PATHS.app
      }
    },
    module: {
      preLoaders: [
        {
          test: /\.jsx$/,
          loaders: ["isparta-instrumenter"],
          include: PATHS.app
        }
      ],
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ["babel"],
          include: PATHS.test
        }
      ]
    }
  });
}