import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

export interface LocationReference {
  url: string;
  urlChange: Observable<string>;
}

export function isLocationReference(obj: any): obj is LocationReference {
  return obj && 'url' in obj && obj.urlChange instanceof Observable;
}

export function bindUrl(source: LocationReference, target: LocationReference): Subscription {
  // Two-way binding, and return combined subscription for both
  let s = source.urlChange.subscribe(url => target.url = url);
  s = s.add(target.urlChange.subscribe(url => source.url = url));

  // Set initial value (urlChange will probably be cold - and if not, it should not invoke any action after subscribe)
  target.url = source.url;

  // Return subscription
  return s;
}
