// The MIT License, Copyright (c) 2017 Michal Dvorak
const fs = require('fs');
const path = require('path');

module.exports = releasePackage;

function releasePackage(source, target, cb) {
  if (!source) {
    throw new Error("Missing source file");
  }
  if (!target) {
    throw new Error("Missing target file");
  }
  if (source === target) {
    throw new Error("Source and target cannot be the same")
  }

  // Get package definition
  const pkg = JSON.parse(fs.readFileSync(source, 'utf8'));

  // Peer dependencies instead
  pkg.peerDependencies = pkg.dependencies;

  // Cleanup
  delete pkg.scripts;
  delete pkg.engines;
  delete pkg.private;
  delete pkg.dependencies;
  delete pkg.devDependencies;

  // Write
  fs.mkdir(path.dirname(target), (err) => {
    if (err && err.code !== 'EEXIST') {
      return cb(err);
    }

    fs.writeFile(target, JSON.stringify(pkg, null, 2), cb);
  });
}
