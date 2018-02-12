import { Directive, HostListener, Inject, Input, Optional } from '@angular/core';
import { isNavigable, Navigable, NavigableRef, TOP_LEVEL_NAVIGABLE } from '../navigable';
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
              @Optional() @Inject(TOP_LEVEL_NAVIGABLE) private readonly topLevelNavigable?: NavigableRef) {
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
      // Fallback to current when top-level is unavailable
      const topLevel = this.topLevelNavigable || this.currentNavigable;
      target = topLevel && topLevel.navigable;
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
