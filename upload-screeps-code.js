const { ScreepsAPI } = require('screeps-api');
const fs = require('fs');

const args = getCliArgs();

ScreepsAPI.fromConfig(args.server)
  .then((api) => onAuthSuccess(api, args))
  .catch(onAuthFailure);

function getCliArgs() {
  const niceArgs = {
    server: undefined,
    branch: undefined,
  };

  let isHelpActivated = false;

  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (arg === '--server' || (arg === '-s') && args[i + 1]) {
      niceArgs.server = args[i + 1];
      i++;
    } else if (arg === '--branch' || (arg === '-b') && args[i + 1]) {
      niceArgs.branch = args[i + 1];
      i++;
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node upload.js [options]');
      console.log('Options:');
      console.log(' -h, --help                          Display help.');
      console.log(` -s, --server SERVER_NAME            Set server name defined in screeps config.`);
      console.log(` -b, --branch BRANCH_NAME            Set branch name on the server.`);
      isHelpActivated = true;
    } else {
      console.error(`Invalid command line argument ${arg}`);
      process.exit(1);
    }
  }

  if (isHelpActivated) {
    process.exit(0);
  }

  if (!isHelpActivated) {
    if (!niceArgs.server) {
      console.error(`Server name must be set. See --help.`);
    }

    if (!niceArgs.branch) {
      console.error(`Branch name must be set. See --help.`);
    }
  }

  if (!niceArgs.server || !niceArgs.branch) {
    process.exit(1);
  }

  return niceArgs;
}

function onAuthSuccess(api, args) {
  upload(api, args);
}

function onAuthFailure(error) {
  console.log(`Screeps API error: ${error}`);
}

function upload(api, args) {
  api.code.set(args.branch, {
    main: getBuildFile(),
  })
    .then(onUploadSuccess(args))
    .catch(onUploadFailure);
}

function getBuildFile() {
  return fs.readFileSync('./build/main.js', 'utf8');
}

function onUploadSuccess({server, branch}) {
  console.log(`Code has been uploaded:`);
  console.log(`server: ${server}`);
  console.log(`branch: ${branch}`);
}

function onUploadFailure(error) {
  console.log(`Code uplading error: ${error}`);
}
