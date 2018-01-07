const TARGET = "http://private-anon-5c8d0c0da6-resourcerouterexample.apiary-mock.com";

function replaceHost(data, req) {
  const hostRegExp = new RegExp(TARGET.replace(/([^a-zA-Z0-9])/g, '\\$1') + '/', 'g');
  return data.toString().replace(hostRegExp, 'http://' + req.hostname + ':4200/')
}

const PROXY_CONFIG = {
  "/api": {
    "target": TARGET,
    "secure": false,
    "cookieDomainRewrite": true,
    "changeOrigin": true,
    "logLevel": "debug",
    "onProxyReq": function (proxyReq, req, res) {
      proxyReq.setHeader('Host', TARGET.replace(/^\w+:\/\//, ''));
    },
    "onProxyRes": function (proxyRes, req, res) {
      // Handle redirect
      if (proxyRes.headers['location']) {
        proxyRes.headers['location'] = replaceHost(proxyRes.headers['location'], req);
      }

      // Remove Content-Length - we change it, and browser can do without it
      delete proxyRes.headers['content-length'];

      // Content replacement logic
      const _end = res.end;
      let response = '';

      // Collect response
      proxyRes.on('data', function (data) {
        response += data.toString();
      });

      // Defer all writes
      res.write = function () {
      };

      // Write final buffer
      res.end = function () {
        _end.call(res, replaceHost(response, req));
      }
    }
  }
};

module.exports = PROXY_CONFIG;
