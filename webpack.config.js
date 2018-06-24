const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.ts',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          formatter: 'msbuild'
        }
      },
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  devtool: 'source-map'
};
