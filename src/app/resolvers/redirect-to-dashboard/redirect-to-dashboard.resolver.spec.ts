import { TestBed } from '@angular/core/testing';

import { RedirectToDashboardResolver } from './redirect-to-dashboard.resolver';

describe('TenderNamesService', () => {
  let service: RedirectToDashboardResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedirectToDashboardResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
