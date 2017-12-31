import { Navigable } from './navigable';
import { Observable } from 'rxjs/Observable';
import { ViewData } from './view-data';

export class ActivatedView<T> {

  constructor(public readonly navigation: Navigable,
              public readonly data: Observable<ViewData<T>>) {
  }
}
