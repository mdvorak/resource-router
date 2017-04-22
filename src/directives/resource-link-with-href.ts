import { Directive, HostBinding, HostListener, Input, OnChanges, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { TARGET_SELF, TARGET_TOP, TargetType } from './resource-link';
import { ApiMapper } from '../api-mapper';
import { ResourceViewRegistry } from '../resource-view-registry';
import { ViewData } from '../view-data';
import { supportsNavigation } from '../navigation-handler';

@Directive({selector: 'a[resourceLink]'})
export class ResourceLinkWithHrefDirective implements OnChanges {

  @HostBinding() href: string;
  @Input() resourceLink: string;
  @Input() type?: string;
  @Input() target?: TargetType;
  @Input() external = false;

  private navigationUrl: string | null;

  constructor(private apiMapper: ApiMapper,
              private location: Location,
              private resourceViewRegistry: ResourceViewRegistry,
              @Optional() private view?: ViewData<any>) {
  }

  ngOnChanges(): void {
    let external = this.external;

    // Is the link supported? Note that its pointless for external links
    if (this.type && !external) {
      // Is it known type for successful response?
      // Note that this mechanism does not work for other status codes, you will have to set [external] manually
      external = !this.resourceViewRegistry.match(this.type, 200);
    }

    // Map to API, if it fails, mark as external
    let viewUrl = this.resourceLink || '';
    if (viewUrl && !external) {
      // Map API to View
      const url = this.apiMapper.mapApiToView(viewUrl);
      if (url) {
        // Mapped
        viewUrl = url;
      } else {
        // Force external link - viewUrl is still original url
        external = true;
      }
    }

    // Store mapped URL to href
    this.href = this.location.prepareExternalUrl(viewUrl);

    // And if possible, allow in-app navigation
    this.navigationUrl = !external ? viewUrl : null;
  }

  @HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey'])
  onClick(button: number, ctrlKey: boolean, metaKey: boolean): boolean {
    // Let the browser do the navigation if any key was pressed or this link external
    if (button !== 0 || ctrlKey || metaKey || !this.resourceLink || this.external) {
      return true;
    }

    // Handle target
    let target = this.target;

    if (typeof target === 'string') {
      if (target === TARGET_SELF) {
        target = this.view && this.view.navigation;
      } else if (target === TARGET_TOP) {
        target = undefined;
      } else {
        // Custom target, open new window
        return true;
      }
    }

    // Custom target
    if (supportsNavigation(target)) {
      // Navigate using original non-mapped link
      target.go(this.resourceLink);
      return false;
    } else if (this.navigationUrl) {
      // Default - navigate using page location
      // TODO configurable by ViewDef.defaultNavigationTarget
      this.location.go(this.navigationUrl);
      return false;
    } else {
      // Don't do anything
      return false;
    }
  }
}
