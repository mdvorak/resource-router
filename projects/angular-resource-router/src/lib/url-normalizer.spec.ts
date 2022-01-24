import { MockUrlNormalizer } from 'angular-resource-router/testing';
import { UrlNormalizer } from './url-normalizer';

describe(UrlNormalizer.name, () => {
  let urlNormalizer: MockUrlNormalizer;

  describe('without base-href', () => {
    beforeEach(() => {
      urlNormalizer = new MockUrlNormalizer().init('test:', 'localhost:42', '/', '');
    });

    it('should have prefix my/api/ resolved to test://localhost:42/my/api/', () => {
      const value = urlNormalizer.normalize('my/api/');
      expect(value).toBe('test://localhost:42/my/api/');
    });

    it('should have prefix /my/api/ resolved to test://localhost:42/my/api/', () => {
      const value = urlNormalizer.normalize('/my/api/');
      expect(value).toBe('test://localhost:42/my/api/');
    });

    it('should have prefix //some.example.com/my/api/ resolved to test://some.example.com/my/api/', () => {
      const value = urlNormalizer.normalize('//some.example.com/my/api/');
      expect(value).toBe('test://some.example.com/my/api/');
    });

    it('should have prefix file:///tmp/my/api/ resolved to file:///tmp/my/api/', () => {
      const value = urlNormalizer.normalize('file:///tmp/my/api/');
      expect(value).toBe('file:///tmp/my/api/');
    });
  });

  describe('with base-href context/', () => {
    beforeEach(() => {
      urlNormalizer = new MockUrlNormalizer().init('test:', 'localhost:42', '/', 'context/');
    });

    it('should have prefix my/api/ resolved to test://localhost:42/context/my/api/', () => {
      const value = urlNormalizer.normalize('my/api/');
      expect(value).toBe('test://localhost:42/context/my/api/');
    });

    it('should have prefix /my/api/ resolved to test://localhost:42/my/api/', () => {
      const value = urlNormalizer.normalize('/my/api/');
      expect(value).toBe('test://localhost:42/my/api/');
    });

    it('should have prefix //some.example.com/my/api/ resolved to test://some.example.com/my/api/', () => {
      const value = urlNormalizer.normalize('//some.example.com/my/api/');
      expect(value).toBe('test://some.example.com/my/api/');
    });

    it('should have prefix file:///tmp/my/api/ resolved to file:///tmp/my/api/', () => {
      const value = urlNormalizer.normalize('file:///tmp/my/api/');
      expect(value).toBe('file:///tmp/my/api/');
    });
  });

  describe('with base-href context', () => {
    beforeEach(() => {
      urlNormalizer = new MockUrlNormalizer().init('test:', 'localhost:42', '/', 'context');
    });

    it('should have prefix my/api/ resolved to test://localhost:42/contextmy/api/', () => {
      const value = urlNormalizer.normalize('my/api/');
      expect(value).toBe('test://localhost:42/contextmy/api/');
    });

    it('should have prefix /my/api/ resolved to test://localhost:42/my/api/', () => {
      const value = urlNormalizer.normalize('/my/api/');
      expect(value).toBe('test://localhost:42/my/api/');
    });

    it('should have prefix //some.example.com/my/api/ resolved to test://some.example.com/my/api/', () => {
      const value = urlNormalizer.normalize('//some.example.com/my/api/');
      expect(value).toBe('test://some.example.com/my/api/');
    });

    it('should have prefix file:///tmp/my/api/ resolved to file:///tmp/my/api/', () => {
      const value = urlNormalizer.normalize('file:///tmp/my/api/');
      expect(value).toBe('file:///tmp/my/api/');
    });
  });

  describe('with base-href /context/', () => {
    beforeEach(() => {
      urlNormalizer = new MockUrlNormalizer().init('test:', 'localhost:42', '/', '/context/');
    });

    it('should have prefix my/api/ resolved to test://localhost:42/context/my/api/', () => {
      const value = urlNormalizer.normalize('my/api/');
      expect(value).toBe('test://localhost:42/context/my/api/');
    });

    it('should have prefix /my/api/ resolved to test://localhost:42/my/api/', () => {
      const value = urlNormalizer.normalize('/my/api/');
      expect(value).toBe('test://localhost:42/my/api/');
    });

    it('should have prefix //some.example.com/my/api/ resolved to test://some.example.com/my/api/', () => {
      const value = urlNormalizer.normalize('//some.example.com/my/api/');
      expect(value).toBe('test://some.example.com/my/api/');
    });

    it('should have prefix file:///tmp/my/api/ resolved to file:///tmp/my/api/', () => {
      const value = urlNormalizer.normalize('file:///tmp/my/api/');
      expect(value).toBe('file:///tmp/my/api/');
    });
  });

  describe('with base-href http://example.com/context/', () => {
    beforeEach(() => {
      urlNormalizer = new MockUrlNormalizer().init('test:', 'localhost:42', '/', 'http://example.com/context/');
    });

    it('should have prefix my/api/ resolved to http://example.com/context/my/api/', () => {
      const value = urlNormalizer.normalize('my/api/');
      expect(value).toBe('http://example.com/context/my/api/');
    });

    it('should have prefix /my/api/ resolved to http://example.com/my/api/', () => {
      const value = urlNormalizer.normalize('/my/api/');
      expect(value).toBe('http://example.com/my/api/');
    });

    it('should have prefix //some.example.com/my/api/ resolved to http://some.example.com/my/api/', () => {
      const value = urlNormalizer.normalize('//some.example.com/my/api/');
      expect(value).toBe('http://some.example.com/my/api/');
    });

    it('should have prefix file:///tmp/my/api/ resolved to file:///tmp/my/api/', () => {
      const value = urlNormalizer.normalize('file:///tmp/my/api/');
      expect(value).toBe('file:///tmp/my/api/');
    });
  });

  describe('with base-href //example.com/context/', () => {
    beforeEach(() => {
      urlNormalizer = new MockUrlNormalizer().init('test:', 'localhost:42', '/', '//example.com/context/');
    });

    it('should have prefix my/api/ resolved to test://example.com/context/my/api/', () => {
      const value = urlNormalizer.normalize('my/api/');
      expect(value).toBe('test://example.com/context/my/api/');
    });

    it('should have prefix /my/api/ resolved to test://example.com/my/api/', () => {
      const value = urlNormalizer.normalize('/my/api/');
      expect(value).toBe('test://example.com/my/api/');
    });

    // TODO verify his is correct
    it('should have prefix //some.example.com/my/api/ resolved to test://some.example.com/my/api/', () => {
      const value = urlNormalizer.normalize('//some.example.com/my/api/');
      expect(value).toBe('test://some.example.com/my/api/');
    });

    it('should have prefix file:///tmp/my/api/ resolved to file:///tmp/my/api/', () => {
      const value = urlNormalizer.normalize('file:///tmp/my/api/');
      expect(value).toBe('file:///tmp/my/api/');
    });
  });
});
