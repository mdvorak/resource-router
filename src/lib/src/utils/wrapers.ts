import { from, isObservable, Observable, of } from 'rxjs';
import { isPromise } from 'rxjs/internal-compatibility';

export function wrapIntoObservable<T>(v: T | Promise<T> | Observable<T>): Observable<T> {
  if (isObservable(v)) {
    return v;
  } else if (isPromise(v)) {
    return from(Promise.resolve(v));
  } else {
    return of(v);
  }
}
