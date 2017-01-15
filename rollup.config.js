const pkg = require('./package.json');

export default {
    entry: './dist/index.js',
    dest: './dist/bundles/resource-router.umd.js',
    format: 'umd',
    moduleName: pkg.name,
    external: Object.keys(pkg.dependencies),
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/http': 'ng.http'
    },
    onwarn: function (message) {
        if (message.code === 'THIS_IS_UNDEFINED') return;
        console.warn(message);
    }
}
