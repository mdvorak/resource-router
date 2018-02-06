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
import { bindUrl, isLocationReference, LocationReference } from '../location-reference';


export class ResourceDataOfContext {
  constructor(private readonly resource: ResourceData) {
  }

  // noinspection JSUnusedGlobalSymbols
  get $implicit(): ViewData<any> {
    return this.resource.data;
  }

// noinspection JSUnusedGlobalSymbols
  get loading(): boolean {
    return this.resource.loading;
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
  private sourceSubscription = Subscription.EMPTY;

  constructor(@Host() public readonly resource: ResourceData,
              private readonly viewContainer: ViewContainerRef,
              private readonly templateRef: TemplateRef<ResourceDataOfContext>) {
    this.context = new ResourceDataOfContext(resource);
  }

  ngOnInit(): void {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);

    // Note: We don't need listen to this.urlChange, since we don't store the url, we just propagate event
    this.urlSubscription = this.resource.urlChange.subscribe((value: string) => this.urlChange.emit(value));
  }

  ngOnDestroy(): void {
    this.urlSubscription.unsubscribe();
    this.sourceSubscription.unsubscribe();
  }

  @Input()
  set resourceDataOf(value: string | LocationReference | undefined) {
    // Remove old source (if any)
    this.sourceSubscription.unsubscribe();

    if (typeof value === 'string') {
      // Simple one-way URL bind
      this.resource.url = value;
    } else if (isLocationReference(value)) {
      // Bind urls to new
      this.sourceSubscription = bindUrl(value, this.resource);
    } else {
      // Reset
      this.resource.url = '';
    }
  }
}
