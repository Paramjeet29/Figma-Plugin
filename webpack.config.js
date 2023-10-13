// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const webpack = require('webpack');
// const path = require('path');

// module.exports = (env, argv) => ({
//   mode: argv.mode === 'production' ? 'production' : 'development',
//   devtool: argv.mode === 'production' ? false : 'inline-source-map',

//   entry: {
//     ui: './src/ui.tsx',
//     code: './src/code.ts',
//   },
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: 'ts-loader',
//         exclude: /node_modules/
//       },
//       {
//         test: /\.sass$/,
//         use: [
//           'style-loader',
//           'css-loader',
//           'sass-loader',
//         ],
//       },
//       {
//         test: /.svg$/,
//         use: '@svgr/webpack',
//       },
//     ]
//    },
//    plugins: [
//     new HtmlWebpackPlugin({
//       template: './src/ui.html',
//       filename: 'ui.html',
//       inlineSource: '.(js)$',
//       chunks: ['ui'],
//     }),
//     new HtmlWebpackInlineSourcePlugin(),
//   ],
// })

// const path = require('path');
// module.exports = {
//   entry: {
//         ui: './src/ui.tsx',
//         code: './src/code.ts',
//       },
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: 'ts-loader',
//         exclude: /node_modules/,
//       },
//     ],
//   },
//   resolve: {
//     extensions: ['.tsx', '.ts', '.js'],
//   },
//   output: {
//     filename: 'code.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
// };
// const path = require('path');

// module.exports = {
//   entry: {
//     ui: './src/ui.tsx',
//     code: './src/code.ts',
//   },
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: 'ts-loader',
//         exclude: /node_modules/,
//       },
//     ],
//   },
//   resolve: {
//     extensions: ['.tsx', '.ts', '.js'],
//   },
//   output: {
//     filename: '[name].js', // Use [name] placeholder for unique chunk names
//     path: path.resolve(__dirname, 'dist'),
//   },
// };
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const path = require('path');

// module.exports = (env, argv) => ({
//   mode: argv.mode === 'production' ? 'production' : 'development',

//   // This is necessary because Figma's 'eval' works differently than normal eval
//   devtool: argv.mode === 'production' ? false : 'inline-source-map',

//   entry: {
//     ui: './src/ui.tsx', // The entry point for your UI code
//     code: './src/code.ts', // The entry point for your plugin code
//   },

//   module: {
//     rules: [
//       // Converts TypeScript code to JavaScript
//       { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },

//       // Enables including CSS by doing "import './file.css'" in your TypeScript code
//       { test: /\.css$/, use: ['style-loader', { loader: 'css-loader' }] },

//       // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
//       { test: /\.(png|jpg|gif|webp|svg)$/, loader: 'url-loader' },
//     ],
//   },

//   // Webpack tries these extensions for you if you omit the extension like "import './file'"
//   resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

//   output: {
//     filename: '[name].js',
//     path: path.resolve(__dirname, 'dist'), // Compile into a folder called "dist"
//   },

//   // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './src/app/index.html',
//       filename: 'ui.html',
//       chunks: ['ui'],
//       cache: false,
//     }),
//     new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/ui/]),
//   ],
// });

const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    ui: './src/ui.tsx', // The entry point for your UI code
    code: './src/code.ts', // The entry point for your plugin code
  },

  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      // Enables including CSS by doing "import './file.css'" in your TypeScript code
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
      // { test: /\.(png|jpg|gif|webp|svg|zip)$/, loader: [{ loader: 'url-loader' }] }
      {
        test: /\.svg/,
        type: 'asset/inline',
      },
    ],
  },

  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

  output: {
    filename: (pathData) => {
      return pathData.chunk.name === 'code'
        ? 'code.js'
        : '[name].[contenthash].js';
    },
    path: path.resolve(__dirname, 'dist'), // Compile into a folder called "dist"
    // Clean the output directory before emit.
    clean: true,
  },

  // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
  plugins: [
    new webpack.DefinePlugin({
      global: {}, // Fix missing symbol error when running in developer VM
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/ui.html',
      filename: 'ui.html',
      chunks: ['ui'],
    }),
    new HtmlInlineScriptPlugin({
      htmlMatchPattern: [/ui.html/],
      scriptMatchPattern: [/.js$/],
    }),
  ],
});