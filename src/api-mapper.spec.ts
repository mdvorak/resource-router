import { ApiMapper } from './api-mapper';
import { MockApiUrl } from './testing/src/mock-api-url';

describe(ApiMapper.name, () => {
  let apiUrl: MockApiUrl;

  describe('without base-href', () => {
    beforeEach(() => {
      apiUrl = new MockApiUrl().init('test://localhost:42', '');
    });

    it('should have prefix my/api/ resolved to test://localhost:42/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, 'my/api/');
      expect(apiMapper.prefix).toBe('test://localhost:42/my/api/');
    });

    it('should have prefix /my/api/ resolved to test://localhost:42/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, '/my/api/');
      expect(apiMapper.prefix).toBe('test://localhost:42/my/api/');
    });

    it('should have prefix file:///tmp/my/api/ resolved to file:///tmp/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, 'file:///tmp/my/api/');
      expect(apiMapper.prefix).toBe('file:///tmp/my/api/');
    });
  });

  describe('with base-href context/', () => {
    beforeEach(() => {
      apiUrl = new MockApiUrl().init('test://localhost:42', 'context/');
    });

    it('should have prefix my/api/ resolved to test://localhost:42/context/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, 'my/api/');
      expect(apiMapper.prefix).toBe('test://localhost:42/context/my/api/');
    });

    it('should have prefix /my/api/ resolved to test://localhost:42/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, '/my/api/');
      expect(apiMapper.prefix).toBe('test://localhost:42/my/api/');
    });

    it('should have prefix file:///tmp/my/api/ resolved to file:///tmp/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, 'file:///tmp/my/api/');
      expect(apiMapper.prefix).toBe('file:///tmp/my/api/');
    });
  });

  describe('with base-href context', () => {
    beforeEach(() => {
      apiUrl = new MockApiUrl().init('test://localhost:42', 'context');
    });

    it('should have prefix my/api/ resolved to test://localhost:42/contextmy/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, 'my/api/');
      expect(apiMapper.prefix).toBe('test://localhost:42/contextmy/api/');
    });

    it('should have prefix /my/api/ resolved to test://localhost:42/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, '/my/api/');
      expect(apiMapper.prefix).toBe('test://localhost:42/my/api/');
    });

    it('should have prefix file:///tmp/my/api/ resolved to file:///tmp/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, 'file:///tmp/my/api/');
      expect(apiMapper.prefix).toBe('file:///tmp/my/api/');
    });
  });

  describe('with base-href /context/', () => {
    beforeEach(() => {
      apiUrl = new MockApiUrl().init('test://localhost:42', '/context/');
    });

    it('should have prefix my/api/ resolved to test://localhost:42/context/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, 'my/api/');
      expect(apiMapper.prefix).toBe('test://localhost:42/context/my/api/');
    });

    it('should have prefix /my/api/ resolved to test://localhost:42/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, '/my/api/');
      expect(apiMapper.prefix).toBe('test://localhost:42/my/api/');
    });

    it('should have prefix file:///tmp/my/api/ resolved to file:///tmp/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, 'file:///tmp/my/api/');
      expect(apiMapper.prefix).toBe('file:///tmp/my/api/');
    });
  });

  describe('with base-href http://example.com/context/', () => {
    beforeEach(() => {
      apiUrl = new MockApiUrl().init('test://localhost:42', 'http://example.com/context/');
    });

    it('should have prefix my/api/ resolved to http://example.com/context/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, 'my/api/');
      expect(apiMapper.prefix).toBe('http://example.com/context/my/api/');
    });

    it('should have prefix /my/api/ resolved to http://example.com/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, '/my/api/');
      expect(apiMapper.prefix).toBe('http://example.com/my/api/');
    });

    it('should have prefix file:///tmp/my/api/ resolved to file:///tmp/my/api/', () => {
      const apiMapper = new ApiMapper(apiUrl, 'file:///tmp/my/api/');
      expect(apiMapper.prefix).toBe('file:///tmp/my/api/');
    });
  });
});
