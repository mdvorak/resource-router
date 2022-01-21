import { TestBed } from '@angular/core/testing';

import { TenderNamesResolver } from './tender-names.resolver';

describe('TenderNamesService', () => {
  let service: TenderNamesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenderNamesResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
