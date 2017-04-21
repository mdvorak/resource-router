import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ApiMapper } from './api-url';
import { normalizeUrl } from './normalize';
import { NavigationHandler } from './navigation-handler';

// TODO normalize location.href

/**
 * It maps view URLs to API and vice versa.
 * Provides bindable `url` property, to be used with `resource-outlet` component.
 */
@Injectable()
export class ApiLocation implements NavigationHandler {

  private urlValue: string;

  constructor(private apiUrlService: ApiMapper,
              private location: Location) {
    this.location.subscribe(() => this.onLocationChanged());
    this.onLocationChanged();
  }

  /**
   * Resource URL that is being currently viewed.
   * Note: This should not be used to determine current data URL, since this always corresponds to the
   * primary view.
   *
   * @returns Resource URL that is being currently viewed.
   */
  get url(): string {
    return this.urlValue;
  }

  /**
   * Changes browser location (using configured strategy) to given resource url.
   *
   * * * If the `url` is not in the configured API namespace, error is logged and nothing happens.
   * * If the `url` equals to api prefix, it is performed redirect to page base href.
   *
   * @param url API url. The navigation in browser is performed to the `view URL`, that is, without API prefix.
   */
  set url(url: string) {
    // Normalize
    url = normalizeUrl(url);

    // Only on change
    if (url !== this.urlValue) {
      // Navigate
      this.go(url);

      // This prevents race-conditions, when value would be immediately read after being set,
      // and navigation has yet not been performed
      this.urlValue = url;
    }
  }

  // TODO this needs to issue outlet reload if url does not change, somehow
  go(url: string): void {
    if (typeof url !== 'string') {
      throw new Error('url must be a string');
    }

    const path = this.apiUrlService.mapApiToView(url);

    if (path) {
      this.location.go(path);
    } else {
      throw new Error(`Cannot navigate to URL '${url}', it cannot be mapped to the API prefix '${this.apiUrlService.prefix}'`);
    }
  }

  home(): void {
    // We don't need API url here, / leads to root of the api, always
    this.location.go('/');
  }

  /**
   * This is just wrapper around `Location.prepareExternalUrl` for convenience.
   *
   * @param url URL to be normalized for the link.
   * @returns {string} Normalized URL.
   */
  prepareExternalUrl(url: string): string {
    return this.location.prepareExternalUrl(url);
  }

  private onLocationChanged() {
    const path = this.location.path();

    // Store API url
    this.urlValue = this.apiUrlService.mapViewToApi(path);
  }
}
