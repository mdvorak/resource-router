import { Navigable } from './navigable';
import { Observable } from 'rxjs/Observable';
import { ViewData } from './view-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class ActivatedView<T> {

  public readonly data: Observable<ViewData<T>>;
  public readonly body: Observable<T>;

  constructor(public readonly navigation: Navigable,
              private readonly _data: BehaviorSubject<ViewData<T>>) {
    this.data = _data.asObservable();
    this.body = this.data.map(data => data.body);
  }

  get snapshot() {
    return this._data.getValue();
  }

  /**
   * Forces reload of the data (remaining on the current URL).
   *
   * This is identical to calling {@code activatedView.navigation.go(activatedView.snapshot.url)}.
   */
  reload(): void {
    this.navigation.go(this.snapshot.url);
  }
}
