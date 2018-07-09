const { ScreepsAPI } = require('screeps-api');
const path = require('path');

function UploadScreepsCodeWebpackPlugin(options) {
  this.apply = this.apply.bind(this, options);
}

UploadScreepsCodeWebpackPlugin.prototype.apply = function(options, compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    const sourcesByFiles = {};
    for (const filename in compilation.assets) {
      const basename = path.basename(filename, '.js');
      sourcesByFiles[basename] = compilation.assets[filename].source();
    }

    ScreepsAPI.fromConfig(options.server)
      .then((api) => authWithoutToken(api))
      .then((api) => onAuthSuccess(api, options, sourcesByFiles))
      .catch(onAuthFailure);

    callback();
  });
};

function authWithoutToken(api) {
  if (!api.opts.token) {
    api.auth();
  }
  return api;
}

function onUploadSuccess(api, {server, branch}) {
  console.log(`[UploadScreepsCodeWebpackPlugin] Code has been uploaded:   server: ${server}    branch: ${branch}`);
}

function onUploadFailure(error) {
  console.log(`[UploadScreepsCodeWebpackPlugin] Code uplading error: ${error}`);
}

function onAuthSuccess(api, options, sourcesByFiles) {
  upload(api, options, sourcesByFiles);
}

function onAuthFailure(error) {
  console.log(`[UploadScreepsCodeWebpackPlugin] Screeps API error: ${error}`);
}

function upload(api, options, sourcesByFiles) {
  api.code.set(options.branch, sourcesByFiles)
    .then((api) => onUploadSuccess(api, options))
    .catch(onUploadFailure);
}

module.exports = UploadScreepsCodeWebpackPlugin;