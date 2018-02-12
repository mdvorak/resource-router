import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ApiMapper } from './api-mapper';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LocationReference } from './location-reference';

// TODO normalize URL, using possibly LocationStrategy (that means remove trailing slash directly in the browser if its present)

/**
 * It maps view URLs to API and vice versa.
 * Provides bindable `url` property, to be used with `resource-outlet` component.
 */
@Injectable()
export class ApiLocation implements LocationReference {

  readonly urlChange: Observable<string>;
  private readonly urlChangeSubject = new Subject<string>();
  private urlValue = '';

  constructor(private readonly apiMapper: ApiMapper,
              private readonly location: Location) {
    // Initialize
    this.urlChange = this.urlChangeSubject.asObservable();
    this.urlValue = this.mapLocationUrlToApi();

    // Listen to Location changes
    this.location.subscribe(() => this.onLocationChanged());
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
    if (typeof url !== 'string') {
      throw new Error('url must be a string');
    }

    // Normalize
    url = this.location.normalize(url);

    // Navigate only on change
    if (url !== this.urlValue) {
      // Map API url to View form
      const path = this.apiMapper.mapApiToView(url);
      if (!path) {
        throw new Error(`Cannot navigate to URL '${url}', it cannot be mapped to known API prefix`);
      }

      // Navigate
      this.doNavigate(path);
    }
  }

  /**
   * This is just wrapper around {@link Location#prepareExternalUrl()} for convenience.
   *
   * @param url URL to be normalized for the link.
   * @returns Normalized URL.
   */
  prepareExternalUrl(url: string): string {
    return this.location.prepareExternalUrl(url);
  }

  /**
   * Performs navigation to given view path.
   *
   * @param path View path to navigate to. Should be already mapped from API URL.
   */
  protected doNavigate(path: string) {
    // Push state if needed
    if (!this.location.isCurrentPathEqualTo(path)) {
      this.location.go(path);
    }

    // Update our url
    this.onLocationChanged();
  }

  /**
   * Takes current {@link Location#path()} and maps it to API url.
   * Might throw an {@link Error} if path() returns something unexpected, like null.
   *
   * @returns Mapped url. Never null.
   */
  protected mapLocationUrlToApi() {
    const path = this.location.path();
    return this.apiMapper.mapViewToApi(path);
  }

  /**
   * Updates `currentUrl` and fires next value for `url` observable.
   */
  protected onLocationChanged() {
    this.urlValue = this.mapLocationUrlToApi();
    this.urlChangeSubject.next(this.urlValue);
  }
}
