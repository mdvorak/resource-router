import {
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Self,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { ViewData } from '../view-data';
import { ResourceData, resourceDataNavigableRef } from '../resource-data';
import { Subscription } from 'rxjs';
import { bindUrl, isLocationReference, LocationReference } from '../location-reference';
import { ResourceOutletComponent } from './resource-outlet';
import { topLevelNavigableRef } from '../navigable';
import { ResourceContextDirective } from './resource-context';


/**
 * Context for structural directive {@link ResourceDataOfDirective}.
 *
 * For examples see the directive docs.
 */
export class ResourceDataOfContext {
  constructor(private readonly resource: ResourceData) {
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Default variable value. Contains currently loaded data.
   * Never undefined.
   *
   * Provides value from {@link ResourceData#data}.
   */
  get $implicit(): ViewData<any> {
    return this.resource.data;
  }

  /**
   * Contains currently loaded data.
   * Never undefined.
   *
   * Provides value from {@link ResourceData#data}.
   */
  get data(): ViewData<any> {
    return this.resource.data;
  }

  /**
   * Loading flag for this directive.
   * Provides value from {@link ResourceData#loading}.
   */
  get loading(): boolean {
    return this.resource.loading;
  }
}


/**
 * Structural directive, that loads the data from given source, and allows custom data representation.
 *
 * This is more complex variant of {@link ResourceOutletComponent}. It is needed when you need to show
 * some generic content along with viewed directive, which also depends on loaded data, like menu.
 *
 * Note that until issue [#15998]{@link https://github.com/angular/angular/issues/15998} is resolved,
 * this directive must be used in conjunction with {@link ResourceContextDirective}, as seen in the example.
 *
 * @example
 * <!-- apiLocation is host component property -->
 * <div *resourceData="let data of apiLocation" [resourceContext]="data">
 *   <!-- Render navigation component as separate resource -->
 *   <resource-outlet [src]="data._links?.nav?.href"></resource-outlet>
 *
 *   <!-- Render main content -->
 *   <resource-view [data]="data"></resource-view>
 *
 *   <!-- Application-wide navigation -->
 *   <div>
 *     <a *ngIf="data._links?.back as link"
 *        [resourceLink]"="link.href">Back</a>
 *   </div>
 * </div>
 */
@Directive({
  selector: '[resourceData][resourceDataOf]',
  providers: [
    ResourceData,
    resourceDataNavigableRef(),
    topLevelNavigableRef()
  ]
})
export class ResourceDataOfDirective implements OnInit, OnDestroy {

  /**
   * Emits event whenever underlying {@link ResourceData#url} changes.
   *
   * Note that there is no way to bind to this event when using asterisk (`*resourceData=`) syntax. This is Angular
   * limitation.
   *
   * Example:
   * ```html
   *<ng-template resourceData [resourceDataOf]="apiLocation.url"
   *             let-data
   *             (urlChange)="apiLocation.url=$event">
   *    <resource-view [data]="data"></resource-view>
   *</ng-template>
   *```
   */
  @Output()
  readonly urlChange = new EventEmitter<string>();
  private readonly context: ResourceDataOfContext;
  private urlSubscription = Subscription.EMPTY;
  private sourceSubscription = Subscription.EMPTY;

  constructor(@Self() public readonly resource: ResourceData,
              private readonly viewContainer: ViewContainerRef,
              private readonly templateRef: TemplateRef<ResourceDataOfContext>) {
    this.context = new ResourceDataOfContext(resource);
  }

  /**
   * @internal
   */
  ngOnInit(): void {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);

    // Note: We don't need listen to this.urlChange, since we don't store the url, we just propagate event
    this.urlSubscription = this.resource.urlChange.subscribe((value: string) => this.urlChange.emit(value));
  }

  /**
   * @internal
   */
  ngOnDestroy(): void {
    this.urlSubscription.unsubscribe();
    this.sourceSubscription.unsubscribe();
  }

  /**
   * Location, from which are data loaded.
   *
   * This might be either string (note that two-way binding is not directly supported for structural directives,
   * see {@link #urlChange}), or {@link LocationReference}, which provides automatic two-way binding
   * for the {@link LocationReference#url}.
   */
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
