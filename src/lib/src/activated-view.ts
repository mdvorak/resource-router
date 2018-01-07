import { Navigable } from './navigable';
import { Observable } from 'rxjs/Observable';
import { ViewData } from './view-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class ActivatedView<T> {

  public readonly data: Observable<ViewData<T>>;

  constructor(public readonly navigation: Navigable,
              private readonly _data: BehaviorSubject<ViewData<T>>) {
    this.data = _data.asObservable();
  }

  get snapshot() {
    return this._data.getValue();
  }
}
