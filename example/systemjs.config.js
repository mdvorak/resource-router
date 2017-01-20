/**
 * System configuration for example app
 */
(function (global) {
    System.config({
        paths: {
            'npm:': '../node_modules/'
        },
        map: {
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            'rxjs': 'npm:rxjs',
            'zone.js': 'npm:zone.js',
            'core-js/es7': 'npm:core-js',
            'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
        },
        packages: {
            app: {
                main: './example.bundle.js'
            },
            rxjs: {
                defaultExtension: 'js'
            }
        }
    });
})(this);
