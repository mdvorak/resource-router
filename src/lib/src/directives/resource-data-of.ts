import {
  Directive,
  EventEmitter,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { ViewData } from '../view-data';
import { ResourceData } from '../resource-data';
import { Subscription } from 'rxjs/Subscription';


export class ResourceDataOfContext {
  constructor(private resource: ResourceData) {
  }

  // noinspection JSUnusedGlobalSymbols
  get $implicit(): ViewData<any> {
    return this.resource.data;
  }
}

@Directive({
  selector: '[resourceData][resourceDataOf]',
  providers: [ResourceData]
})
export class ResourceDataOfDirective implements OnInit, OnDestroy {

  @Output()
  readonly urlChange = new EventEmitter<string>();
  private urlSubscription = Subscription.EMPTY;
  private readonly context: ResourceDataOfContext;

  constructor(private viewContainer: ViewContainerRef,
              private templateRef: TemplateRef<ResourceDataOfContext>,
              @Host() private resource: ResourceData) {
    this.context = new ResourceDataOfContext(resource);
  }

  ngOnInit(): void {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);

    // Note: We don't need listen to this.urlChange, since we don't store the url, we just propagate event
    this.urlSubscription = this.resource.urlChange.subscribe((value: string) => this.urlChange.emit(value));
  }

  ngOnDestroy(): void {
    this.urlSubscription.unsubscribe();
  }

  @Input()
  set resourceDataOf(value: string) {
    this.resource.url = value;
  }

  get url(): string {
    return this.resource.url;
  }

  set url(value: string) {
    this.resource.url = value;
  }
}
