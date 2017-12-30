import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { ResourceViewRegistry } from './resource-view-registry';
import { ViewTypeStrategy } from './view-type-strategy';
import { ViewData } from './view-data';
import { ViewDef } from './view-definition';
import { NavigationHandler } from './navigation-handler';
import { stringToJSON } from './utils/http-utils';


/**
 * Component that retrieves the data for given URL.
 */
export abstract class ViewDataLoader {

  /**
   * Retrieves the data.
   *
   * @param {string} uri URI the data should be retrieved from. Usually it is URL for HTTP request.
   * @param {NavigationHandler} navigation NavigationHandler instance, to be passed to ViewData constructor.
   * @returns {Observable<ViewData<any>>} Retrieved ViewData instance.
   */
  abstract fetch(uri: string, navigation: NavigationHandler): Observable<ViewData<any>>;

}

/**
 * Default ViewDataLoader implementation, which uses HttpClient as backend.
 */
@Injectable()
export class HttpClientViewDataLoader extends ViewDataLoader {

  constructor(public strategy: ViewTypeStrategy,
              public registry: ResourceViewRegistry,
              public http: HttpClient) {
    super();
  }

  fetch(uri: string, navigation: NavigationHandler): Observable<ViewData<any>> {
    // Send request
    return this
      .get(uri)
      // Swallow errors, treat them as normal response
      .catch(response => Observable.of(response))
      // This might throw exception, e.g. when response is malformed - it produces failed Observable then
      .map(response => this.resolve(uri, response, navigation));
  }

  protected get(url: string): Observable<HttpResponse<string>> {
    // Note: We need to set responseType to text, because if set to json,
    // Angular will return error when response is not a valid JSON - We will rather parse it here.
    // Its not nice, since we are duplicating bit of HttpClient, but I'm not aware of other way
    return this.http.get(url, {observe: 'response', responseType: 'text'});
  }

  protected resolve(requestUrl: string, response: HttpResponse<string>, navigation: NavigationHandler): ViewData<any> {
    // Resolve type, if possible
    const type = this.strategy.extractType(response) || '';
    // Find view
    const config = this.registry.match(type, response.status);
    // Parse body
    const body = this.parse(response, config);

    // Construct and return ViewData
    return new ViewData<any>(
      navigation,
      config,
      type,
      response.url || requestUrl,
      response.status,
      response.statusText,
      response.headers,
      body,
    );
  }

  // noinspection JSMethodCanBeStatic
  protected parse(response: HttpResponse<string>, config: ViewDef): any | null {
    // Don't parse null
    if (response.body === null) {
      return null;
    }

    const responseType = config.responseType || 'json';
    switch (responseType) {
      case 'json':
        // Parse JSON - this assumes body is a string
        return stringToJSON(response.body);

      case 'text':
        // Return as-is - this assumes body is already string
        return response.body;

      default:
        throw new Error(`Unsupported responseType: ${responseType}`);
    }
  }
}