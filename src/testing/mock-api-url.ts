import { Injectable } from '@angular/core';
import { BaseApiUrl } from '../api-url';

@Injectable()
export class MockApiUrl extends BaseApiUrl {

  internalFullHost = 'http://localhost';
  internalBaseHref = '/';

  // noinspection JSUnusedGlobalSymbols
  init(fullHost: string, baseHref: string) {
    this.internalFullHost = fullHost;
    this.internalBaseHref = baseHref;

    return this;
  }

  getBaseHref(): string {
    return this.internalBaseHref;
  }

  getFullHost(): string {
    return this.internalFullHost;
  }
}
