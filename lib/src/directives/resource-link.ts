import { Directive, HostListener, Input, Optional } from '@angular/core';
import { ViewData } from '../view-data';
import { NavigationHandler, supportsNavigation } from '../navigation-handler';
import { ApiLocation } from '../api-location';


export const TARGET_SELF = '_self';
export const TARGET_TOP = '_top';

export type TargetType = NavigationHandler | typeof TARGET_SELF | typeof TARGET_TOP;


/**
 * Note: This is limited version of resourceLink, which works on any element, but does not support
 * opening new windows with CTRL key and external URLs.
 */
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
        throw new Error(`Unsupported target '${target}', use <a> tag instead`);
      }
    }

    // Fallback to page navigation
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
