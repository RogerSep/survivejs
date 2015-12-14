module.exports = function karmaConfig (config) {
  config.set({
    frameworks: [
      "mocha"
    ],
    reporters: [
      "spec",
      "coverage"
    ],
    files: [
      "node_modules/phantomjs-polyfill/bind-polyfill.js",
      "tests/**/*_test.*"
    ],
    preprocessors: {
      "tests/**/*_test.*": ["webpack", "sourcemap"]
    },
    browsers: [
      "PhantomJS"
    ],
    singleRun: true,
    coverageReporter: {
      dir: "build/coverage/",
      type: "html"
    },
    webpack: require("./webpack.config"),
    webpackMiddleware: {
      noInfo: true
    }
  });
};