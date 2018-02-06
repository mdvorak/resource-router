import { Injectable } from '@angular/core';
import { BaseUrlNormalizer, LocationInfo } from 'angular-resource-router';

@Injectable()
export class MockUrlNormalizer extends BaseUrlNormalizer {

  internalProtocol = 'http:';
  internalHost = 'localhost';
  internalPathname = '/';
  internalBaseHref = '';

  init(protocol: string, host: string, pathname: string, baseHref: string) {
    this.internalProtocol = protocol;
    this.internalHost = host;
    this.internalPathname = pathname;
    this.internalBaseHref = baseHref;

    return this;
  }

  getBaseHref(): string {
    return this.internalBaseHref;
  }

  getLocation(): LocationInfo {
    return {
      protocol: this.internalProtocol,
      host: this.internalHost,
      pathname: this.internalPathname
    };
  }
}
