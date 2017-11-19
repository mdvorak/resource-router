import { Inject, Injectable } from '@angular/core';
import { DOCUMENT, LocationStrategy } from '@angular/common';

const ABSOLUTE_URL_PATTERN = /^\w+:/;

export abstract class ApiUrl {

  abstract normalize(url: string): string;

}

export abstract class BaseApiUrl extends ApiUrl {

  normalize(url: string): string {
    // Is url absolute?
    if (ABSOLUTE_URL_PATTERN.test(url)) {
      // If so, just return it
      return url;
    }

    const baseHref = this.getBaseHref();

    // If base href is absolute
    if (ABSOLUTE_URL_PATTERN.test(baseHref)) {
      // And if url is absolutely relative
      if (url[0] === '/') {
        // Extract location root from the base tag
        // Note: we already tested url for being absolute, this should not return null
        const baseRoot = (baseHref.match(/^(\w+:\/\/[^/]*)/) || [])[0];
        // And combine it with the url
        return baseRoot + url;
      } else {
        // Url is relative (does not start with /), combine it with base href and return
        return baseHref + url;
      }
    } else if (url[0] !== '/') {
      // Url is relative, prepend base href
      url = baseHref + url;
    }

    // Make sure we have leading slash (base href does not have to include one)
    if (url[0] !== '/') {
      url = '/' + url;
    }

    // Prepend protocol and host
    return this.getLocationRoot() + url;
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
  abstract getLocationRoot(): string;
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

  getLocationRoot(): string {
    const location = this.document.location;
    return `${location.protocol}//${location.host}`;
  }
}
