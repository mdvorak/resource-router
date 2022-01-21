import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Self } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourceData, resourceDataNavigableRef } from '../resource-data';
import { topLevelNavigableRef } from '../navigable';


/**
 * Loads and renders data from given URL. Support navigation via `_self`.
 *
 * For more complicated use-cases, see {@link ResourceDataOfDirective}.
 *
 * @example
 * <!-- To bind to browser location, provide apiLocation as component property and use its url -->
 * <resource-outlet [(src)]="apiLocation.url"></resource-outlet>
 *
 * <!-- To view referenced content, use link href -->
 * <resource-outlet [(src)]="data._links?.content?.href"></resource-outlet>
 */
@Component({
  selector: 'resource-outlet',
  template: '<resource-view [data]="resource.data"></resource-view>',
  providers: [
    ResourceData,
    resourceDataNavigableRef(),
    topLevelNavigableRef()
  ]
})
export class ResourceOutletComponent implements OnInit, OnDestroy {

  @Output()
  readonly srcChange = new EventEmitter<string>();
  private subscription = Subscription.EMPTY;

  constructor(@Self() readonly resource: ResourceData) {
  }

  ngOnInit(): void {
    this.subscription = this.resource.urlChange.subscribe((value: string) => this.srcChange.emit(value));
  }

  @Input()
  set src(value: string) {
    this.resource.url = value;
  }

  get src(): string {
    return this.resource.url;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
