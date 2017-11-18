import { stringToJSON } from './http-utils';

describe('HttpUtils', () => {
  describe(stringToJSON.name, () => {
    it('should parse json', () => {
      expect(stringToJSON('{"foo":"bar", "goo":54}')).toEqual({foo: 'bar', goo: 54});
    });

    it('should remove XSSI prefix', () => {
      expect(stringToJSON(')]}\'\n{"foo":"bar", "goo":54}')).toEqual({foo: 'bar', goo: 54});
    });

    it('should throw error on invalid JSON', () => {
      expect(() => stringToJSON('{{{')).toThrow();
    });
  });
});
