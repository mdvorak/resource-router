import { ViewDef } from './view-definition';
import { ReadOnlyHeaders } from './read-only-headers';
import { Navigable } from './navigable';


export interface ViewData<T> {

  readonly target: Navigable;
  readonly config: ViewDef;
  readonly type: string;
  readonly url: string;
  readonly status: number;
  readonly statusText: string;
  readonly headers: ReadOnlyHeaders;
  readonly body: T;

}
