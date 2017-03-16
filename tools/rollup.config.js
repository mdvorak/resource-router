const pkg = require('./../package.json');

module.exports = {
  entry: './dist/index.js',
  dest: './dist/bundles/resource-router.umd.js',
  format: 'umd',
  moduleName: 'mdvorak.resourceRouter',
  sourceMap: true,
  external: Object.keys(pkg.dependencies).concat([
    'rxjs/Observable',
    'rxjs/add/operator/catch',
    'rxjs/add/operator/map',
    'rxjs/add/operator/switchMap',
    'rxjs/add/observable/of'
  ]),
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/http': 'ng.http',
    'rxjs/Observable': 'Rx'
  },
  onwarn: function (message) {
    if (message.code === 'THIS_IS_UNDEFINED') return;
    console.warn(message);
  }
};
