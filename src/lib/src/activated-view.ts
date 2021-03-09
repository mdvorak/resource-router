import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Navigable } from './navigable';
import { ViewData } from './view-data';
import { ResolveData } from './view-definition';

export class ActivatedView<T> {

  public readonly data: Observable<ViewData<T>>;
  public readonly body: Observable<T>;
  public readonly resolve: Observable<ResolveData>;


  constructor(public readonly navigation: Navigable,
              private readonly _data: BehaviorSubject<ViewData<T>>) {
    this.data = _data.asObservable();
    this.body = this.data.pipe(map(data => data.body));
    this.resolve = this.data.pipe(map(data => data.resolve));
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
