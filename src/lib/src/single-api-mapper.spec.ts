import { MockUrlNormalizer } from 'angular-resource-router/testing';
import { SingleApiMapper } from './single-api-mapper';

describe(SingleApiMapper.name, () => {
  let apiUrl: MockUrlNormalizer;

  beforeEach(() => {
    apiUrl = new MockUrlNormalizer().init('test:', 'example.com', '/', '/context/');
  });

  it('should have prefix my/api/ resolved to http://example.com/context/my/api/', () => {
    const apiMapper = new SingleApiMapper(apiUrl, 'my/api/');
    expect(apiMapper.prefix).toBe('test://example.com/context/my/api/');
  });
});
