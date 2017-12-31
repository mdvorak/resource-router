import { ViewDef } from './view-definition';
import { ReadOnlyHeaders } from './read-only-headers';
import { Navigable } from './navigable';


export class ViewData<T> {

  constructor(public readonly source: Navigable,
              public readonly config: ViewDef,
              public readonly type: string,
              public readonly url: string,
              public readonly status: number,
              public readonly statusText: string | null,
              public readonly headers: ReadOnlyHeaders,
              public readonly body: T) {
  }
}
