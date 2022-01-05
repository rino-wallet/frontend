const HashOutput = require('webpack-plugin-hash-output');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');


// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [
        require("tailwindcss"),
        require("autoprefixer"),
      ],
    },
  },
  webpack: {
    optimization: [],
    configure: (webpackConfig, { env, paths }) => {
      let plugins = webpackConfig.plugins;

      plugins = [
        // LAST: HashOutput replaces the default chunk-hashing plugins, because the default ones
        // don't really "see" the final compilation artifacts. It will be responsible for
        // creating the hashes that will take part of the chunk names. See its npm entry
        // for context see:
        // * https://www.npmjs.com/package/webpack-plugin-hash-output
        // * https://github.com/webpack/webpack/issues/4913
        new HashOutput(),

        // Build determinism is shit by default on webpack. NamedChunksPlugin solves one
        // of the pain-points. Read this for context:
        // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
        new webpack.NamedChunksPlugin(),
        ...plugins
      ];

      // env == production when running 'yarn build'
      // env == development when running 'yarn start'. For some reason we can't use chunkhash in this case
      const chunksPattern = env == 'production' ? '[name].[chunkhash].js' : '[name].[hash].js';
      // HashOutput will inject into these [chunkhash] templates
      let output = Object.assign(webpackConfig.output,
        { filename: chunksPattern, chunkFilename: chunksPattern }
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
      const optimization = Object.assign(webpackConfig.optimization, { moduleIds: 'named' , minimizer });

      const updatedConf = Object.assign(webpackConfig, { plugins, output, optimization });
      return updatedConf;
    }
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
        if (preset[0].includes('babel-preset-react-app')) {
          preset[1].absoluteRuntime = false;
        }
      }
      const updatedOpts = Object.assign(babelLoaderOptions, { presets });
      return updatedOpts;
    }
  }
}