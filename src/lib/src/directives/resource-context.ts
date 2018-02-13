import { Directive, FactoryProvider, Input, Self } from '@angular/core';
import { isNavigable, Navigable, NavigableRef, topLevelNavigableRef } from '../navigable';
import { ViewData } from '../view-data';
import { ResourceData } from '../resource-data';
import { ResourceDataOfDirective } from './resource-data-of';


const NOOP_NAVIGABLE: Navigable = {
  go() {
  }
};


/**
 * Directive that provides navigation boundaries for loaded resources (usually via {@link ResourceData}).
 *
 * It should be also used as companion directive for {@link ResourceDataOfDirective}.
 *
 * ## Example
 * Note that this is intentionally unusual setup, to show alternative ways for application to load data.
 * For more common use, see {@link ResourceDataOfDirective} example.
 *
 * ```ts
 * \@Component({
 *   providers: [ResourceData]
 * })
 * export class AppComponent {
 *   constructor(@Self() public readonly resource: ResourceData) {
 *   }
 * }
 * ```
 * ```html
 * <ng-container [resourceContext]="resource">
 *   <a *ngIf="resource.data._links?.next as link" [resourceLink]="link.href">Next</a>
 *   <resource-view [data]="resource.data"></resource-view>
 * </ng-container>
 * ```
 *
 * Note that in previous example, `[resourceContext]` directive could be replaced by programmatically
 * providing navigation context in the `AppComponent`, which is exactly what this directive does.
 */
@Directive({
  selector: '[resourceContext]',
  providers: [
    resourceContextNavigableRef(),
    topLevelNavigableRef()
  ]
})
export class ResourceContextDirective extends NavigableRef {

  navigable: Navigable;

  @Input()
  set resourceContext(value: Navigable | ViewData<any> | undefined) {
    if (isNavigable(value)) {
      // Directly navigable
      this.navigable = value;
    } else if (value && isNavigable(value.target)) {
      // ViewData for easy use with resourceDataOf
      this.navigable = value.target;
    } else {
      // Resort to no-op, since during loading phases, this actually might be undefined,
      // and while it is useless at that state, it might be hard to work around it
      this.navigable = NOOP_NAVIGABLE;
    }
  }
}

export function resourceContextNavigableRef(): FactoryProvider {
  return {
    provide: NavigableRef,
    useFactory: resourceContextNavigableRefFactory,
    deps: [
      [ResourceContextDirective, new Self()]
    ]
  };
}

/**
 * @internal
 */
export function resourceContextNavigableRefFactory(self: ResourceContextDirective) {
  return self;
}
