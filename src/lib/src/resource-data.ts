import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { ResourceViewRegistry } from './resource-view-registry';
import { ResourceClient } from './resource-client';
import { ViewData } from './view-data';
import { MEDIA_TYPE_ROUTER_EMPTY, MEDIA_TYPE_ROUTER_ERROR } from './system-media-types';
import { Observable } from 'rxjs/Observable';
import { NO_HEADERS } from './read-only-headers';
import { Injectable } from '@angular/core';

@Injectable()
export class ResourceData {

  public readonly urlChange = new Subject<string>();

  private loadingValue = false;
  private data: ViewData<any>;
  private urlValue = '';

  private readonly loadDataEvent = new Subject<string>();

  constructor(public readonly client: ResourceClient,
              public readonly registry: ResourceViewRegistry) {
    // Note: this.load never fails
    this.loadDataEvent
      .switchMap(url => {
        this.loadingValue = true;
        return this.load(url);
      })
      .subscribe(data => {
        // Update data
        this.loadingValue = false;
        this.data = data;
        // TODO observable?

        // This propagates back the actual url when server-side redirect was performed
        if (data.url !== this.urlValue) {
          this.urlValue = data.url;
          this.urlChange.next(this.urlValue);
        }
      });
  }

  set url(value: string) {
    // Normalize undefined (from binding) to empty string
    // TODO this might break binding change detection
    if (!value) {
      value = '';
    }

    // Emit event if value has actually changed
    if (this.urlValue !== value) {
      this.urlValue = value;
      this.loadDataEvent.next(value);
    }
  }

  get url(): string {
    return this.urlValue;
  }

  navigate(url: string): void {
    // Update property if changed
    if (this.urlValue !== url) {
      this.urlValue = url;
      this.urlChange.next(url);
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
          return Observable.of(this.mockViewData(url, MEDIA_TYPE_ROUTER_ERROR, 999, 'Routing Error', err));
        });
    } else {
      return Observable.of(this.mockViewData('', MEDIA_TYPE_ROUTER_EMPTY, 204, 'OK'));
    }
  }

  private mockViewData(url: string, type: string, status: number, statusText: string, body?: any): ViewData<any> {
    const config = this.registry.match(type, status);

    return {
      source: this,
      config: config,
      type: type,
      url: url,
      status: status,
      statusText: statusText,
      headers: NO_HEADERS,
      body: body
    };
  }
}
