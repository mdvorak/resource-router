import { Directive, FactoryProvider, forwardRef, Input, Self } from '@angular/core';
import { isNavigable, Navigable, NavigableRef, topLevelNavigableRef } from '../navigable';
import { ViewData } from '../view-data';


/**
 * @internal
 */
const NOOP_NAVIGABLE: Navigable = {
  go: () => {
  }
};

/**
 * @internal
 */
export const resourceContextNavigableRef = (): FactoryProvider => ({
  provide: NavigableRef,
  useFactory: resourceContextNavigableRefFactory,
  deps: [
    [forwardRef(() => ResourceContextDirective), new Self()]
  ]
});

/**
 * @internal
 */
export const resourceContextNavigableRefFactory = (self: ResourceContextDirective) => self;


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

  navigable: Navigable = NOOP_NAVIGABLE;

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
