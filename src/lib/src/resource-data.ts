import { FactoryProvider, Injectable, Self } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ResourceViewRegistry } from './resource-view-registry';
import { ResourceClient } from './resource-client';
import { ViewData } from './view-data';
import { MEDIA_TYPE_ROUTER_EMPTY, MEDIA_TYPE_ROUTER_ERROR, MEDIA_TYPE_ROUTER_LOADING } from './system-media-types';
import { NO_HEADERS, ReadOnlyHeaders } from './read-only-headers';
import { makeNavigableRef, Navigable, NavigableRef } from './navigable';
import { LocationReference } from './location-reference';

/**
 * @internal
 */
let nextId = 1;

@Injectable()
export class ResourceData implements Navigable, LocationReference {

  public readonly dataChange: Observable<ViewData<any>>;
  public readonly urlChange: Observable<string>;

  // noinspection JSUnusedGlobalSymbols
  /**
   * Diagnostic identifier, not used by any logic.
   */
  public readonly id = nextId++;

  private urlValue = '';
  private loadingValue = false;
  private readonly dataChangeSource: BehaviorSubject<ViewData<any>>;
  private readonly urlChangeSource = new Subject<string>();
  private readonly loadDataEvent = new Subject<string>();

  constructor(public readonly client: ResourceClient,
              public readonly registry: ResourceViewRegistry) {
    // Initialize
    const initialData = this.mockViewData('', MEDIA_TYPE_ROUTER_LOADING, 204, 'OK');

    this.dataChangeSource = new BehaviorSubject<ViewData<any>>(initialData);
    this.dataChange = this.dataChangeSource.asObservable();

    this.urlChange = this.urlChangeSource.asObservable();

    // Using Subject in combination with switchMap allows us to easily use only latest value
    // Note: this.load is private and produces a never failing observable
    this.loadDataEvent
      .pipe(switchMap(url => {
        this.loadingValue = true;
        return this.load(url);
      }))
      .subscribe(data => {
        // Update data
        this.loadingValue = false;
        this.dataChangeSource.next(data);

        // This propagates back the actual url when server-side redirect was performed
        if (data.url !== this.urlValue) {
          this.urlValue = data.url;
          this.urlChangeSource.next(this.urlValue);
        }
      });
  }

  get loading() {
    return this.loadingValue;
  }

  get data(): ViewData<any> {
    return this.dataChangeSource.getValue();
  }

  get url(): string {
    return this.urlValue;
  }

  set url(value: string) {
    // Normalize undefined (possibly from binding) to empty string - don't rely on typescript
    if (!value) {
      value = '';
    }

    // Start load if value has actually changed
    if (this.urlValue !== value) {
      this.urlValue = value;
      this.loadDataEvent.next(value);
    }
  }

  go(url: string): void {
    // Update property if changed
    if (this.urlValue !== url) {
      this.urlValue = url;
      this.urlChangeSource.next(url);
    }

    // Load data (always)
    this.loadDataEvent.next(this.urlValue);
  }

  private load(url: string): Observable<ViewData<any>> {
    if (url) {
      return this.client
        .fetch(url, this)
        .pipe(catchError(err => {
          // Log it, this should not happen normally
          // Note: We are intentionally not using debugLog here - print this in production log as well
          console.error('Routing Error:', err);
          // Return error view
          return of(this.mockViewData(url, MEDIA_TYPE_ROUTER_ERROR, 999, 'Routing Error', NO_HEADERS, err));
        }));
    } else {
      return of(this.mockViewData('', MEDIA_TYPE_ROUTER_EMPTY, 204, 'OK'));
    }
  }

  private mockViewData(url: string, type: string, status: number, statusText: string,
                       headers?: ReadOnlyHeaders, body?: any): ViewData<any> {
    const config = this.registry.match(type, status);

    return {
      target: this,
      config: config,
      type: type,
      url: url,
      status: status,
      statusText: statusText,
      headers: headers || NO_HEADERS,
      body: body,
      resolve: {}
    };
  }
}


export function resourceDataNavigableRef(): FactoryProvider {
  return {
    provide: NavigableRef,
    useFactory: makeNavigableRef,
    deps: [[ResourceData, new Self()]]
  };
}
