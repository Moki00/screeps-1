const path = require('path');
const { ConcatSource } = require("webpack-sources");

function ScreepsSourceMapWebpackPlugin() {};

ScreepsSourceMapWebpackPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    for (const filename in compilation.assets) {
      if (path.basename(filename, '.js').match(/\.map/)) {
        compilation.assets[filename] = new ConcatSource("module.exports = ", compilation.assets[filename]);
      }
    }

    callback();
  });
};

module.exports = ScreepsSourceMapWebpackPlugin;
