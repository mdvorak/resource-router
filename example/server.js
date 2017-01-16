const browserSync = require('browser-sync');
const path = require('path');
const url = require('url');

const server = browserSync.create();
server.init({
    port: 3000,
    server: {
        baseDir: __dirname,
        routes: {
            "/node_modules": "node_modules",
            "/src": "src"
        }
    },
    reloadDebounce: 500,
    localOnly: true,
    middleware: [
        function (req, res, next) {
            // Log request
            console.info('[BS] ' + req.method + ' ' + req.url);
            next();
        },
        {
            route: "/api",
            handle: handleApi
        }
    ]
});

function handleApi(req, res) {
    if (req.url === '/') {
        // Redirect from root
        res.writeHead(303, {
            'Location': req.originalUrl + '/json'
        });
        res.end();
    }
    else if (req.url === '/json') {
        // Unspecified content
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            meaning: 42
        }));
    } else {
        // Not found
        res.writeHead(404);
        res.end();
    }
}
