import { Injectable } from '@angular/core';
import { normalizeMediaType } from './utils/normalize-media-type';
import { ReadOnlyHeaders } from './read-only-headers';

/**
 * Helper interface with subset of HttpResponse fields, for better abstraction.
 */
export interface ViewTypeResponse {
  /**
   * All response headers.
   */
  readonly headers: ReadOnlyHeaders;
  /**
   * Response status code.
   */
  readonly status: number;
  /**
   * The response body, or `null` if one was not returned.
   */
  readonly body: any;
}

export abstract class ViewTypeStrategy {

  /**
   * Extracts type from the server response, understandable by application.
   * Default implementation uses `Content-Type` header.
   *
   * @param {ViewTypeResponse} response Actual response.
   * @returns {string} Found response type. Null if not found.
   */
  abstract extractType(response: ViewTypeResponse): string | null;
}

/**
 * Extracts type from the HTTP header. By default its `Content-Type`.
 */
@Injectable()
export class HeaderViewTypeStrategy implements ViewTypeStrategy {

  protected headerName = 'content-type';

  extractType(response: ViewTypeResponse): string | null {
    const contentType = response.headers ? response.headers.get(this.headerName) : null;
    return contentType ? this.normalizeMediaType(contentType) : null;
  }

  //noinspection JSMethodCanBeStatic
  normalizeMediaType(contentType: string): string {
    // This is overridable
    return normalizeMediaType(contentType);
  }
}
