import { ApiMapper } from './api-mapper';
import { MockApiUrl } from './testing/mock-api-url';

describe(ApiMapper.name, () => {
  let apiUrl: MockApiUrl;
  let apiMapper: ApiMapper;

  describe('without base-href', () => {
    beforeEach(() => {
      apiUrl = new MockApiUrl().init('test://localhost:42', '');
      apiMapper = new ApiMapper(apiUrl, 'my/api/');
    });

    it('should have relative prefix set to /my/api/', () => {
      expect(apiMapper.prefix).toBe('test://localhost:42/my/api/');
    });
  });
});
