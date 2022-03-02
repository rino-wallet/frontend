const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");

// craco.config.js
// Note: the inherited base config of create-react-app is here:
// https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/webpack.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.fallback = {
        process: require.resolve("process/browser.js"),
        zlib: require.resolve("browserify-zlib"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        buffer: require.resolve("buffer"),
        asset: require.resolve("assert"),
        crypto: require.resolve("crypto-browserify"),
        path: require.resolve("path-browserify"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        os: require.resolve("os-browserify"),
        fs: false,
        child_process: false,
      };
      
      const plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser.js",
        }),
        // SriPlugin might be better disabled in local development mode
        new SubresourceIntegrityPlugin({ hashFuncNames: ["sha256"] }),
      ];

      // // env == production when running 'yarn build'
      // // env == development when running 'yarn start'. For some reason we can't use chunkhash in this case
      const chunksPattern = "[name].[chunkhash].js" ;
      // // note: SriPlugin uses 'crossOriginLoading''
      const output = Object.assign(webpackConfig.output,
        { crossOriginLoading: "anonymous" }
      );

      // We remove the default TerserPlugin instance, and replace it with one with custom configuration.
      // that avoids creating the LICENSE chunks. See this for context:
      // https://stackoverflow.com/questions/64818489/webpack-omit-creation-of-license-txt-files
      let minimizer = webpackConfig.optimization.minimizer.filter((elem) => !(elem instanceof TerserPlugin))
      minimizer = [new TerserPlugin({ extractComments: false }), ...minimizer]
      // We also set optimization.moduleIds==named, which irons some of the pain-points around webpack deterministic builds.
      // For context see:
      // * https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      // * https://github.com/webpack/webpack/issues/4913
      const optimization = Object.assign(webpackConfig.optimization, { moduleIds: "named", chunkIds: "named", realContentHash: true, minimizer });
      const updatedConf = Object.assign(webpackConfig, { plugins, output, optimization });
      return updatedConf
    },
  },
  babel: {
    loaderOptions: (babelLoaderOptions, { env, paths }) => {
      // The babel preset `babel-preset-react-app` with its default configuration, causes
      // some variables named after the absolute path, on the webpack runtime; like the following:
      // var _home_ec2_user_frontend_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__
      // This is not deterministic because it varies depending on you absolute path.
      // IE: /home/luis/wallet/frontend vs /home/ec2-user/frontend.
      // So we're overriding its default configuration on this hook.
      const presets = [...babelLoaderOptions.presets];
      for (const preset of presets) {
        // preset look like [presetName, presetConfig], where presetName
        // is a string, and presetConfig an object.
        if (preset[0].includes("babel-preset-react-app")) {
          preset[1].absoluteRuntime = false;
        }
      }
      const updatedOpts = Object.assign(babelLoaderOptions, { presets });
      return updatedOpts;
    }
  }
};
