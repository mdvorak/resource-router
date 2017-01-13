// The MIT License, Copyright (c) 2017 Michal Dvorak
var fs = require('fs');

var source = process.argv[2];
var target = process.argv[3];

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
console.info("Reading " + source);
var pkg = JSON.parse(fs.readFileSync(source, 'utf8'));

// Peer dependencies instead
pkg.peerDependencies = pkg.dependencies;

// Cleanup
delete pkg.scripts;
delete pkg.engines;
delete pkg.private;
delete pkg.dependencies;
delete pkg.devDependencies;

// Write
console.info("Writing " + target);
fs.writeFileSync(target, JSON.stringify(pkg, null, 2));
