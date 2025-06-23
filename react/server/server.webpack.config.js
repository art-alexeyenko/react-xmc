const path = require('path');
const env = require('@babel/preset-env');
const reactApp = require('babel-preset-react-app');
const webpack = require('webpack');
const SassAlias = require('sass-alias');
// Webpack build configuration to build the SSR bundle.
// Invoked by build:server.

module.exports = {
  stats: {
    errorDetails: true,
    children: true,
    loggingDebug: ["sass-loader"],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.json', 'sass', 'scss'],
  },
  name: 'server-config',
  mode: 'production',
  entry: path.resolve(__dirname, './server.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'server.bundle.js',
    libraryTarget: 'this',
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        // react-router-dom@6 uses mjs files
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [env, reactApp],
            plugins: [
              ['@babel/plugin-proposal-private-methods', { loose: true }],
              ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
              ['@babel/plugin-proposal-export-namespace-from'],
            ],
          },
        },
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'html-loader',
          options: {
            sources: false,
          },
        },
      },
      {
				test: /^.*\.(sass|scss)$/,
				use: [
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								importer: new SassAlias({
									'@sass': path.join(__dirname, '../src/assets/styles', 'sass'),
                  'fontawesome': path.join(__dirname, '../node_modules', 'font-awesome'),
								}).getImporter(),
							},
						},
					},
				],
			},
      {
        // anything not JS or HTML, we load as a URL
        // this makes static image imports work with SSR
        test: /\.(?!js|mjs|jsx|html|graphql$)[^.]+$/,
        exclude: /node_modules/,
        type: 'asset/inline',
      },
      {
        // anything in node_modules that isn't js,
        // we load as null - e.g. imported css from a module,
        // that is not needed for SSR
        test: /\.(?!js|mjs|jsx|html|graphql$)[^.]+$/,
        include: /node_modules/,
        use: {
          loader: 'null-loader',
        },
      },
    ],
  },
  plugins: [
    // prevents the following warning during build:
    // > WARNING in ./node_modules/encoding/lib/iconv-loader.js
    // > Critical dependency: the request of a dependency is an expression
    new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, () => {}),
    // prevents cross-fetch -> node-fetch from throwing `Can't resolve 'encoding'` error
    // see https://github.com/node-fetch/node-fetch/issues/412
    new webpack.IgnorePlugin({ resourceRegExp: /^encoding$/, contextRegExp: /node-fetch/ }),
  ],
};
