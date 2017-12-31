import { ViewDef } from './view-definition';
import { NavigationHandler } from './navigation-handler';


export interface ReadOnlyHeaders {
  /**
   * Checks for existence of header by given name.
   */
  has(name: string): boolean;

  /**
   * Returns first header that matches given name.
   */
  get(name: string): string | null;

  /**
   * Returns the names of the headers
   */
  keys(): string[];

  /**
   * Returns list of header values for a given name.
   */
  getAll(name: string): string[] | null;
}

// noinspection JSUnusedLocalSymbols
export const NO_HEADERS: ReadOnlyHeaders = {
  has(name: string): boolean {
    return false;
  },

  get(name: string): string | null {
    return null;
  },

  keys(): string[] {
    return [];
  },

  getAll(name: string): string[] | null {
    return null;
  }
};

export class ViewData<T> {

  constructor(public readonly navigation: NavigationHandler,
              public readonly config: ViewDef,
              public readonly type: string,
              public readonly url: string,
              public readonly status: number,
              public readonly statusText: string | null,
              public readonly headers: ReadOnlyHeaders,
              public readonly body?: T) {
  }
}
