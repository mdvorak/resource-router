import { ɵisObservable as isObservable, ɵisPromise as isPromise } from '@angular/core';
import { from, Observable, of } from 'rxjs';

export const wrapIntoObservable = <T>(v: T | Promise<T> | Observable<T>): Observable<T> => {
  if (isObservable(v)) {
    return v;
  } else if (isPromise(v)) {
    return from(Promise.resolve(v));
  } else {
    return of(v);
  }
};
