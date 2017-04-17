import { Directive, HostBinding, HostListener, Input, OnChanges, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { ResourceViewRegistry } from '../resource-view-registry';
import { ApiUrl } from '../api-url';
import { ViewData } from '../view-data';
import { NavigationHandler, supportsNavigation } from '../navigation-handler';
import { ApiLocation } from '../api-location';


export const TARGET_SELF = '_self';
export const TARGET_TOP = '_top';

export type TargetType = NavigationHandler | typeof TARGET_SELF | typeof TARGET_TOP;

@Directive({
  selector: ':not(a)[resourceLink]'
})
export class ResourceLinkDirective {

  @Input() resourceLink: string;
  @Input() target?: TargetType;

  constructor(private apiLocation: ApiLocation,
              @Optional() private view?: ViewData<any>) {
  }

  @HostListener('click')
  onClick(): boolean {
    // Handle target
    let target = this.target;

    if (typeof target === 'string' && target) {
      if (target === TARGET_SELF) {
        target = this.view && this.view.navigation;
      } else if (target === TARGET_TOP) {
        target = undefined;
      } else {
        throw new Error(`Unsupported target '${target}', try <a> tag instead`);
      }
    }

    // Fallback to page navigation
    // TODO configurable by ViewDef.defaultNavigationTarget
    if (!target) {
      target = this.apiLocation;
    }

    // Navigate
    if (supportsNavigation(target)) {
      target.go(this.resourceLink);
    }

    // And cancel click
    return true;
  }
}

@Directive({selector: 'a[resourceLink]'})
export class ResourceLinkWithHrefDirective implements OnChanges {

  @HostBinding() href: string;
  @Input() resourceLink: string;
  @Input() type?: string;
  @Input() target?: TargetType;
  @Input() external = false;

  constructor(private apiUrl: ApiUrl,
              private location: Location,
              private resourceViewRegistry: ResourceViewRegistry,
              @Optional() private view?: ViewData<any>) {
  }

  ngOnChanges(): void {
    // Is the link supported? Note that its pointless for external links
    if (this.type && !this.external) {
      // Is it known type for successful response?
      // Note that this mechanism does not work for other status codes, you will have to set [external] manually
      this.external = !this.resourceViewRegistry.match(this.type, 200);
    }

    // Map to API, if it fails, mark as external
    let viewUrl = this.resourceLink;
    if (!this.external && viewUrl) {
      const url = this.apiUrl.mapApiToView(viewUrl);
      if (url) {
        viewUrl = url;
      } else {
        this.external = true;
      }
    }

    // Store mapped URL to href
    this.href = this.location.prepareExternalUrl(viewUrl);
  }

  @HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey'])
  onClick(button: number, ctrlKey: boolean, metaKey: boolean): boolean {
    // Let the browser do the navigation if any key was pressed or this link is external
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
      // Navigate
      target.go(this.resourceLink);
      return false;
    } else {
      // Default
      // TODO configurable by ViewDef.defaultNavigationTarget
      this.location.go(this.href);
      return false;
    }
  }
}
