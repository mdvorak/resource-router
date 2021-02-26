import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ResourceViewRegistry } from './resource-view-registry';
import { ViewTypeStrategy } from './view-type-strategy';
import { ViewData } from './view-data';
import { ViewDef } from './view-definition';
import { Navigable } from './navigable';
import { stringToJSON } from './utils/http-utils';
import { throwError } from 'rxjs';


/**
 * Component that retrieves the data for given URL.
 */
export abstract class ResourceClient {

  /**
   * Retrieves the data.
   *
   * @param uri URI the data should be retrieved from. Usually it is URL for HTTP request.
   * @param target Navigable instance, to be passed to ViewData constructor.
   * @returns Retrieved ViewData instance.
   */
  abstract fetch(uri: string, target: Navigable): Observable<ViewData<any>>;

}

/**
 * Default ResourceClient implementation, which uses HttpClient as backend.
 */
@Injectable()
export class HttpResourceClient extends ResourceClient {

  constructor(public readonly strategy: ViewTypeStrategy,
              public readonly registry: ResourceViewRegistry,
              public readonly http: HttpClient) {
    super();
  }

  fetch(uri: string, target: Navigable): Observable<ViewData<any>> {
    // Send request
    return this.get(uri).pipe(
      // Convert failure to success, if we know how to handle it (rethrow if we don't)
      catchError(err => this.handleError(err)),
      // This might throw exception, e.g. when response is malformed - it produces failed Observable then
      map(response => this.resolve(uri, response, target)),
    );
  }

  protected get(url: string): Observable<HttpResponse<string>> {
    // Note: We need to set responseType to text, because if set to json,
    // Angular will return error when response is not a valid JSON - We will rather parse it here.
    // Its not nice, since we are duplicating bit of HttpClient, but I'm not aware of other way
    return this.http.get(url, {observe: 'response', responseType: 'text'});
  }

  // noinspection JSMethodCanBeStatic
  protected handleError(err: any): Observable<HttpResponse<string>> {
    // Depends on the type
    if (err instanceof HttpResponse) {
      // Pass it through
      return of(err);
    }
    // noinspection SuspiciousInstanceOfGuard
    if (err instanceof HttpErrorResponse) {
      let body: string | undefined;

      if (!err.error) {
        // No body provided, fallback to response error message
        body = err.message;
      } else if (typeof err.error.message === 'string') {
        // Network failures and such
        // err.error might be either Error or ErrorEvent, both having message property
        body = err.error.message;
      } else if (typeof err.error === 'string') {
        // Generic error, usually returned by server as response body
        // This assumes that since we used responseType:'text', error (body) should be un-parsed string as well
        // Note: We don't handle json parse errors, since these should not happen
        body = err.error;
      } else {
        // To avoid returning something unexpected, better to rethrow the error
        return throwError(err);
      }

      // Treat is as non-failing response
      return of(new HttpResponse<string>({
        body: body,
        headers: err.headers,
        status: err.status,
        statusText: err.statusText,
        url: err.url || undefined
      }));
    } else {
      // Other errors propagate (resolve won't be called)
      return throwError(err);
    }
  }

  protected resolve(requestUrl: string, response: HttpResponse<string>, target: Navigable): ViewData<any> {
    // Note: In browsers, this does not throw exception, in NodeJS, it does
    // noinspection SuspiciousInstanceOfGuard
    console.assert(response instanceof HttpResponse, 'response is not instanceof HttpResponse', response);

    // Resolve type, if possible
    const type = this.strategy.extractType(response) || '';
    // Find view
    const config = this.registry.match(type, response.status);
    // Parse body
    const body = this.parse(response.body, config);

    // Construct and return ViewData
    return {
      target: target,
      config: config,
      type: type,
      url: response.url || requestUrl,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: body,
      resolve: {}
    };
  }

  // noinspection JSMethodCanBeStatic
  protected parse(body: string | null, config: ViewDef): any | null {
    // Don't parse empty body
    if (!body) {
      return null;
    }

    const responseType = config.responseType || 'json';
    switch (responseType) {
      case 'json':
        // Parse JSON - unless body is already object, otherwise we expect string
        return typeof body === 'object' ? body : stringToJSON(body);

      case 'text':
        // Return as-is - this assumes body is already string
        return body;

      default:
        throw new Error(`Unsupported responseType: ${responseType}`);
    }
  }
}
