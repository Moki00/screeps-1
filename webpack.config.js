const path = require('path');
const UploadScreepsCode = require('./upload-screeps-code-webpack-plugin');
const ScreepsSourceMapWebpackPlugin = require('./screeps-source-map-webpack-plugin');
const screepsOptions = getScreepsCliArgs();

module.exports = {
  mode: 'development',
  target: 'node',
  entry: {
    main: './src/main.ts',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              formatter: 'msbuild',
            },
          },
          {
            loader: "source-map-loader",
          },
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          }
        ],
      },
    ],
  },
  plugins: [
    new ScreepsSourceMapWebpackPlugin(),
    new UploadScreepsCode(screepsOptions),
  ],
  devtool: 'source-map',
  externals: {
    'main.js.map': 'main.js.map',
  }
};

function getScreepsCliArgs() {
  const niceArgs = {
    server: undefined,
    branch: undefined,
  };

  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];

    if (arg === '--screepsServer' || (arg === '-ss') && args[i + 1]) {
      niceArgs.server = args[i + 1];
      i++;
    }

    if (arg === '--screepsBranch' || (arg === '-sb') && args[i + 1]) {
      niceArgs.branch = args[i + 1];
      i++;
    }
  }

  if (!niceArgs.server) {
    console.error(`Server name must be specified. Add \`--screepsServer NAME\`, where \`NAME\` is matching server name from .screeps.yaml.`);
    process.exit(1);
  }

  if (!niceArgs.branch) {
    console.error(`Branch name must be specified. Add \`--screepsBranch NAME\`, where \`NAME\` is any name.`);
    process.exit(1);
  }

  return niceArgs;
}
