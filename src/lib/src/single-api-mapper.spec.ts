import { MockApiUrl } from 'angular-resource-router/testing';
import { SingleApiMapper } from './single-api-mapper';

describe(SingleApiMapper.name, () => {
  let apiUrl: MockApiUrl;

  beforeEach(() => {
    apiUrl = new MockApiUrl().init('test:', 'example.com', '/', '/context/');
  });

  it('should have prefix my/api/ resolved to http://example.com/context/my/api/', () => {
    const apiMapper = new SingleApiMapper(apiUrl, 'my/api/');
    expect(apiMapper.prefix).toBe('test://example.com/context/my/api/');
  });
});
