import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ApiUrl } from './api-url';
import { ApiMapper } from './api-mapper';


/**
 * Prefix for the URL. Can be base-relative, host-relative or absolute.
 * Always should however end with slash ('/').
 *
 * @type {InjectionToken<string>}
 */
export const APP_API_PREFIX = new InjectionToken<string>('APP_API_PREFIX');


/**
 * It maps view URLs to API and vice versa.
 */
@Injectable()
export class SingleApiMapper extends ApiMapper {

  /**
   * API URL prefix. It's absolute URL, includes base href (if applicable).
   */
  readonly prefix: string;

  constructor(apiUrl: ApiUrl,
              @Inject(APP_API_PREFIX) prefix: string) {
    super();

    // Normalize prefix
    this.prefix = apiUrl.normalize(prefix);
  }

  mapViewToApi(path: string): string {
    // This is for diagnostics only, but might be useful
    if (/^\w+:/.test(path)) {
      throw new Error('path must be relative');
    }

    // Strip leading slash
    path = path.replace(/^\//, '');

    // Join
    // Note: API prefix MUST end with a slash, otherwise it will work as configured, which is most likely wrong.
    return (this.prefix + path).replace(/\/$/, '');
  }

  mapApiToView(url: string): string | null {
    // Remove prefix
    if (url.startsWith(this.prefix)) {
      // Strip prefix, prepend /, remove trailing /
      return '/' + url.substring(this.prefix.length).replace(/\/$/, '');
    }

    // Unable to map
    return null;
  }
}
