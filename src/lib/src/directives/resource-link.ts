import { Directive, HostListener, Input, Optional } from '@angular/core';
import { Navigable, supportsNavigation } from '../navigable';
import { ApiLocation } from '../api-location';
import { ActivatedView } from '../activated-view';


export const TARGET_SELF = '_self';
export const TARGET_TOP = '_top';

export type TargetType = Navigable | typeof TARGET_SELF | typeof TARGET_TOP;


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

  constructor(private readonly apiLocation: ApiLocation,
              @Optional() private readonly view?: ActivatedView<any>) {
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
      target.navigate(this.resourceLink);
    }

    // And cancel click
    return true;
  }
}
