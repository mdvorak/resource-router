import { ApiMapper } from './api-mapper';
import { MockApiUrl } from './testing/src/mock-api-url';

describe(ApiMapper.name, () => {
  let apiUrl: MockApiUrl;

  beforeEach(() => {
    apiUrl = new MockApiUrl().init('http://example.com', '/context/');
  });

  it('should have prefix my/api/ resolved to http://example.com/context/my/api/', () => {
    const apiMapper = new ApiMapper(apiUrl, 'my/api/');
    expect(apiMapper.prefix).toBe('test://localhost:42/my/api/');
  });
});
