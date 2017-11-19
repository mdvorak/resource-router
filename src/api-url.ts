import { Inject, Injectable } from '@angular/core';
import { DOCUMENT, LocationStrategy } from '@angular/common';

export abstract class ApiUrl {

  abstract normalize(url: string): string;
}

export abstract class BaseApiUrl extends ApiUrl {

  normalize(url: string): string {
    // Is url absolute?
    if (/^\w+:/.test(url)) {
      // If so, just return it
      return url;
    }

    // Is url base href relative?
    if (url[0] !== '/') {
      // Prepend base href
      url = this.getBaseHref() + url;
    }

    // Make sure we have leading slash
    if (url[0] !== '/') {
      url = '/' + url;
    }

    // Prepend protocol and host
    const host = this.getFullHost();
    return host + url;
  }

  /**
   * Returns base href.
   *
   * @returns {string} Context path of the application. Protocol and host excluded.
   */
  abstract getBaseHref(): string;

  /**
   * Returns protocol and host.
   * Example: `https://localhost:4200`.
   *
   * @returns {string} Protocol and host as `protocol://host:port`.
   */
  abstract getFullHost(): string;
}

@Injectable()
export class BrowserApiUrl extends BaseApiUrl {

  constructor(private platformStrategy: LocationStrategy,
              @Inject(DOCUMENT)
              private document: Document) {
    super();
  }

  getBaseHref(): string {
    // Note: We are using LocationStrategy, instead of getDom().getBaseHref(), so it can be mocked during tests
    return this.platformStrategy.getBaseHref();
  }

  getFullHost(): string {
    const location = this.document.location;
    return `${location.protocol}//${location.host}`;
  }
}
