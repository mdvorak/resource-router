import { Directive, EventEmitter, Host, Input, OnDestroy, OnInit, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import { ViewData } from '../view-data';
import { ResourceData } from '../resource-data';
import { ISubscription } from 'rxjs/Subscription';


/**
 * @deprecated
 */
export class ResourceDataOfContext {
  constructor(private resource: ResourceData) {
  }

  get $implicit(): ViewData<any> {
    return this.resource.data;
  }
}


/**
 * @deprecated
 */
@Directive({
  selector: '[resourceDataOf]',
  providers: [ResourceData]
})
export class ResourceDataOfDirective implements OnInit, OnDestroy {

  @Output()
  readonly urlChange = new EventEmitter<string>();
  private context: ResourceDataOfContext;
  private subscription: ISubscription;

  constructor(private viewContainer: ViewContainerRef,
              private templateRef: TemplateRef<ResourceDataOfContext>,
              @Host() private resource: ResourceData) {
    this.context = new ResourceDataOfContext(resource);
  }

  ngOnInit(): void {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    this.subscription = this.resource.urlChange.subscribe((value: string) => this.urlChange.emit(value));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * @deprecated
   */
  @Input()
  set resourceData(value: any) {
  }

  @Input()
  set resourceDataOf(value: string) {
    this.url = value;
  }

  get url(): string {
    return this.resource.url;
  }

  set url(value: string) {
    this.resource.url = value;
  }
}
