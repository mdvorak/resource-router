import { Inject, Injectable } from '@angular/core';
import { DOCUMENT, LocationStrategy } from '@angular/common';
import { LocationInfo, parseUrl } from './utils/parse-url';


/**
 * Component for API URLs normalization.
 * Takes in account base-href, location etc.
 */
export abstract class UrlNormalizer {

  /**
   * Normalizes the URL, using current base-href.
   *
   * @param url URL to normalize. Might be relative, host-relative or protocol-relative.
   * @returns Normalized absolute URL.
   */
  abstract normalize(url: string): string;

}

/**
 * Generic implementation of ApiUrl.
 * Default is BrowserApiUrl.
 */
export abstract class BaseUrlNormalizer extends UrlNormalizer {

  normalize(url: string): string {
    // Analyze given URL - returns null when invalid
    const urlInfo = parseUrl(url);

    // Is url absolute?
    if (urlInfo && urlInfo.protocol) {
      // If so, just return original
      return url;
    }

    // Parse base
    const base = parseUrl(this.getBaseHref());
    const location = this.getLocation();

    // Relative paths must be combined, not replaced
    // Note: if URL contains pathname, it cannot contain pathrelative
    const pathrelative = !urlInfo.pathname ? (base.pathrelative || '') + (urlInfo.pathrelative || '') : '';

    // Build
    const n = {...location, ...base, ...urlInfo};
    return `${n.protocol}//${n.host}${n.pathname}${pathrelative}`;
  }

  /**
   * Returns base href.
   *
   * @returns Context path of the application. Protocol and host excluded.
   */
  abstract getBaseHref(): string;

  /**
   * Returns current location. It is used to resolve baseHref.
   *
   * @returns Context path of the application.
   */
  abstract getLocation(): LocationInfo;
}

@Injectable()
export class BrowserUrlNormalizer extends BaseUrlNormalizer {

  constructor(private readonly platformStrategy: LocationStrategy,
              @Inject(DOCUMENT)
              private readonly document: any) {
    super();
  }

  getBaseHref(): string {
    // Note: We are using LocationStrategy, instead of getDom().getBaseHref(), so it can be mocked during tests
    return this.platformStrategy.getBaseHref();
  }

  getLocation(): LocationInfo {
    return this.document.location;
  }
}
