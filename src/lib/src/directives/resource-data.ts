import { Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { ViewDataLoader } from '../view-data-loader';
import { NO_HEADERS, ViewData } from '../view-data';
import { NavigationHandler } from '../navigation-handler';
import { ResourceViewRegistry } from '../resource-view-registry';
import { MEDIA_TYPE_ROUTER_EMPTY, MEDIA_TYPE_ROUTER_ERROR, MEDIA_TYPE_ROUTER_LOADING } from '../system-media-types';
import { Subject } from 'rxjs/Subject';


export class ResourceDataContext {
  constructor(public $implicit: ViewData<any>) {
  }
}


@Directive({
  selector: '[resourceData][resourceDataOf]'
})
export class ResourceDataDirective implements OnInit, NavigationHandler {

  @Output()
  readonly urlChange = new EventEmitter<string>();

  private urlValue = '';
  private urlSubject = new Subject<string>();
  private context: ResourceDataContext;

  constructor(protected viewContainer: ViewContainerRef,
              protected templateRef: TemplateRef<ResourceDataContext>,
              protected loader: ViewDataLoader,
              protected registry: ResourceViewRegistry) {
    this.context = new ResourceDataContext(this.mockView('', MEDIA_TYPE_ROUTER_LOADING, 204, 'OK'));

    // Handle url changes
    this.urlSubject
      .switchMap(url => this.load(url))
      .subscribe(data => {
        // Update data
        this.context.$implicit = data;

        // This propagates back the actual url when server-side redirect was performed
        if (data.url !== this.urlValue) {
          this.urlValue = data.url;
          this.urlChange.emit(this.urlValue);
        }
      });
  }

  // Unused but needed when used in decomposed notation directly on <template>
  // noinspection JSUnusedLocalSymbols
  @Input()
  set resourceData(value: any) {
  }

  @Input()
  set resourceDataOf(value: string) {
    this.url = value;
  }

  get url(): string {
    return this.urlValue;
  }

  set url(value: string) {
    // This is needed check, since during runtime binding, we cannot be sure value isn't null
    if (!value) {
      value = '';
    }

    // Emit event if value has actually changed
    if (this.urlValue !== value) {
      this.urlValue = value;
      this.urlSubject.next(value);
    }
  }

  load(url: string): Observable<ViewData<any>> {
    if (url) {
      return this.loader
        .fetch(url, this)
        .catch(err => {
          // Log it, this should not happen normally
          console.error(err);
          // Return error view
          return Observable.of(this.mockView(url, MEDIA_TYPE_ROUTER_ERROR, 999, 'Routing Error', err));
        });
    } else {
      return Observable.of(this.mockView('', MEDIA_TYPE_ROUTER_EMPTY, 204, 'OK'));
    }
  }

  ngOnInit() {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }

  go(url: string): void {
    // Update property if changed
    if (this.urlValue !== url) {
      this.urlValue = url;
      this.urlChange.emit(url);
    }

    // Load data (always)
    this.urlSubject.next(this.urlValue);
  }

  private mockView(url: string, type: string, status: number, statusText: string, body?: any): ViewData<any> {
    const config = this.registry.match(type, status);
    return new ViewData<any>(this, config, type, url, status, statusText, NO_HEADERS, body);
  }
}
