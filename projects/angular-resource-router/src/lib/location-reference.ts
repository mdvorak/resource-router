import { Observable, Subscription } from 'rxjs';

export interface LocationReference {
  url: string;
  urlChange: Observable<string>;
}

export const isLocationReference = (obj: any): obj is LocationReference => obj && 'url' in obj && obj.urlChange instanceof Observable;

export const bindUrl = (source: LocationReference, target: LocationReference): Subscription => {
  // Two-way binding, and return combined subscription for both
  const s = source.urlChange.subscribe(url => target.url = url);
  s.add(target.urlChange.subscribe(url => source.url = url));

  // Set initial value (urlChange will probably be cold - and if not, it should not invoke any action after subscribe)
  target.url = source.url;

  // Return subscription
  return s;
};
