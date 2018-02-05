import {Observable} from 'rxjs/Observable';

export interface Navigable {

  go(url: string): void;
}

export function supportsNavigation(obj: any): obj is Navigable {
  return obj && typeof obj.go === 'function';
}

export interface NavigationSource {

  navigate: Observable<string>;

}
