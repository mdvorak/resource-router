import { parseUrl, UrlInfo } from './parse-url';

describe(parseUrl.name, () => {

  const examples: {
    readonly [name: string]: UrlInfo;
  } = {
    // Absolute
    'http://example.com': {protocol: 'http:', host: 'example.com'},
    'http://example.com:123': {protocol: 'http:', host: 'example.com:123'},
    'http://example.com:123/?a=42': {protocol: 'http:', host: 'example.com:123', pathname: '/?a=42'},
    'http://example.com:123/#tag': {protocol: 'http:', host: 'example.com:123', pathname: '/#tag'},
    'http://example.com:123/?a=42&b=12#tag': {protocol: 'http:', host: 'example.com:123', pathname: '/?a=42&b=12#tag'},
    'http://example.com/foo/bar': {protocol: 'http:', host: 'example.com', pathname: '/foo/bar'},
    'http://example.com:123/foo/bar': {protocol: 'http:', host: 'example.com:123', pathname: '/foo/bar'},
    'http://user:pass@example.com/foo/bar': {protocol: 'http:', host: 'user:pass@example.com', pathname: '/foo/bar'},
    'http://user:pass@example.com:123/foo/bar': {protocol: 'http:', host: 'user:pass@example.com:123', pathname: '/foo/bar'},
    'http://user:pass@example.com:123/foo/bar?a=42': {protocol: 'http:', host: 'user:pass@example.com:123', pathname: '/foo/bar?a=42'},
    'http://user:pass@example.com:123/foo/bar#tag': {protocol: 'http:', host: 'user:pass@example.com:123', pathname: '/foo/bar#tag'},
    // Scheme relative
    '//example.com': {host: 'example.com'},
    '//example.com:123': {host: 'example.com:123'},
    '//example.com:123/?a=42': {host: 'example.com:123', pathname: '/?a=42'},
    '//example.com/foo/bar': {host: 'example.com', pathname: '/foo/bar'},
    '//example.com:123/foo/bar': {host: 'example.com:123', pathname: '/foo/bar'},
    '//user:pass@example.com/foo/bar': {host: 'user:pass@example.com', pathname: '/foo/bar'},
    '//user:pass@example.com:123/foo/bar': {host: 'user:pass@example.com:123', pathname: '/foo/bar'},
    '//user:pass@example.com:123/foo/bar?a=42': {host: 'user:pass@example.com:123', pathname: '/foo/bar?a=42'},
    '//user:pass@example.com:123/foo/bar#tag': {host: 'user:pass@example.com:123', pathname: '/foo/bar#tag'},
    // Without host
    'file:///': {protocol: 'file:', pathname: '/'},
    'file:///foo/bar': {protocol: 'file:', pathname: '/foo/bar'},
    'test:///foo/bar': {protocol: 'test:', pathname: '/foo/bar'},
    // Host relative
    '/': {pathname: '/'},
    '/foo/bar': {pathname: '/foo/bar'},
    '/foo/bar?a=42': {pathname: '/foo/bar?a=42'},
    '/foo/bar?a=42#tag': {pathname: '/foo/bar?a=42#tag'},
    // Context relative
    '': {pathrelative: ''},
    'foo/bar': {pathrelative: 'foo/bar'},
    'foo/bar?a=42': {pathrelative: 'foo/bar?a=42'},
    'foo/bar#tag': {pathrelative: 'foo/bar#tag'},
    // Unexpected
    'example.com/foo/bar': {pathrelative: 'example.com/foo/bar'}
  };

  for (const url in examples) {
    if (examples.hasOwnProperty(url)) {
      const expected = examples[url];

      it(`should parse url "${url}" as ${JSON.stringify(expected)}`, () => {
        const value = parseUrl(url);
        expect(value).toEqual(expected);
      });
    }
  }
});
