import { Injectable } from '@angular/core';
import { BaseApiUrl } from 'angular-resource-router';

@Injectable()
export class MockApiUrl extends BaseApiUrl {

  internalLocationRoot = 'http://localhost';
  internalBaseHref = '/';

  init(locationRoot: string, baseHref: string) {
    this.internalLocationRoot = locationRoot;
    this.internalBaseHref = baseHref;

    return this;
  }

  getBaseHref(): string {
    return this.internalBaseHref;
  }

  getLocationRoot(): string {
    return this.internalLocationRoot;
  }
}
