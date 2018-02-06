import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/switchMap';
import { ResourceViewRegistry } from './resource-view-registry';
import { ResourceClient } from './resource-client';
import { ViewData } from './view-data';
import { MEDIA_TYPE_ROUTER_EMPTY, MEDIA_TYPE_ROUTER_ERROR, MEDIA_TYPE_ROUTER_LOADING } from './system-media-types';
import { NO_HEADERS, ReadOnlyHeaders } from './read-only-headers';
import { Navigable } from './navigable';
import { LocationReference } from './location-reference';


@Injectable()
export class ResourceData implements Navigable, LocationReference {

  public readonly dataChange: Observable<ViewData<any>>;
  public readonly urlChange: Observable<string>;

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
    // Note: this.load is private and produces failing observable
    this.loadDataEvent
      .switchMap(url => {
        this.loadingValue = true;
        return this.load(url);
      })
      .finally(() => this.loadingValue = false)
      .subscribe(data => {
        // Update data
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
        .catch(err => {
          // Log it, this should not happen normally
          console.error(err);
          // Return error view
          return Observable.of(this.mockViewData(url, MEDIA_TYPE_ROUTER_ERROR, 999, 'Routing Error', NO_HEADERS, err));
        });
    } else {
      return Observable.of(this.mockViewData('', MEDIA_TYPE_ROUTER_EMPTY, 204, 'OK'));
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
      body: body
    };
  }
}