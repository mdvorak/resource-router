import { Input, Output, EventEmitter, Directive, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { ViewDataLoader } from '../view-data-loader';
import { ViewData } from '../view-data';
import { NavigationHandler, UrlType } from '../navigation-handler';
import { ResourceViewRegistry } from '../resource-view-registry';
import { MEDIA_TYPE_ROUTER_ERROR, MEDIA_TYPE_ROUTER_EMPTY, MEDIA_TYPE_ROUTER_LOADING } from '../system-media-types';


@Directive({
  selector: '[resourceData][resourceDataOf]'
})
export class ResourceDataDirective implements OnInit, NavigationHandler {

  @Output() urlChange = new EventEmitter<UrlType>();

  private urlValue: UrlType;
  private context: ResourceDataContext;

  constructor(protected viewContainer: ViewContainerRef,
              protected templateRef: TemplateRef<ResourceDataContext>,
              protected loader: ViewDataLoader,
              protected registry: ResourceViewRegistry) {
    this.context = new ResourceDataContext(this.mockView('', MEDIA_TYPE_ROUTER_LOADING, 204, 'OK'));

    // Handle src changes
    this.urlChange
      .switchMap(url => this.load(url))
      .subscribe(data => this.context.$implicit = data);
  }

  // Unused but needed when used in decomposed notation directly on <template>
  @Input()
  set resourceData(value: any) {
  }

  @Input()
  set resourceDataOf(value: string) {
    this.url = value;
  }

  get url(): UrlType {
    return this.urlValue;
  }

  set url(value: UrlType) {
    if (this.urlValue !== value) {
      this.urlValue = value;
      this.urlChange.emit(value);
    }
  }

  load(url: UrlType): Observable<ViewData<any>> {
    if (url) {
      return this.loader
        .fetch(url, this)
        .catch(err => Observable.of(this.mockView(url, MEDIA_TYPE_ROUTER_ERROR, 999, 'Router Error', err)));
    } else {
      return Observable.of(this.mockView('', MEDIA_TYPE_ROUTER_EMPTY, 204, 'OK'));
    }
  }

  ngOnInit() {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }

  go(url: string): void {
    // Always fire the event, which forces the data to be reloaded
    this.urlValue = url;
    this.urlChange.emit(url);
  }

  private mockView(url: string, type: string, status: number, statusText: string, body?: any): ViewData<any> {
    const config = this.registry.match(type, status);
    return new ViewData<any>(this, config, type, url, status, statusText, new Headers(), body);
  }
}

export class ResourceDataContext {
  constructor(public $implicit: ViewData<any>) {
  }
}
