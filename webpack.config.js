const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.ts$/, exclude: /node_modules/, loader: 'babel-loader'},
    ],
  },
  resolve: {extensions: ['.js', '.jsx', '.tsx', '.ts', '.json']},
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({title: 'Onwords', template: 'src/index.html'}),
    // new WorkboxPlugin.GenerateSW({
    // these options encourage the ServiceWorkers to get in there fast
    // and not allow any straggling "old" SWs to hang around
    // clientsClaim: true,
    // skipWaiting: true,
    // }),
    // new ManifestPlugin(),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    contentBase: `./dist`,
    port: 9000,
    hot: true,
  },
  externals: {
    fs: 'commonjs fs',
    path: 'commonjs path',
  },
};
