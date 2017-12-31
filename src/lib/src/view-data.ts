import { ViewDef } from './view-definition';
import { NavigationHandler } from './navigation-handler';
import { ReadOnlyHeaders } from './read-only-headers';


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
