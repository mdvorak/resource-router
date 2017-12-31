import { ViewDef } from './view-definition';
import { ReadOnlyHeaders } from './read-only-headers';
import { Navigable } from './navigable';


export interface ViewData<T> {

  readonly source: Navigable;
  readonly config: ViewDef;
  readonly type: string;
  readonly url: string;
  readonly status: number;
  readonly statusText: string | null;
  readonly headers: ReadOnlyHeaders;
  readonly body: T;

}
