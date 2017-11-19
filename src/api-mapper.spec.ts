import { ApiMapper } from './api-mapper';
import { Location, LocationStrategy } from '@angular/common';
import { MockLocationStrategy } from '@angular/common/testing';

describe(ApiMapper.name, () => {
  let platformStrategy: LocationStrategy;
  let location: Location;
  let apiMapper: ApiMapper;

  beforeEach(() => {
    platformStrategy = new MockLocationStrategy();
    location = new Location(platformStrategy);
    apiMapper = new ApiMapper('my/api/', platformStrategy, location);
  });

  describe('without base-href', () => {
    it('should have relative prefix set to /my/api/', () => {
      // TODO
      expect(new ApiMapper('my/api/', platformStrategy, location).prefix).toBe('my/api/');
    });
  });
});
