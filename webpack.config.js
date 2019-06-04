const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.ts$/, exclude: /node_modules/, loader: 'babel-loader'},
    ],
  },
  resolve: {extensions: ['.js', '.jsx', '.tsx', '.ts', '.json']},
};
