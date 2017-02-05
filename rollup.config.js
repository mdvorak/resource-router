const pkg = require('./package.json');

export default {
    entry: './dist/index.js',
    dest: './dist/bundles/resource-router.umd.js',
    format: 'umd',
    moduleName: 'mdvorak.resourceRouter',
    external: Object.keys(pkg.dependencies).concat([
        'rxjs/add/operator/catch',
        'rxjs/add/operator/map',
        'rxjs/add/operator/switchMap'
    ]),
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/http': 'ng.http',
        'rxjs': 'Rx'
    },
    onwarn: function (message) {
        if (message.code === 'THIS_IS_UNDEFINED') return;
        console.warn(message);
    }
}
