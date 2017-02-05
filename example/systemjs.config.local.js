(function (global) {
    SystemJS.defaultJSExtensions = true;

    System.config({
        // DEMO ONLY! REAL CODE SHOULD NOT TRANSPILE IN THE BROWSER
        transpiler: 'ts',
        typescriptOptions: {
            // Copy of compiler options in standard tsconfig.json
            "target": "es5",
            "module": "commonjs",
            "moduleResolution": "node",
            "sourceMap": true,
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "noImplicitAny": true,
            "suppressImplicitAnyIndexErrors": true
        },
        meta: {
            'typescript': {
                "exports": "ts"
            }
        },
        paths: {
            'npm:*': '/node_modules/*',
            'dist:*': '/dist/*'
        },
        map: {
            // our app is within the app folder
            app: 'app',

            // angular bundles
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

            'rxjs': 'npm:rxjs',
            'ts': 'npm:plugin-typescript/lib/plugin.js',
            'typescript': 'npm:typescript/lib/typescript.js',

            // router
            'angular-resource-router': 'dist:index.js'
        },
        packages: {
            app: {
                main: './main.ts',
                defaultExtension: 'ts'
            },
            rxjs: {
                main: 'Rx.js',
                defaultExtension: 'js'
            }
        }
    });

    if (global.autoBootstrap) {
        bootstrap();
    }

    // Bootstrap with a default `AppModule`
    // ignore an `app/app.module.ts` and `app/main.ts`, even if present
    function bootstrap() {
        console.log('Auto-bootstrapping');

        // Stub out `app/main.ts` so System.import('app') doesn't fail if called in the index.html
        System.set(System.normalizeSync('app/main.ts'), System.newModule({}));

        // bootstrap and launch the app (equivalent to standard main.ts)
        Promise.all([
            System.import('@angular/platform-browser-dynamic'),
            System.import('app/app.module')
        ])
            .then(function (imports) {
                var platform = imports[0];
                var app = imports[1];
                platform.platformBrowserDynamic().bootstrapModule(app.AppModule);
            })
            .catch(function (err) {
                console.error(err);
            });
    }
})(this);
