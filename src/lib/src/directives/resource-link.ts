import { Directive, HostListener, Inject, Input, Optional } from '@angular/core';
import { isNavigable, Navigable, NavigableRef, ROOT_NAVIGABLE } from '../navigable';
import { debugLog } from '../debug-log';


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

  constructor(@Optional() private readonly currentNavigable?: NavigableRef,
              @Inject(ROOT_NAVIGABLE) @Optional() private readonly rootNavigable?: NavigableRef) {
  }

  @HostListener('click')
  onClick(): boolean {
    // Handle target
    let target = this.target;

    if (typeof target === 'string' && target) {
      if (target === TARGET_SELF) {
        target = this.currentNavigable && this.currentNavigable.navigable;
        // Warn if undefined
        if (!target) {
          debugLog.warn('When resourceLink is not in a resource-view, target="_self" is not supported');
        }
      } else if (target === TARGET_TOP) {
        target = undefined;
      } else {
        throw new Error(`Unsupported target '${target}', use <a> tag instead`);
      }
    }

    // Fallback to page navigation
    if (!target) {
      // Fallback to current when root is unavailable
      const root = this.rootNavigable || this.currentNavigable;
      target = root && root.navigable;
      // Warn if undefined
      if (!target) {
        debugLog.warn(`When resourceLink is not embedded in a <resource-view> component, ` +
          `it must have target set to a Navigable instance - navigation to "${this.resourceLink}" canceled`);
      }
    }

    // Navigate
    if (isNavigable(target)) {
      target.go(this.resourceLink);
    }

    // And cancel click
    return false;
  }
}
